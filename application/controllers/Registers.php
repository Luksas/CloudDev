<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Registers
 *
 * @author Luksa
 */
class Registers extends MY_Controller {
    
    public function __construct() {
        parent::__construct(array("LOAD_GATEWAYS"));
        
        $this->load->model('Register_model');
        $this->load->model('Slaves_model');
        $this->load->model('Commands_model');
	$this->load->library("Command");
        $this->load->helper('Modbus');
    }
    
    public function setSingleRegister(){
        $input = (object) $this->input->myPost();
        
        $this->dieIfNotOwner($input->slave_id);
        $slave = $this->Slaves_model->getSlaveById($input->slave_id);
        
        $command = new Command();
        $command->setPriority(Command::PRIORITY_HIGH);
        $command->setGatewayId($slave->gateway_id);
        $command->setBoardAddress($slave->board_address);
        $command->setModbusFunctionCode(convertFunctionCodeToWrite($input->modbus_function_code));
        $command->setStartAddress($input->address);
        $command->setAddressCount(1);
        $command->setAddressValues(array($input->value));
        
        $this->Commands_model->insert($command);
        $this->Register_model->update($input->slave_id, $input->value, $input->address, $input->modbus_function_code);
    }
    
    public function getSlavesDataBySlavesId($slaves_id){
        $this->dieIfNotOwner($slaves_id);
        
        $registers = $this->Register_model->getAllRegistersBySlaveId($slaves_id);
        
        $this->response->setData($registers);
        $this->response->dieWithError(0);
    }

    
    // To-do move somewhere better
    public function addReadCommand(){
        $commands = json_decode($this->input->myPost('commands'));
        
        foreach ($commands as $command) {
            
            // Security here..
            if (!$this->userdata->isGatewayOwner($command->gateway_id)) {
                continue;
            }
            
            $temp_command = new Command();
            $temp_command->setPriority($command->priority);
            $temp_command->setGatewayId($command->gateway_id);
            $temp_command->setBoardAddress($command->board_address);
            $temp_command->setModbusFunctionCode($command->modbus_function_code);
            $temp_command->setStartAddress($command->start_address);
            $temp_command->setAddressCount($command->count);     
            
            // Only add the command if it doesnt already exist...
            if (!$this->Commands_model->exists($temp_command)) {
                $this->Commands_model->insert($temp_command);
            }
        }
    }
    
        
    private function dieIfNotOwner($slaves_id){
        $gateway_id = $this->Slaves_model->getSlavesGatewayId($slaves_id);
        
        if (!$this->userdata->isGatewayOwner($gateway_id)) {
            $this->response->dieWithError(1);
        }
    }
    
}
