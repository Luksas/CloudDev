<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Slaves_model
 *
 * @author Luksa
 */
class Slaves_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function deleteById($slave_id){
        $this->db->query("DELETE FROM Slaves WHERE id = {$this->db->escape($slave_id)}");
    }
    
    public function update($id, $name, $board_address, $gateway_id){
        $this->db->where('id', $id);
        $this->db->update('Slaves', array(
            'ahu_name' => $name,
            'board_address' => $board_address,
            'gateway_id' => $gateway_id
        ));
    }
    
    public function isFreeBoardAddress($board_address, $gateway_id){
        $item = $this->db->query("SELECT id FROM Slaves WHERE board_address = {$this->db->escape($board_address)} AND gateway_id = {$this->db->escape($gateway_id)}")->row();
        
        return is_object($item);
    }
    
    public function insert($name, $board_address, $gateway_id){
        $this->db->insert('Slaves', array(
            'ahu_name' => $name,
            'board_address' => $board_address,
            'gateway_id' => $gateway_id
        ));
    }
    
    
    public function getSlaveById($slave_id){
        return $this->db->query("SELECT * FROM Slaves WHERE id = {$this->db->escape($slave_id)}")->row();
    }
    
    public function getSlaveByGatewayAndBoardAddress($gateway_id, $board){
        return $this->db->query("SELECT * FROM Slaves"
                . " WHERE gateway_id = {$this->db->escape($gateway_id)}"
                . " AND board_address = {$this->db->escape($board)}")->row()->id;
    }
    
    public function getSlavesGatewayId($slaves_id){
        $object = $this->db->query("SELECT gateway_id FROM Slaves WHERE id = {$this->db->escape($slaves_id)}")->row();
        
        if (is_object($object)) {
            return $object->gateway_id;
        }
        
        return -1;
    }
    
    public function getSlavesByGatewayId($gateway_id){
        return $this->db->query("SELECT * FROM Slaves WHERE gateway_id = {$this->db->escape($gateway_id)}")->result();
    }    
    
    public function getSlavesIdArrayByGatewayId($gateway_id){
        $slaves = $this->getSlavesByGatewayId($gateway_id);
        
        $result = array();
            
        foreach ($slaves as $slave) {
            array_push($result, $slave->id);
        }
            
        return $result;
    }
    
    public function getSlavesByGatewayIdArray($gateway_id_array){
        $temp = array();
        
        foreach ($gateway_id_array as $gateway_id) {
            $slaves = $this->getSlavesByGatewayId($gateway_id);
            
            foreach ($slaves as $slave) {
                array_push($temp, $slave);
            }
        }
        
        return $temp;
    }
    
}
