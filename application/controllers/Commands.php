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
class Commands extends CI_Controller {

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
     * Returns command hex for given gateway
     */
    public function getCommands() {
        $this->Commands_model->cleanDuplicateCommands();

        $commands = $this->Commands_model->getCommandsByMAC($this->inputparser->getMAC());
        
        if (count($commands) == 0) {
            $this->load->model('Commands_provider_model');
            
            $gateway_id = $this->Gateway_model->getGatewayIdByMAC($this->inputparser->getMAC());
            $slaves_array = $this->Slaves_model->getSlavesIdArrayByGatewayId($gateway_id);
            
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
        $this->commandmanager->flush();
        
        header('Content-Length: ' . strlen($command_hex_to_print));
        print $command_hex_to_print;
    }
    
    public function test(){
        $initialization_vector = random_bytes(16);
        $text = $this->encrypt("ID=13286&MAC=d02212900154", $initialization_vector);
        header('Content-Length: ' . strlen($initialization_vector . $text));
        print $initialization_vector . $text;
//        $input = file_get_contents("php://input");
//
//        $this->Logs_model->logg("encoded text", $input);
//        
//        $key = pack('H*', "2c887b62c2b31dac84613c99571e4aa4");
//
//        // Gets the encryption vector size.
//        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
//
//        // Retriave the IV, iv_size should be created using mcrypt_get_iv_size()
//        $iv_dec = substr($input, 0, $iv_size);
//
//        # retrieves the cipher text (everything except the $iv_size in the front)
//        $input_without_iv = substr($input, $iv_size);
//
//        # may remove 00h valued characters from end of plain text
//        $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $input_without_iv, MCRYPT_MODE_CBC, $iv_dec);
//
//        parse_str($plaintext_dec);
//        
//        $this->Logs_model->logg("decoded text", $plaintext_dec);
    }
    
    public function encrypt($data, $initialization_vector){
        $key = pack('H*', "000102030405060708090A0B0C0D0E0F");
        $padding = 16 - (strlen($data) % 16);
        $padding_str = str_repeat(chr($padding), $padding);
        return mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $data . $padding_str, MCRYPT_MODE_CBC, $initialization_vector);
    }

}
