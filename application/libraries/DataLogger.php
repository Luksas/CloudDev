<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DataLogger
 *
 * @author Luksa
 */
class DataLogger {
    
    private $ci;
    private $time;
    
    public function __construct() {
        $this->ci = &get_instance();

    }
    
    /**
     * Logs register data
     * @param Register[] $registers
     */
    public function log($registers){
        $this->time = date("Y-m-d H:i:s");
        
        $this->logAlarmHistory($registers);
        $this->logTemperatureRegisters($registers);
        
        $this->ci->Register_history_model->insertBulk($registers, $this->time);
    }
    
    /**
     * Logs all alarm registers to alarm history table.
     * Logged registers are marked as not loggable and needToLog() method on register will now return false.
     * @param Register $registers
     */
    private function logAlarmHistory($registers){
        foreach ($registers as &$register) {
            // IS ALARM?
            if ($register->getModbusFunctionCode() == 2 && $register->getAddress() > 0 && $register->getAddress() < 62) {
                $register->dontLog();
                
                // If alarm is active, lets log it to alarm history table!
                if ($register->getValue() > 0) {
                    $this->ci->Alarm_history_model->insert($register->getAddress(), $this->time, $register->getSlavesId());
                }
            }
        }
    }
    
    /**
     * Logs temperature data from registers and marks used registers and not loggable (needToLog() = false)
     * @param Register $registers
     */
    private function logTemperatureRegisters($registers){
        // Address and field.
        $temperature_rules = array(
            15 => 'mode',
            18 => 'supply',
            19 => 'extract',
            20 => 'exhaust',
            21 => 'fresh'
        );
        
        // Only need if count = 5;
        $count = 0;
        
        $object = new stdClass();
        $object->date = $this->time;
        foreach ($registers as &$register) {
            if ($register->getModbusFunctionCode() == 4 && array_key_exists($register->getAddress(), $temperature_rules)) {
                $object->slave_id = $register->getSlavesId();
                $object->{$temperature_rules[$register->getAddress()]} = $register->get16BitValue();
                $register->dontLog();
                $count++;

                
            }
        }
        
        // Must have 5 values for registers to be valid for temperature history model
        if ($count >= 4) {
            $this->ci->Temperature_history_model->insert($object->slave_id, $object->mode, $object->fresh, $object->supply, $object->exhaust, $object->extract, $this->time);
        }
    }
    
    
    
}
