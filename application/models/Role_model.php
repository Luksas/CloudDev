<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Role_model
 *
 * @author Luksa
 */
class Role_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function getRolesBySum($sum){
        return $this->db->query("SELECT * FROM UserRoles WHERE id & {$this->db->escape($sum)}")->result();
    }
    
}
