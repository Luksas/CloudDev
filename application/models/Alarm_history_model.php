<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Alarm_history_model
 *
 * @author Luksa
 */
class Alarm_history_model extends CI_Model {
    
     public function __construct() {
        parent::__construct();
        
        $this->load->database();
        $this->db1 = $this->load->database("historydb", TRUE);
    }
    
    /**
     * Returns a list of alarms active by given day and hour if any were active.
     * Alarms are in a string seperated by ;
     * Count of alarms are in count value
     * @param type $slave_id
     * @return Object[]
     */
    public function getHistory($slave_id){
        return $this->db1->query("SELECT GROUP_CONCAT(alarm_id SEPARATOR ';') as alarms, count(alarm_id) as count, date"
                . " FROM AlarmHistory"
                . " WHERE slave_id = {$this->db->escape($slave_id)}"
                . " GROUP BY date"
            )->result();
    }
    
    /**
     * Inserts alarm history row
     * @param integer $alarm_id - address of alarm register
     * @param datetime $date - when register occured
     * @param integer $slave_id - air handling unit index
     */
    public function insert($alarm_id, $date, $slave_id){
        $this->db1->query("INSERT INTO AlarmHistory (alarm_id, date, slave_id)"
                . " VALUES ({$this->db1->escape($alarm_id)} , {$this->db1->escape($date)}, {$this->db1->escape($slave_id)})");
    }
    
    
}
