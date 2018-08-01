<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Register_model
 *
 * @author Luksa
 */
class Register_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function updateRegister($register){
        $this->update($register->getSlavesId(), $register->getValue(), $register->getAddress(), $register->getModbusFunctionCode());
    }
    
    public function update($slave_id, $value, $address, $modbus_function_code){
        if ($this->exists($slave_id, $address, $modbus_function_code)) {
            $this->db->query("UPDATE Registers "
                . " SET value = {$this->db->escape($value)}, "
                . " date = NOW() "
                . " WHERE slaves_id = {$this->db->escape($slave_id)}"
                . " AND address = {$this->db->escape($address)} "
                . " AND modbus_function_code = {$this->db->escape($modbus_function_code)}" );
            return;
        }
        
        $this->db->query("INSERT INTO Registers (modbus_function_code, value, address, slaves_id, date)"
                . " VALUES ({$this->db->escape($modbus_function_code)}, {$this->db->escape($value)}, {$this->db->escape($address)}, {$this->db->escape($slave_id)}, NOW())");
    }
    
    public function getAllRegistersBySlaveId($slaves_id){
        return $this->db->query("SELECT *"
                . " FROM Registers"
                . " WHERE slaves_id = {$this->db->escape($slaves_id)}")->result();
    }
    
    private function exists($slave_id, $address, $modbus_function_code){
        return count($this->db->query("SELECT * FROM Registers"
            . " WHERE slaves_id = {$this->db->escape($slave_id)}"
            . " AND modbus_function_code = {$this->db->escape($modbus_function_code)}"
            . " AND address = {$this->db->escape($address)} "
        )->result()) > 0;
    }
    
    
    
}
