<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Commands_provider_model
 *
 * @author Luksa
 */
class Commands_provider_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        
        $this->db1 = $this->load->database("historydb", TRUE);
    }
    
    public function add(){
        // to do
    }
    
    public function remove(){
        // to do
    }
    
    /**
     * 
     * @param integer $gateway_id
     * @param array $boards --- array of modbus boards to send commands to (ea command is duplicated for each board)
     * @returns command[] 
     */
    public function getCommandsForGateway($gateway_id, $boards = array()){
        $commands_from_sql = $this->db1->query("SELECT * FROM CommandsForHistory WHERE gateway_id = {$this->db->escape($gateway_id)} AND last_sent < NOW() - INTERVAL send_after_seconds SECOND;")->result();
        $commands = array();
        $ids_to_update = array();
        
        foreach ($commands_from_sql as $command_from_sql) {
            foreach ($boards as $board) {
                $command = new Command();
                $command->setPriority(Command::PRIORITY_LOW);
                $command->setGatewayId($gateway_id);
                $command->setBoardAddress($board);
                $command->setModbusFunctionCode($command_from_sql->modbus_function_code);
                $command->setStartAddress($command_from_sql->start_address);
                $command->setAddressCount($command_from_sql->address_count);
                array_push($commands, $command);
            }
            
            array_push($ids_to_update, $command_from_sql->id);
        }
        
        $this->updateAsRecentlySent($ids_to_update);
        
        return $commands; 
    }
    
    /**
     * 
     * @param integer[] $ids
     */
    private function updateAsRecentlySent($ids){
        foreach ($ids as $id) {
            $this->db1->query("UPDATE CommandsForHistory SET last_sent = NOW() WHERE id = {$this->db->escape($id)};");
        }
    }
    
}
