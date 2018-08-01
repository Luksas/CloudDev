<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Login_attempts_model
 *
 * @author Luksa
 */
class Login_attempts_model extends CI_Model {
    
    private $login_cooldown_minutes = 15;
    
    private $max_login_attempts = 3;
    
    public function __construct() {
        parent::__construct();
    }
    
    public function isBlocked($user_id){
        $last_login = $this->getLastLoginByUserId($user_id);
        
        if (is_object($last_login)) {
            // 15 mins passed or different date
            if ($this->checkIf15MinsPassed($last_login->last_attempt)) {
                return false;
            }
            
            // Blocked if more attempts then max
            return $last_login->count >= $this->max_login_attempts;
        }
        
        return false;
    }
    
    public function add($user_id){
        $last_login = $this->getLastLoginByUserId($user_id);
        
        if (is_object($last_login)) {
            
            $count = $last_login->count + 1;
            if ($this->checkIf15MinsPassed($last_login->last_attempt)) {
                $count = 1;
            }
            
            $this->db->query("UPDATE FailedLogins SET count = {$this->db->escape($count)}, last_attempt = NOW() WHERE user_id = {$this->db->escape($user_id)}");
        }else{
            $this->db->query("INSERT INTO FailedLogins (user_id, count, last_attempt) VALUES ({$this->db->escape($user_id)}, 1, NOW())");
        }
    }
    
    private function getLastLoginByUserId($user_id){
        return $this->db->query("SELECT * FROM FailedLogins WHERE user_id = {$this->db->escape($user_id)}")->row();
    }
    
    private function checkIf15MinsPassed($date){
        $dbdate = strtotime($date);
        return time() - $dbdate > $this->login_cooldown_minutes * 60 || date("Y-m-d", $dbdate) != date("Y-m-d");
    }
    
}
