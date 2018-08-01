<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * TO-DO refactor this crap into more classes, this one does way too much!
 *
 * @author Luksa
 */
class Command {
    
    // Priorities, its possible to set higher, but lets just keep 4 for now.
    CONST PRIORITY_LOW = 0;
    CONST PRIORITY_NORMAL = 1;
    CONST PRIORITY_HIGH = 2;
    CONST PRIORITY_MAX = 3;
    
    // Modbus function codes
    CONST CODE_READ_COIL_STATUS = 1;
    CONST CODE_READ_DISCRETE_INPUTS = 2;
    CONST CODE_READ_HOLDING_REGISTER = 3;
    CONST CODE_READ_INPUT_REGISTER = 4;
    CONST CODE_WRITE_SINGLE_COIL = 5;
    CONST CODE_WRITE_SINGLE_HOLDING_REGISTER = 6;
    CONST CODE_WRITE_MULTIPLE_COILS = 15;
    CONST CODE_WRITE_MULTIPLE_HOLDING_REGISTERS = 16;
    
    
    CONST PARAM_READ_MODBUS = 0; // modbus command
    CONST PARAM_READ_SLAVES = 1; // gets all slaves upto 32
    CONST PARAM_READ_PARAMS = 2; // get params by & depending on input text
    // 3-100 reserved for reads
    CONST PARAM_WRITE_SLAVES = 101; // Writes slaves  [1][2][12] ... [1][2][12] file id, modbus id, name
    CONST PARAM_WRITE_RT = 102;     // Writes RT data [2]
    // 101-200 reserved for writes
    // 201-255 reserved for other uses
    
    
    /**
     * Unique command identifier
     * @var integer
     */
    public $id;
    
    /**
     * Command code integer
     * 0 --- modbus function
     * 1 --- read params xml
     * 2 --- set params xml
     * @var integer
     */
    public $command_code;
    
    /**
     * Command identifier received when sending command to gateway;
     * When gateway asks for commands, it sends this value which is saved here when command is sent.
     * @var integer 
     */
    public $gateway_command_id;

    /**
     * Command priority value (the higher the number, the higher the priority)
     * @var integer 
     */
    public $priority;
    
    /**
     * Gateway that will receive the command
     * @var integer 
     */
    public $gateway_id;
    
    /**
     * Board where we send the command (slave id in modbus protocol)
     * @var int 
     */
    public $board_address;
    
    /**
     * Modbus function code (determinated if we use read or write);
     * @var integer 
     */
    public $modbus_function_code;
    
    /**
     * Start position of address
     * @var int 
     */
    public $start_address;
    
    /**
     * Address count to read or write
     * @var int
     */
    public $address_count;
    
    /**
     * If writing, these are address values to write
     * @var array
     */
    public $address_values = array();
    
    /**
     * Command text
     * @var string
     */
    public $text;
    
    /**
     * Whenever command can be deleted
     * @var bool
     */
    public $can_delete = false;
    
    /**
     * Converts command to hex string
     * Calling this command, sets gateway_command_id, which means it gets marked as SENT
     * Which means it should be flushed in command manager by calling flush method
     * @return string
     */
    public function toHex(){   
        $this->addressValuesToArray();
        
        if($this->isRead()){
            return call_user_func_array("pack", $this->getPackArgumentsRead());
        }
        
        if ($this->isWriteSingleRegister()) {
            return call_user_func_array("pack", $this->getPackArgumentsWrite());
        }
        
        if ($this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_COILS) {
            return call_user_func_array("pack", $this->getPackArgumentsWriteMultipleCoils());
        }
        
        if ($this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_HOLDING_REGISTERS) {
            return call_user_func_array("pack", $this->getPackArgumentsWriteMultipleHR());
        }
        
        return '';
    }
    
    public function getExpectedResultSize(){
        return 10 + $this->address_count * 2;
    }
    
    public function toWriteSlavesHex(){
        //$hex = pack("CC", $this->getStartAddress(), $this->getAddressValuesString()) .  str_pad(substr($this->getText(), 0, 11), 12, 0x00);
        
        $hex = pack("CC", $this->getStartAddress(), $this->getAddressValuesString()) . substr($this->getText(), 0, 11);
        $padd = 12 - strlen(substr($this->getText(), 0, 11));
        
        
        if ($padd > 0) {
            for ($index = 0; $index < $padd; $index++) {
                $hex = $hex . pack('C', 0x00);
            }
        }
        
        return $hex;
    }
    
    public function toWriteRTHex(){
        return pack("SCS", $this->gateway_command_id, $this->getCommandCode(), $this->getAddressValuesString());
    }
    
    public function toReadParamsHex(){
        return pack("SC", $this->gateway_command_id, $this->getCommandCode()) . $this->getText();
    }
    
    /**
     * Marks for command deletion (makes this object ready for removal), to execute removal, flush the command manager object;
     */
    public function markForDeletion(){
        $this->can_delete = true;
    }
    
    /**
     * Checks if this command has been sent to gateway
     * @return bool
     */
    public function isSent(){
        return $this->gateway_command_id != -1;
    }
    
    /**
     * Checks if this command was marked for removal (must be sent and marked for removal)
     * @return bool
     */
    public function canDelete(){
        return $this->isSent() && $this->can_delete;
    }
    
    /**
     * Checks if given command is writing 
     * @return bool
     */
    public function isWriteSingleRegister(){
        return $this->modbus_function_code == Command::CODE_WRITE_SINGLE_COIL 
            || $this->modbus_function_code == Command::CODE_WRITE_SINGLE_HOLDING_REGISTER;
    }

