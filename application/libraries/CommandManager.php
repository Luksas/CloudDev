<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CommandManager
 *
 * @author Luksa
 */
class CommandManager {
    
    /**
     * List of commands
     * @var Command[]
     */
    private $commands;
    
    /**
     * This flag is set during the setCommands method.
     * If any command is WRITE_SLAVES command, this flag will be set to true
     * @var boolean
     */
    private $has_write_slaves_flag = false;
    private $other_command = false;
    
    /**
     * Max expected command response size
     * @var int
     */
    private $max_expected_size = 700;
    
    /**
     * Current expected response size value
     * @var int
     */
    private $expected_size = 0;

    /**
     * Initialization
     */
    public function __construct() {
        $this->initialize();
    }
    
    /**
     * Checks command list and returns command if it is read param/write param command
     * Marks it as sent
     * @return Command
     */
    public function getParameterCommand($command_id){
        foreach ($this->commands as $command) {
            if ($command->isParamsCommand()) {
                $command->setGatewayCommandId($command_id);
                
                return $command;
            }
        }
        
        return null;
    }
    
    /**
     * Returns hex string of currently loaded commands
     * If command is added to hex string, it is marked as SENT by given command_id
     * @param integer $command_id
     * @return string
     */
    public function getCommandHexToSend($command_id){       
        // TO-DO REFACTOR THIS CRAP
        
        if ($this->has_write_slaves_flag) {
            $hex_string = pack("SC", $command_id, Command::PARAM_WRITE_SLAVES);        
            foreach ($this->commands as $command) {   
                if ($command->isWriteSlaves()) {
                    $command->setGatewayCommandId($command_id);
                    
                    $hex_string = $hex_string . $command->toWriteSlavesHex();
                }
            }
            
            return $hex_string;
        }
        
        $hex_string = pack("SC", $command_id, Command::PARAM_READ_MODBUS);        
        foreach ($this->commands as $command) {
            $this->expected_size = $this->expected_size + $command->getExpectedResultSize();
            
            // If adding given command response would be too long, finish generating hex and keep commands for next request.
            if ($this->expected_size > $this->max_expected_size) {
                return $hex_string;
            }
            
            $command->setGatewayCommandId($command_id);
            
            if ($command->isWriteRT()) {
                $this->other_command = true;
                return $command->toWriteRTHex();
            }
            
            if ($command->isReadSlaves() || $command->isReadParams()) {
                $this->other_command = true;
                return $command->toReadParamsHex();
            }
            
            $hex_string = $hex_string . $command->toHex();
        }
        
        return $hex_string;
    }
    
    public function hasWriteSlavesCommands(){
        return $this->has_write_slaves_flag;
    }
    
    /**
     * Sets commands list
     * @param type $commands_list
     */
    public function setCommands($commands_list){
        $this->commands = array();
        
        foreach ($commands_list as $command) {
            $temp = $this->cast('Command', $command);
            
            if ($temp->isWriteSlaves()) {
                $this->has_write_slaves_flag = true;
            }
            
            array_push($this->commands, $temp);
        }
    }
    
    public function loadCommands($commands_list){
        $this->commands = $commands_list;
    }
    
    /**
     * Returns list of commands
     * @return command[]
     */
    public function getCommands(){
        return $this->commands;
    }
    
    /**
     * Clears all commands
     * Commands that are marked for deletion get deletes
     * Commands that are marked as is sent, get updated
     */
    public function flush(){
        $ci = &get_instance();
        
        if (!is_array($this->commands)) {
            return;
        }
        
        // To-Do rewrite this crap!
        foreach($this->commands as $command){
            if ($command->canDelete()) {
                $ci->Commands_model->delete($command);
                continue;
            }

            if ($command->isSent() && !$this->other_command) {
                $ci->Commands_model->update($command);
            }
            
            if ($command->isSent() && $this->other_command && ($command->isReadSlaves() || $command->isReadParams() || $command->isWriteRT())) {
                $ci->Commands_model->update($command);
            }
        }
    }
    
    
    /**
     * Class casting
     *
     * @param string|object $destination
     * @param object $sourceObject
     * @return object
     */
    private function cast($destination, $sourceObject)
    {
        if (is_string($destination)) {
            $destination = new $destination();
        }
        $sourceReflection = new ReflectionObject($sourceObject);
        $destinationReflection = new ReflectionObject($destination);
        $sourceProperties = $sourceReflection->getProperties();
        foreach ($sourceProperties as $sourceProperty) {
            $sourceProperty->setAccessible(true);
            $name = $sourceProperty->getName();
            $value = $sourceProperty->getValue($sourceObject);
            if ($destinationReflection->hasProperty($name)) {
                $propDest = $destinationReflection->getProperty($name);
                $propDest->setAccessible(true);
                $propDest->setValue($destination,$value);
            } else {
                $destination->$name = $value;
            }
        }
        return $destination;
    }

    /**
     * Loads all required classes for this object!
     */
    private function initialize() {
        spl_autoload_register(function ($class_name) {
            $CLASSES_DIR = getcwd() .  "\application\libraries\CommandManagement\\";
            $file = $CLASSES_DIR . $class_name . '.php';
            if (file_exists($file)){
                include $file; 
            } 
        });
    }

}
