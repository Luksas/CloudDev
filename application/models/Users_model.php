<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Users_model
 *
 * @author Luksa
 */
class Users_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        
        $this->load->database();
    }
    
    public function updateEmail($id, $email){
        $this->db->query("UPDATE Users SET email = {$this->db->escape($email)} WHERE id = {$this->db->escape($id)}");
    }
    
    public function getUserIdByUsername($username){
        $user = $this->getUserByUsername($username);
        
        if (is_object($user)) {
            return $user->id;
        }
        
        return null;
    }
    
    public function getUserByUsername($username){
        return $this->db->query("SELECT * FROM Users WHERE username = {$this->db->escape($username)}")->row();
    }
    
    public function getUserByLoginCredentials($username, $password){
        return $this->db->query("SELECT * FROM Users WHERE username = {$this->db->escape($username)} and password = {$this->db->escape($password)}")->row();
    }
    
    public function canLogin($username, $password){
        $row = $this->getUserByLoginCredentials($username, $password);
        
        // If login credentials are correct
        if (is_object($row)) {
            return true;
        }
        
        return false;
    }
    
    public function register($account_information){
        $account_information['join_date'] = date("Y-m-d H:i:s", time());
        
        $this->db->insert("Users", $account_information);
    }
    
    public function isUsernameUnique($username){
        $row = $this->db->query("SELECT * FROM Users WHERE username = {$this->db->escape($username)}")->row();
        
        // If row is found
        if (is_object($row)) {
            return false;
        }
        
        return true;
    }
    
}
