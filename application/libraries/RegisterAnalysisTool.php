<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RegisterAnalysisTool
 *
 * @author Luksa
 */
class RegisterAnalysisTool {
    
    /**
     * Register data
     * @var Register[] 
     */
    private $registers;
    
    public function loadRegisters($registers){
        $this->registers = $registers;
    }
    
}