    /**
     * This basically is used to know what type of data/how many bytes will be stored in hex (C - 1 byte, S - 2 bytes)
     * Builds current data description for PHP pack function (for letter explanations check PHP pack() documentation)
     * @return string
     */
    private function buildPackDescription(){        
        if ($this->isWriteSingleRegister()) {
            return "CCS" . str_repeat("S", count($this->address_values));
        }
        
        if ($this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_COILS) {
            return "CCSSC" . str_repeat("C", ceil(count($this->address_values) / 8));            
        }
        
        if ($this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_HOLDING_REGISTERS) {
            return "CCSSC";
        }
        
        throw new Exception("Invalid modbus function type");
    }
    
//    private function getPackArgumentsWriteMultipleCoils(){
//        return array(
//            $this->buildPackDescription(), 
//            $this->board_address,
//            $this->modbus_function_code,
//            $this->start_address,
//            $this->address_count, // Number of coil values to write
//            ceil(count($this->address_values) / 8), // Number of bytes to follow
//        );
//        
////        $byte_chars = $this->getAddressValues();
////        $filler_bytes = ceil(count($this->address_values) / 8) - count($byte_chars);
////        
////        for ($index = 0; $index < count($filler_bytes); $index++) {
////            
////        }
//        
//    }
    
    private function getPackArgumentsWriteMultipleHR(){
        $temp = array(
            $this->buildPackDescription(), 
            $this->board_address,
            $this->modbus_function_code,
            $this->start_address,
            $this->address_count,     // How many values to write
            $this->address_count * 2, // Number of bytes to follow
        );
        
        foreach ($this->getAddressValues() as $value) {
            array_push($temp, $value);
        }
        
        return $temp;
    }
    
    /**
     * Returns full argument array required for PACK function on Read command
     * @return array
     */
    private function getPackArgumentsRead(){
        return array(
            "CCSS", 
            $this->board_address,
            $this->modbus_function_code,
            $this->start_address,
            $this->address_count
        );
    }
    
    /**
     * Returns full argument array required for PACK function on WRite command
     * @return array
     */
    private function getPackArgumentsWrite(){
        $temp = array(
            $this->buildPackDescription(), 
            $this->board_address,
            $this->modbus_function_code,
            $this->start_address,
        );
        
        foreach ($this->address_values as $value) {
            array_push($temp, $value);
        }
        
        return $temp;
    }
    
    public function getId() {
        return $this->id;
    }

    public function getPriority() {
        return $this->priority;
    }

    public function getGatewayId() {
        return $this->gateway_id;
    }

    public function getBoardAddress() {
        return $this->board_address;
    }

    public function getModbusFunctionCode() {
        return $this->modbus_function_code;
    }

    public function getStartAddress() {
        return $this->start_address;
    }

    public function getAddressCount() {
        return $this->address_count;
    }

    public function getText(){
        return $this->text;
    }
    
    /**
     * Returns array of address values
     * @return array
     */
    public function getAddressValues() {
        if (is_array($this->address_values)) {
            return $this->address_values;
        }
        
        return array_filter(explode(';', $this->address_values));
    }
    
    public function getAddressValuesString() {
        if (is_array($this->address_values)) {
            return join(';', $this->address_values);
        }
        
        return $this->address_values;
    }

    public function setPriority($priority) {
        $this->priority = $priority;
    }

    public function setGatewayId($gateway_id) {
        $this->gateway_id = $gateway_id;
    }

    public function setBoardAddress($board_address) {
        $this->board_address = $board_address;
    }

    public function setModbusFunctionCode($modbus_function_code) {
        $this->modbus_function_code = $modbus_function_code;
    }
    
    public function setStartAddress($start_address) {
        $this->start_address = $start_address;
    }
    
    public function setAddressCount($address_count) {
        $this->address_count = $address_count;
    }
    
    public function setText($text){
        $this->text = $text;
    }

    public function setAddressValues($address_values) {
        $this->address_values = $address_values;
    }
    
    public function getGatewayCommandId() {
        return $this->gateway_command_id;
    }

    public function setGatewayCommandId($gateway_command_id) {
        $this->gateway_command_id = $gateway_command_id;
    }
    
    public function getCommandCode(){
        return $this->command_code;
    }
    
    public function setCommandCode(){
        return $this->command_code;
    }
    
    public function isModbusCommand(){
        return $this->command_code == 0;
    }
    
    public function isWriteRT(){
        return $this->command_code == Command::PARAM_WRITE_RT;
    }
    
    public function isWriteSlaves(){
        return $this->command_code == Command::PARAM_WRITE_SLAVES;
    }
    
    public function isReadParams(){
        return $this->command_code == Command::PARAM_READ_PARAMS;
    }
    
    public function isReadSlaves(){
        return $this->command_code == Command::PARAM_READ_SLAVES;
    }
    
    /**
     * Checks if given command is reading 
     * @return bool
     */
    public function isRead(){
        return in_array($this->modbus_function_code, array(
            Command::CODE_READ_COIL_STATUS, 
            Command::CODE_READ_DISCRETE_INPUTS, 
            Command::CODE_READ_HOLDING_REGISTER, 
            Command::CODE_READ_INPUT_REGISTER
        ));
    }
    
    public function isWrite(){
        return $this->modbus_function_code == Command::CODE_WRITE_SINGLE_COIL 
            || $this->modbus_function_code == Command::CODE_WRITE_SINGLE_HOLDING_REGISTER
            || $this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_HOLDING_REGISTERS
            || $this->modbus_function_code == Command::CODE_WRITE_MULTIPLE_COILS;
    }
    
    private function addressValuesToArray(){
        if (!is_array($this->address_values)) {
            $this->address_values = explode(';', $this->address_values);
        }
    }
    
}