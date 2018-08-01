<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Gateway_model
 *
 * @author Luksa
 */
class Gateway_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function register($gateway_data){
        return $this->db->insert("Gateways", $gateway_data);
    }
    
    public function getGatewaysByUserId($current_user_id){
        return $this->db->query("SELECT * FROM Gateways WHERE users_id = {$this->db->escape($current_user_id)}")->result();
    }
    
    public function getGatewayIdByMAC($mac){
        $gateway = $this->db->query("SELECT id FROM Gateways WHERE mac = {$this->db->escape($mac)}")->row();
       
        if (is_object($gateway)) {
            return $gateway->id;
        }
        
        return -1;
    }
    
    public function isMACRegistered($mac){
        return is_object($this->db->query("SELECT id FROM Gateways WHERE mac = {$this->db->escape($mac)}")->row());
    }
    
}
