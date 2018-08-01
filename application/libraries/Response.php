<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Response
 *
 * @author Luksa
 */
class Response {
    
    public $error;
    public $data;
    
    public function setError($error){
        $this->error = $error;
    }
    
    public function setData($data){
        $this->data = $data;
    }
    
    public function setDataField($field, $value){
        if ($this->data == null) {
            $this->data = new stdClass();
        }
        
        if (is_object($this->data)) {
            $this->data->{$field} = $value;
        }else{
            $this->data[$field] = $value;
        }
    }
    
    public function sendAndDie(){
        die($this->ToJson());
    }
    
    public function dieWithError($error){
        $this->setError($error);
        die($this->ToJson());
    }
    
    public function ToJson(){
        return json_encode($this);
    }
    
}
