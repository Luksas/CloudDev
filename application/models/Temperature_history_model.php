<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Temperature_history_model
 *
 * @author Luksa
 */
class Temperature_history_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        
        $this->load->database();
        $this->db1 = $this->load->database("historydb", TRUE);
    }
    
    public function insert($slave_id, $mode, $fresh, $supply, $exhaust, $extract, $date){
        $s_fresh = $this->db1->escape($fresh);
        $s_mode = $this->db1->escape($mode);
        $s_supply = $this->db1->escape($supply);
        $s_exhaust = $this->db1->escape($exhaust);
        $s_extract = $this->db1->escape($extract);
        $s_date = $this->db1->escape($date);
        $s_slave = $this->db1->escape($slave_id);
        
        $this->db1->query("INSERT INTO TemperatureHistory (mode, fresh, supply, exhaust, extract, date, slave_id)"
            . " VALUES ({$s_mode}, {$s_fresh}, {$s_supply}, {$s_exhaust}, {$s_extract}, {$s_date}, {$s_slave})");
    }
    
    public function getAvailableDates($slave_id){
        return $this->db1->query("SELECT * FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}")->result();
    }
    
    public function getHistoryWithDate($slave_id, $mode){
        return $this->db1->query($this->getSQLByFromMode($mode, $slave_id))->result();
    }
    
    public function getHistoryRange($slave_id, $start, $end){
        return $this->db1->query($this->getSQLByFromRange($slave_id, $start, $end))->result();
    }
    
    private function getSQLByFromRange($slave_id, $start, $end){
        $start_date = DateTime::createFromFormat('Y-m-d', $start);
        $end_date = DateTime::createFromFormat('Y-m-d', $end);
        $days_difference = $end_date->diff($start_date)->d;
        
        
        $point_grouping = "";
        
        // To-do refactor this crap.
        if ($days_difference <= 1) {
            $point_grouping = "GROUP BY HOUR(date)";
        }else if($days_difference <= 7) {
            $point_grouping = "GROUP BY DAY(date), HOUR(date)";
        }else if($days_difference <= 14){
            $point_grouping = "GROUP BY DAY(date), HOUR(date) DIV 2";
        }else if($days_difference <= 21){
            $point_grouping = "GROUP BY DAY(date), HOUR(date) DIV 4";
        }else if($days_difference <= 31){
            $point_grouping = "GROUP BY DAY(date)";
        }else{
            $point_grouping = "GROUP BY MONTH(date), WEEK(date)"; 
        }
        
        return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > {$this->db->escape($start)} AND date < {$this->db->escape($end)} " . $point_grouping . " order by date ASC;";
    }
    
    private function getSQLByFromMode($mode, $slave_id){
        switch ($mode) {
            case 'daily':
                return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > (SELECT MAX(date) as max from TemperatureHistory) - INTERVAL 1 DAY GROUP BY DAY(date), HOUR(date), MINUTE(date) DIV 15 order by date ASC;";
            case 'weekly':
                return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > (SELECT MAX(date) as max from TemperatureHistory) - INTERVAL 1 WEEK GROUP BY DAY(date), HOUR(date) order by date ASC;";
            case 'monthly':
                return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > (SELECT MAX(date) as max from TemperatureHistory) - INTERVAL 1 MONTH GROUP BY DAY(date), HOUR(date) DIV 6 order by date ASC;";
            case 'quarter':
                return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > (SELECT MAX(date) as max from TemperatureHistory) - INTERVAL 1 QUARTER GROUP BY WEEK(date), DAY(date) order by date ASC;";
            case 'yearly':
                return "SELECT date, mode, (fresh) as fresh, (supply) as supply, (exhaust) as exhaust, (extract) as extract"
                . " FROM TemperatureHistory WHERE slave_id = {$this->db->escape($slave_id)}"
                . " AND date > (SELECT MAX(date) as max from TemperatureHistory) - INTERVAL 1 YEAR GROUP BY MONTH(date), WEEK(date) order by date ASC;";
            default:
                throw new Exception("Invalid mode");
        }  
    }

}
