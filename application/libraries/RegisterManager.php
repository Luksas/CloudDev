<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RegisterManager
 *
 * @author Luksa
 */
class RegisterManager {
    
    /**
     * Register list built from modbus_data (these registers will be inserted to DB);
     * @var Register[]
     */
    private $registers;
    
    /**
     * Modbus data array (each string is 2 characters, as HEX symbol)
     * @var string[]
     */
    public $modbus_data;
    
    /**
     *
     * @var Command[]
     */
    public $commands = array();
    
    public function __construct() {
        $this->registers = array();
        $this->commands = array();
    }
    
    public function loadCommands($commands){
        if ($commands == null) {
            return;
        }
        
        foreach($commands as $command) {
            array_push($this->commands, $this->cast('Command', $command));
        }
    }
    
    public function getCommands(){
        return $this->commands;
    }
    
    public function loadModbusData($modbusdata){
        $this->modbus_data = str_split($modbusdata, 2);
    }
    
    /**
     * Builds registers from modbus data from given commands and marks commands as removable!
     * 
     */
    public function buildRegisters(){
        if (count($this->commands) == 0) {
            return;
        }
        
        foreach($this->commands as $command) {
            if ($command->isWrite() ||  
                $command->isReadParams() ||
                $command->isWriteRT() ||
                $command->isWriteSlaves() ||
                $command->isWriteSingleRegister()) {
                $command->markForDeletion();
                continue;
            }
            
            $ci = &get_instance();
            
            // Need to optimize this SQL with memo
            $board_address = $this->getByteValue(0);
            $slave_id = $ci->Slaves_model->getSlaveByGatewayAndBoardAddress($command->getGatewayId(), $board_address);
            $modbus_function_code = $this->getByteValue(1);
            $number_of_bytes_to_follow = $this->getByteValue(2);
            
            $ci->Logs_model->logtext("Reading response for command", json_encode($command));
            $ci->Logs_model->logtext("slave_id", $slave_id);
            $ci->Logs_model->logtext("trying to build registers", "xxx");
            $ci->Logs_model->logtext("modbus_function_code", ($modbus_function_code));
            $ci->Logs_model->logtext("number_of_bytes_to_follow", ($number_of_bytes_to_follow));
            
            if (!$this->isValidCommand($command, $modbus_function_code, $board_address)) {
                $ci->Logs_model->logtext("commands not match", json_encode($command));
                
                continue;
            }
            
            $this->clearBytesFromStart(3);
            $register_data = $this->getByteValuesArray($number_of_bytes_to_follow, $modbus_function_code, $command->address_count);
            
            $ci->Logs_model->logtext("register_data_read", json_encode($register_data));
            
            for ($index = 0; $index < count($register_data); $index++) {
                $temp = new Register();
                $temp->setSlavesId($slave_id);
                $temp->setModbusFunctionCode($modbus_function_code);
                $temp->setAddress($command->getStartAddress() + $index);
                $temp->setValue($register_data[$index]);
                array_push($this->registers, $temp);
            }
            
            $command->markForDeletion();
        }
    }
    
    private function getByteValuesArray($bytes_to_follow, $modbus_function_code, $address_count){
        $data = array();

        if ($modbus_function_code == 3 || $modbus_function_code == 4) {
            $count = $bytes_to_follow / 2;
            for ($index = 0; $index < $count; $index++) {
                $hex_p1 = $this->modbus_data[0];
                $hex_p2 = $this->modbus_data[1];

                array_push($data, hexdec($hex_p1 . $hex_p2));

                $this->clearFirstByte();
                $this->clearFirstByte();
            }
        }
        
        if ($modbus_function_code == 1 || $modbus_function_code == 2) {
            
            $ci = &get_instance();
            $ci->Logs_model->logtext("read DI/COILS", '-');
            
            for ($index = 0; $index < $bytes_to_follow; $index++) {
                // Process: HEX -> DEC -> BIN -> PADD TO 8 BITS
                $str = str_pad(decbin(hexdec($this->modbus_data[0])), 8, '0', STR_PAD_LEFT);
                $binary = str_split($str);
                
                $ci->Logs_model->logtext("byte no: " . $index, $str . ' --- ' . json_encode($binary));
                
                for ($bin_index = 7; 0 <= $bin_index; $bin_index--) {
                    $address_count--;
                    
                    array_push($data, $binary[$bin_index]);
                    
                    // If all required addresses from given command are read
                    if ($address_count == 0) {
                        break;
                    }
                }
                
                $this->clearFirstByte();
            }
        }
        
        return $data;
    }
    
    /**
     * Returns true if command has same slaveid/modbusfunctioncode as modbus data slaveid/modbusfunctioncode
     * @param Command $command
     * @param integer $modbus_function_code
     * @param integer $slave_id
     */
    private function isValidCommand($command, $modbus_function_code, $slave_id){
        return $command->getBoardAddress() == $slave_id && $command->getModbusFunctionCode() == $modbus_function_code;
    }
    
    /**
     * Returns byte decimal value at specific point
     * @param integer $number
     * @return integer
     */
    private function getByteValue($number){
        return hexdec($this->modbus_data[$number]);
    }
    
    /**
     * Removes N elements from start of data array
     * @param integer $number
     */
    private function clearBytesFromStart($number){
        for ($index = 0; $index < $number; $index++) {
            $this->clearFirstByte();
        }
    }
    
    /**
     * Removes first element from data array
     */
    private function clearFirstByte(){
        array_shift($this->modbus_data);
    }
    
    /**
     * Returns built register array or null
     * @return Register[]
     */
    public function getRegisters(){
        return $this->registers;
    }
    
    /**
     * Returns true if any registers were build
     * @return bool
     */
    public function hasRegisters(){
        return count($this->registers) > 0;
    }
    
    /**
     * Writes all register data to database
     */
    public function flush(){
        if ($this->hasRegisters()) {
            $ci = &get_instance();
            
            foreach($this->registers as $register){
                $ci->Register_model->updateRegister($register);
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
    
}
