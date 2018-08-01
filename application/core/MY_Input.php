<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of MY_Input
 *
 * @author Luksa
 */
class MY_Input extends CI_Input {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function myPost($key = null, $clean_xss = true){
        $stream = $this->raw_input_stream;
        
        if ($clean_xss) {
            $stream = $this->security->xss_clean($this->raw_input_stream);
        }
        
        $request = json_decode($stream);
        
        if ($key == null) {
            return $request;
        }
        
        return $request->{$key};
    }
    
}
