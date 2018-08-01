<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Logs_model
 *
 * @author Luksa
 */
class Logs_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        
        $this->load->database();
    }
    
    public function logg($type, $data){
        $this->db->query("INSERT INTO Logs (type, data, date) VALUES ({$this->db->escape($type)}, {$this->db->escape($data)}, NOW())");
    }
    
    public function loggg($type, $data){
        $data_stringified = implode(unpack("H*", $data));
        $this->db->query("INSERT INTO Logs (type, data, date) VALUES ({$this->db->escape($type)}, {$this->db->escape($data_stringified)}, NOW())");
    }
    
    public function logtext($type, $data){
        return;
        $this->db->query("INSERT INTO Logs (type, data, date) VALUES ({$this->db->escape($type)}, {$this->db->escape($data)}, NOW())");
        
        //$dir = $this->dirname_r(__DIR__, 3) . '\\logs\\' . $type . round(microtime(true) * 1000) . ".txt";
        //file_put_contents($dir, $data);
    }
    
    public function log($type, $data){
        return;
        $hex_stringified = implode(unpack("H*", $data));
        
        $this->db->query("INSERT INTO Logs (type, data, date) VALUES ({$this->db->escape($type)}, {$this->db->escape($hex_stringified)}, NOW())");
        
        //$dir = $this->dirname_r(__DIR__, 3) . '\\logs\\' . $type . round(microtime(true) * 1000) . ".txt";
        //file_put_contents($dir, $data);
    }
    
    private function dirname_r($path, $count=1){
        if ($count > 1){
           return dirname($this->dirname_r($path, --$count));
        }else{
           return dirname($path);
        }
    }
    
}
