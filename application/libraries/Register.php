<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Register
 *
 * @author Luksa
 */
class Register {
    
    public $modbus_function_code;
    
    public $address;
    
    public $value;
    
    public $slaves_id;
    
    public $need_to_log = true;
    
    public function getModbusFunctionCode() {
        return $this->modbus_function_code;
    }

    public function getAddress() {
        return $this->address;
    }

    public function getValue() {
        return $this->value;
    }
    
    public function get16BitValue(){
        return $this->value > (65535 / 2) ? $this->value - 65535 : $this->value;
    }

    public function getSlavesId() {
        return $this->slaves_id;
    }

    public function setModbusFunctionCode($modbus_function_code) {
        $this->modbus_function_code = $modbus_function_code;
    }

    public function setAddress($address) {
        $this->address = $address;
    }

    public function setValue($value) {
        $this->value = $value;
    }

    public function setSlavesId($slaves_id) {
        $this->slaves_id = $slaves_id;
    }    
    
    public function dontLog(){
        $this->need_to_log = false;
    }
    
    public function needToLog(){
        return $this->need_to_log;
    }


    
}
