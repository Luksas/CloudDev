<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Devices
 *
 * @author Luksa
 */
class Devices extends MY_Controller {
    
    public function __construct() {
        parent::__construct(array('LOAD_GATEWAYS')); // TO-DO create option provider
        
        if (!$this->userdata->isGuest()) {
            $this->response->dieWithError(1);
        }
        
        $this->load->model('Slaves_model');
    }
    
    public function register(){
        $input = (object) $this->input->myPost();
        
        if (!isset($input->name) || !isset($input->mac)) {
            $this->response->dieWithError('MISSING_NAME_OR_MAC');
        }
        
        // Cleanup mac string
        $input->mac = preg_replace("/[^A-Za-z0-9]/", "", $input->mac);
        
        if ($this->Gateway_model->isMACRegistered($input->mac)) {
            $this->response->dieWithError("MAC_IS_ALREADY_REGISTERED");
        }
        
        $this->Gateway_model->register(array(
            'name' => $input->name,
            'mac' => $input->mac,
            'status_id' => 0,
            'users_id' => $this->userdata->getId()
        ));
        
        $this->response->dieWithError(0);
    }
    
    public function updateSlave(){
        $ahu = $this->input->myPost(null, true);
        
        if (!$this->userdata->isGatewayOwner($ahu->gateway_id)) {
            $this->response->dieWithError('YOU_CANNOT_EDIT_THE_DEVICE');
        }
        
        if ($this->Slaves_model->isFreeBoardAddress($ahu->board_address, $ahu->gateway_id)) {
            $this->response->dieWithError('BOARD_ADDRESS_ALREADY_IN_USE');
        }
        
        if (is_object($this->Slaves_model->getSlaveById($ahu->id))) {
            if (!$this->userdata->isSlaveOwner($ahu->id)) {
                $this->response->dieWithError('YOU_CANNOT_UPDATE_GIVEN_SLAVE');
            }
            
            $this->Slaves_model->update($ahu->id, $ahu->ahu_name, $ahu->board_address, $ahu->gateway_id);
            $this->response->dieWithError(0);
        }
        
        $this->Slaves_model->insert($ahu->ahu_name, $ahu->board_address, $ahu->gateway_id);
        $this->response->dieWithError(0);
    }
    
    public function removeSlave($slave_id){
        if (!$this->userdata->isSlaveOwner($slave_id)) {
            $this->response->dieWithError("YOU_CANNOT_REMOVE_THE_DEVICE");
        }
        
        $this->Slaves_model->deleteById($slave_id);
        $this->response->dieWithError(0);
    }
    
    public function getDevices(){
        $gateway_list = $this->Gateway_model->getGatewaysByUserId($this->userdata->getId());
        
        foreach ($gateway_list as &$gateway) {
            $gateway->slaves = $this->Slaves_model->getSlavesByGatewayId($gateway->id);
        }
        
        $this->response->setData($gateway_list);
        $this->response->dieWithError(0);
    }
    
    public function getDeviceSlaves($gateway_id){
        if (!$this->userdata->isGatewayOwner($gateway_id)) {
            $this->response->dieWithError("YOU_CANNOT_GET_DEVICES");
        }
        
        $this->response->setData($this->Slaves_model->getSlavesByGatewayId($gateway_id));
        $this->response->dieWithError(0);
    }
    
    public function getAllUserSlaves(){
        $gateway_list = $this->Gateway_model->getGatewaysByUserId($this->userdata->getId());
        
        $slaves_array = array();
        foreach ($gateway_list as &$gateway) {
            
            $slaves = $this->Slaves_model->getSlavesByGatewayId($gateway->id);
            foreach ($slaves as $slave) {
                array_push($slaves_array, $slave);
            }
        }
        
        $this->response->setData($slaves_array);
        $this->response->dieWithError(0);
    }
    
}
