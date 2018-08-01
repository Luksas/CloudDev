<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Commands_model
 *
 * @author Luksa
 */
class Commands_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        
        $this->load->database();
    }
    
    /**
     * When commands are inserted and generated, they are not removed if they are duplicates.
     * This command removes duplicated leaving newest command in command list.
     */
    public function cleanDuplicateCommands(){
        // This sets SQL safe updates on and off for this query.
        
        $this->db->query("SET SQL_SAFE_UPDATES = 0;");
        
        $this->db->query(" DELETE c1 FROM Commands c1, Commands c2 "
            . " WHERE c1.date < c2.date "
            . " AND c1.command_code = c2.command_code"
            . " AND c1.gateway_command_id = c2.gateway_command_id"
            . " AND c1.priority = c2.priority"
            . " AND c1.gateway_id = c2.gateway_id"
            . " AND c1.board_address = c2.board_address"
            . " AND c1.modbus_function_code = c2.modbus_function_code"
            . " AND c1.start_address = c2.start_address"
            . " AND c1.address_count = c2.address_count"
            . " AND c1.address_values = c2.address_values"
            . " AND c1.text = c2.text;");
        
        $this->db->query("SET SQL_SAFE_UPDATES = 1;");
    }
    
    /**
     * Returns full list of not sent commands for specific device by gateway id, orders them by priority!
     * @param integer $gateway_id
     * @return Command[] command array for device
     */
    public function getCommandsByGatewayId($gateway_id){
        return $this->db->query("SELECT * FROM Commands"
                . " WHERE gateway_id = {$this->db->escape($gateway_id)}"
                . " AND gateway_command_id = -1"
                . " ORDER BY priority DESC;")->result();
    }
    
    /**
     * Returns full list of commands, that were sent by specific gateway ID and belongs to specific gateway!
     * @param integer $command_id - command id received from gateway
     * @param integer $gateway_id - gateway id found by MAC address
     * @return Command[] command array for device
     */
    public function getCommandsByGatewayCommandId($command_id, $gateway_id){
        return $this->db->query("SELECT * FROM Commands"
                . " WHERE gateway_id = {$this->db->escape($gateway_id)} AND gateway_command_id = {$this->db->escape($command_id)}"
                . " ORDER BY priority DESC;")->result();
    }
    
    /**
     * Returns full list of not sent commands for specific device by MAC Address, orders them by priority!
     * @param string $MAC
     * @return Command[] command array for device
     */
    public function getCommandsByMAC($MAC){
        return $this->db->query("SELECT Commands.* FROM Gateways "
            ." INNER JOIN Commands"
            ." ON Gateways.id = Commands.gateway_id"
            ." WHERE Gateways.mac = {$this->db->escape($MAC)} "
            ." AND gateway_command_id = -1"
            ." ORDER BY priority DESC;")->result();
    }
    
    /**
     * Returns sent commands by MAC and commands ID, orders them by priority!
     * @param string $MAC
     * @param integer $gateway_command_id
     * @return array
     */
    public function getCommandsByMACAndCommandsId($MAC, $gateway_command_id){
        return $this->db->query("SELECT Commands.* FROM Gateways "
            ." INNER JOIN Commands"
            ." ON Gateways.id = Commands.gateway_id"
            ." WHERE Gateways.mac = {$this->db->escape($MAC)} AND"
            ." gateway_command_id = {$this->db->escape($gateway_command_id)}"
            ." ORDER BY priority DESC;")->result();
    }
    
    /**
     * Checks if such command already exists in database
     * @param Command $command
     * @return boolean
     */
    public function exists($command){
        $command_from_db = $this->db->query("SELECT * FROM Commands"
                . " WHERE gateway_id = {$this->db->escape($command->getGatewayId())} AND"
                . " board_address = {$this->db->escape($command->getBoardAddress())} AND"
                . " modbus_function_code = {$this->db->escape($command->getModbusFunctionCode())} AND"
                . " start_address = {$this->db->escape($command->getStartAddress())} AND"
                . " address_count = {$this->db->escape($command->getAddressCount())} AND"
                . " gateway_command_id = -1"
        )->row();
                
        return is_object($command_from_db);
    }
    
    /**
     * Deletes command object from commands table
     * @param Command $command
     */
    public function delete($command){
        $this->db->query("DELETE FROM Commands"
                . " WHERE gateway_id = {$this->db->escape($command->getGatewayId())} AND"
                . " board_address = {$this->db->escape($command->getBoardAddress())} AND"
                . " modbus_function_code = {$this->db->escape($command->getModbusFunctionCode())} AND"
                . " start_address = {$this->db->escape($command->getStartAddress())} AND"
                . " address_count = {$this->db->escape($command->getAddressCount())}");
    }
    
    /**
     * Inserts command object to Commands DB table
     * @param Command $command
     */
    public function insert($command){
        $this->db->query("INSERT INTO Commands"
                . " ("
                    . " priority,"
                    . " gateway_id,"
                    . " board_address,"
                    . " modbus_function_code,"
                    . " start_address,"
                    . " address_count,"
                    . " address_values,"
                    . " date "
                . " )"
                . " VALUES "
                . " ("
                    . " {$this->db->escape($command->getPriority())},"
                    . " {$this->db->escape($command->getGatewayId())},"
                    . " {$this->db->escape($command->getBoardAddress())},"
                    . " {$this->db->escape($command->getModbusFunctionCode())},"
                    . " {$this->db->escape($command->getStartAddress())},"
                    . " {$this->db->escape($command->getAddressCount())},"
                    . " {$this->db->escape($command->getAddressValuesString())},"
                . " NOW()"
                . " )");
    }
    
    /**
     * Inserts command object array to Commands DB table
     * @param Command[] $commands
     */
    public function insertBulk($commands){
        foreach ($commands as $command) {
            $this->insert($command); 
        }
    }
    
    /**
     * Updates all command data by command_id
     * @param Command $command
     */
    public function update($command){
        unset($command->can_delete);
        $this->db->where('id', $command->getId());
        $this->db->update("Commands", $command);
    }
    
    /**
     * Updates given commands gateway_command_id
     * @param Command $command
     */
    public function updateCommandGatewayCommandId($command){
        $this->db->query("UPDATE Commands"
            . " SET gateway_command_id = {$this->db->escape($command->getGatewayCommandId())}"
            . " WHERE id = {$this->db->escape($command->getId())}");
    }
    
}
