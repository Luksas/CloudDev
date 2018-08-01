<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Currntly given users registered gateways and slaves
 *
 * @author Luksa
 */
class Userdata {
    
    public $id;
    public $roles;
    public $username;
    public $email;
    public $gateways;
    public $slaves;
    
    public function isGatewayOwner($gateway_id){
        if ($this->gateways == null || !is_array($this->gateways)) {
            return false;
        }
        
        foreach ($this->gateways as $gateway) {
            if ($gateway->id == $gateway_id) {
                return true;
            }
        }
        
        return false;
    }
    
    public function isSlaveOwner($slave_id){
        if ($this->slaves == null || !is_array($this->slaves)) {
            return false;
        }
        
        foreach ($this->slaves as $slave) {
            if ($slave->id == $slave_id) {
                return true;
            }
        }
        
        return false;
    }
    
    public function isAdmin(){
        if (!is_array($this->roles)) {
            return false;
        }
        
        return in_array('ADMIN', $this->roles);
    }
    
    public function isUser(){
        if (!is_array($this->roles)) {
            return false;
        }
        
        return in_array('USER', $this->roles);
    }
    
    public function isGuest(){
        if (!is_array($this->roles)) {
            return false;
        }
        
        return in_array('GUEST', $this->roles);
    }
    
    public function getGateways() {
        return $this->gateways;
    }
    
    public function getGatewayIdArray(){
        $arr = array();
        
        foreach ($this->gateways as $gateway) {
            array_push($arr, $gateway->id);
        }
        
        return $arr;
    }

    public function setGateways($gateways) {
        $this->gateways = $gateways;
    }
    
    public function getSlaves() {
        return $this->slaves;
    }

    public function setSlaves($slaves) {
        $this->slaves = $slaves;
    }

    public function getId() {
        return $this->id;
    }

    public function getRoles() {
        return $this->roles;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setRoles($roles) {
        $this->roles = array();
        
        foreach ($roles as $role) {
            array_push($this->roles, $role->name);
        }
    }

    public function setUsername($username) {
        $this->username = $username;
    }

    public function setEmail($email) {
        $this->email = $email;
    }
    
    public function clean(){
        $this->id = null;
        $this->username = null;
        $this->email = null;
        $this->roles = null;
    }


}
