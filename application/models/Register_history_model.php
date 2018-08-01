<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Register_history_model
 *
 * @author Luksa
 */
class Register_history_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        
        $this->db1 = $this->load->database("historydb", TRUE);
    }
    
    /**
     * Returns a list of temperature registers from collected registers to analyze
     * @return Object[]
     */
    public function getTemperatures(){
        return $this->db1->query("SELECT "
            . " MAX(IF(address = 15, value, '0')) AS mode,"
            . " MAX(IF(address = 18, value, '0')) AS supply,"
            . " MAX(IF(address = 19, value, '0')) AS extract,"
            . " MAX(IF(address = 20, value, '0')) AS exhaust,"
            . " MAX(IF(address = 21, value, '0')) AS fresh,"
            . " slave_id, "
            . " MAX(IF(address = 15, id, '0')) AS id1,"
            . " MAX(IF(address = 18, id, '0')) AS id5,"
            . " MAX(IF(address = 19, id, '0')) AS id4,"
            . " MAX(IF(address = 20, id, '0')) AS id3,"
            . " MAX(IF(address = 21, id, '0')) AS id2,"
            . " date "
            . " FROM RegisterHistory"
            . " WHERE address IN (15, 18, 19, 20, 21) AND modbus_function_code = 4"
            . " GROUP BY date;"
        )->result();
    }
    
    /*
     * Returns a list of alarm registers from collected registers to analyze
     * @return Object[]
     */
    public function getAlarmRegisters(){
        return $this->db1->query("SELECT *"
            . " FROM RegisterHistory"
            . " WHERE"
            . " modbus_function_code = 2"
            . " AND address >= 1 "
            . " AND address < 61 "
        )->result();
    }
    
    /**
     * Inserts single register to DB
     * @param Register $register
     */
    public function insertTime($register, $time){
        $this->db1->query("INSERT INTO RegisterHistory "
                . " (modbus_function_code, address, value, slave_id, date) "
                . " VALUES "
                . " ({$this->db1->escape($register->getModbusFunctionCode())},"
                . " {$this->db1->escape($register->getAddress())},"
                . " {$this->db1->escape($register->getValue())},"
                . " {$this->db1->escape($register->getSlavesId())},"
                . " {$this->db1->escape($time)})"
        );
    }

    /**
     * Inserts list of registers to db
     * @param Register[] $registers
     */
    public function insertBulk($registers, $time){
        foreach ($registers as $register) {
            if ($register->needToLog()) {
                $this->insertTime($register, $time);
            }
        }
    }
    
    /**
     * Deletes register history by array of ids
     * @param integer[] $ids
     */
    public function deleteBulk($ids){
        foreach ($ids as $id) {
            $this->delete($id);
        }
    }
    
    /**
     * Deletes single register history item
     * @param integer $id
     */
    public function delete($id){
        $this->db1->query("DELETE FROM RegisterHistory WHERE id = {$this->db->escape($id)}");
    }
    
    
}
