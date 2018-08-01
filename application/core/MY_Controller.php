<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MY_Controller
 *
 * @author Luksa
 */
class MY_Controller extends CI_Controller {
    
    /**
     * Currently logged in users data
     * @var Userdata 
     */
    public $userdata;
    
    public function __construct($options = array()) {
        parent::__construct();
        
        $this->load->model('Users_model');
        $this->load->model('Role_model');
        $this->load->library('session');
        $this->load->library("Response");
        $this->load->library("Userdata");
        
        $this->loadCurrentUserDataFromSession($options);
    }
    
    protected function loadCurrentUserDataFromSession($options = array()){
        $username = $this->session->userdata('username');
        
        if ($username == null) {
            return;
        }
        
        $user = $this->Users_model->getUserByUsername($username);
        
        $this->userdata = new Userdata();
        $this->userdata->setId($user->id);
        $this->userdata->setUsername($user->username);
        $this->userdata->setEmail($user->email);
        $this->userdata->setRoles($this->Role_model->getRolesBySum($user->role_id));
        
        if (in_array('LOAD_GATEWAYS', $options)) {
            $this->load->model('Gateway_model');
            $this->load->model('Slaves_model');
            
            $this->userdata->setGateways($this->Gateway_model->getGatewaysByUserId($user->id));
            
            $slaves = $this->Slaves_model->getSlavesByGatewayIdArray($this->userdata->getGatewayIdArray());
            
            $this->userdata->setSlaves($slaves);
        }
    }

}
