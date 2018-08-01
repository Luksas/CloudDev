<?php

function convertFunctionCodeToWrite($function_code){
    if ($function_code == Command::CODE_READ_COIL_STATUS) {
        return Command::CODE_WRITE_SINGLE_COIL;
    }
    
    if ($function_code == Command::CODE_READ_HOLDING_REGISTER) {
        return Command::CODE_WRITE_SINGLE_HOLDING_REGISTER;
    }
    
    throw new Exception("Cannot write this register.");
}

function convertFunctonCodeToRead($function_code){
    if ($function_code == Command::CODE_WRITE_SINGLE_COIL) {
        return Command::CODE_READ_COIL_STATUS;
    }
    
    if ($function_code == Command::CODE_WRITE_SINGLE_HOLDING_REGISTER) {
        return Command::CODE_READ_HOLDING_REGISTER;
    }
    
    return $function_code;
}