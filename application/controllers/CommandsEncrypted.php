<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Commands
 *
 * @author Luksa
 */
class CommandsEncrypted extends CI_Controller {

    /**
     * Register builder object
     * @var RegisterManager
     */
    public $registermanager;
    
    /**
     * Commands manager object
     * @var CommandManager
     */
    public $commandmanager;
    
    /**
     * InputParser object, used to parse input of device
     * @var InputParser 
     */
    public $inputparser;
    
    /**
     * DataLogger used to log temperature, alarm and other register data
     * @var DataLogger 
     */
    public $datalogger;
    
    public function __construct() {
        parent::__construct();

        $this->load->helper('Modbus');
        $this->load->helper('Encryption');
        $this->load->model('Register_model');
        $this->load->model('Commands_model');
        $this->load->model('Logs_model');
        $this->load->model('Register_history_model');
        $this->load->model('Gateway_model');
        $this->load->model('Slaves_model');
        
        $this->load->library('InputParser');
        $this->load->library('CommandManager');
        $this->load->library('Command');
        $this->load->library('Register');
        $this->load->library('RegisterManager');
        $this->load->library('DataLogger');
        $this->load->model('Alarm_history_model');
        $this->load->model('Temperature_history_model');
        
        $this->inputparser->setEncryptionKey($this->config->item('command_encryption_key'));
        $this->inputparser->loadInput(file_get_contents("php://input"));
    }
    
    /**
     * Parses given gateways data response
     */
    public function setCommands() {
        if ($this->inputparser->isReadParam()) {
            // To-do collect data to some db table?
        }
        
        $commands = $this->Commands_model->getCommandsByMACAndCommandsId($this->inputparser->getMAC(), $this->inputparser->getGatewayCommandId());
        
        $this->registermanager->loadCommands($commands);
        $this->registermanager->loadModbusData($this->inputparser->getData());
        
        $this->registermanager->buildRegisters();
        $this->datalogger->log($this->registermanager->getRegisters());

        $this->commandmanager->loadCommands($this->registermanager->getCommands());
        
        $this->registermanager->flush();
        $this->commandmanager->flush();
    }

    /**
     * Returns command hex for given device (devices)
     */
    public function getCommands() {
        $this->Commands_model->cleanDuplicateCommands();

        $commands = $this->Commands_model->getCommandsByMAC($this->inputparser->getMAC());

        // No commands found for given mac
        if (count($commands) == 0) {
            $this->load->model('Commands_provider_model');
            
            $gateway_id = $this->Gateway_model->getGatewayIdByMAC($this->inputparser->getMAC());
            $slaves_array = $this->Slaves_model->getSlavesIdArrayByGatewayId($gateway_id);
            
            // Missing gateway or no slaves registered.
            if ($gateway_id == -1 || count($slaves_array) == 0) {
                exit;
            }
            
            $commands_to_log = $this->Commands_provider_model->getCommandsForGateway($gateway_id, $slaves_array);
            $this->Commands_model->insertBulk($commands_to_log);            
            $commands = $this->Commands_model->getCommandsByMAC($this->inputparser->getMAC());
        }
        
        if (count($commands) == 0) {
            exit;
        }

        $this->commandmanager->setCommands($commands);
        $command_hex_to_print = $this->commandmanager->getCommandHexToSend($this->inputparser->getGatewayCommandId());
        
        // Add padding for AES128 CBC encryption
        $command_hex_to_print = pack('S', strlen($command_hex_to_print) + 2) . $command_hex_to_print;
        $this->commandmanager->flush();
        
        $encrypted_hex_str = encryptAES128CBC($command_hex_to_print, $this->config->item('command_encryption_key'));
        
        header('Content-Length: ' . strlen($encrypted_hex_str));
        print $encrypted_hex_str;
    }
    

}
