<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Needs modbus helper
 *
 * @author Luksa
 */
class InputParser {
    
    CONST GATEWAY_COMMAND_ID_INDEX = 0;
    CONST GATEWAY_MAC_INDEX = 1;
    CONST REGISTER_DATA_INDEX = 2;
    
    /**
     * MAC address of gateway (from response)
     * @var String
     */
    private $MAC;
    
    /**
     * Gateways command id (from response)
     * @var integer
     */
    private $gateway_command_id;
    
    /**
     * String of hex data (from response)
     * @var string
     */
    private $data;
    
    /**
     * Encryption key
     * @var string 
     */
    private $encryption_key = "";
    
    /**
     * Sets encryption key!
     * @param string $key
     */
    public function setEncryptionKey($key){
        $this->encryption_key = $key;
    }
    
    /**
     * Loads MB-gateway input!
     * @param type $data
     */
    public function loadInput($data){	
        $pieces = array();
        
        // Decode.
        if ($this->encryption_key != "") {
            $pieces = explode('&', trim(decryptAES128CBC($data, $this->encryption_key)));
        }else{
            $pieces = explode('&', $data);
        }
        
        $this->gateway_command_id = $this->getPiece($pieces, InputParser::GATEWAY_COMMAND_ID_INDEX);
        $this->MAC = $this->getPiece($pieces, InputParser::GATEWAY_MAC_INDEX);
        $this->data = $this->getPiece($pieces, InputParser::REGISTER_DATA_INDEX);
    }
    
    /**
     * Checks if data received contains ReadParam command;
     * @return boolean
     */
    public function isReadParam(){
        return false;
    }
    
    /**
     * Returns parsed MAC address
     * @return string
     */
    public function getMAC() {
        return trim($this->MAC);
    }

    /**
     * Returns parsed gateway command id
     * @return integer
     */
    public function getGatewayCommandId() {
        return $this->gateway_command_id;
    }

    /**
     * Returns parsed data
     * @return String
     */
    public function getData() {
        return $this->data;
    }
        
    /**
     * Returns single piece data 
     * @param array $pieces - array of pieces
     * @param integer $key - piece index
     * @return string - parsed value or null
     */
    private function getPiece($pieces, $key){
        if (!array_key_exists($key, $pieces)) {
            return null;
        }
        
        $result = explode('=', $pieces[$key]);
        
        if (!array_key_exists(1, $result)) {
            return null;
        }
        
        return $result[1];
    }
    
    private function decodeInput($input){
        $key = pack('H*', $this->encryption_key);

        // Gets the encryption vector size for CBC encryption algorithm.
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);

        // Retriave the IV, iv_size should be created using mcrypt_get_iv_size()
        $iv_dec = substr($input, 0, $iv_size);

        // Removes initialization vector from inputs
        $input_without_iv = substr($input, $iv_size);

        // Decodes given input with initialization vector and key;
        $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $input_without_iv, MCRYPT_MODE_CBC, $iv_dec);

        parse_str($plaintext_dec);
        
        return $plaintext_dec;
    }
    
}
