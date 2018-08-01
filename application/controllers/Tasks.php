<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Tasks
 *
 * @author lukassapiega
 */
class Tasks extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
                
//        $this->load->model('Register_history_model');
//        $this->load->model('Temperature_history_model');
//        $this->load->model('Alarm_history_model');
//        $this->load->helper('Math');
    }
    
//    public function moveTemperatures(){
//        ini_set('max_execution_time', 600);
//
//        $registers_with_temp = $this->Register_history_model->getTemperatures();
//        foreach ($registers_with_temp as $register) {
//            $mode = $register->mode;
//            $fresh = $register->fresh > (65535 / 2) ? $register->fresh - 65535 : $register->fresh;
//            $supply = $register->supply; 
//            $exhaust = $register->exhaust; 
//            $extract = $register->extract;
//            $date = $register->date;
//            
//            $this->Temperature_history_model->insert($register->slave_id, $mode, $fresh, $supply, $exhaust, $extract, $date);
//                        
//            $this->Register_history_model->deleteBulk(array($register->id1, $register->id2, $register->id3, $register->id4, $register->id5));
//        }
//    }
//    
//    public function moveAlarms(){
//        ini_set('max_execution_time', 600);
//        
//        $alarm_registers = $this->Register_history_model->getAlarmRegisters();
//        foreach ($alarm_registers as $register) {
//            if ($register->value > 0) {
//                $this->Alarm_history_model->insert($register->address, $register->date, $register->slave_id);
//            }
//            
//            $this->Register_history_model->delete($register->id);
//        }
//    }
    
}
