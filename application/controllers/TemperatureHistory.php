<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TemperatureHistory
 *
 * @author Luksa
 */
class TemperatureHistory extends MY_Controller {
    
    public function __construct() {
        parent::__construct(array('LOAD_GATEWAYS'));
        
        if (!$this->userdata->isGuest()) {
            $this->response->dieWithError(1);
        }
        
        $this->load->model('Temperature_history_model');
    }
    
    public function getHistory() {  
        $input = (object) $this->input->myPost();
        $slave_id = $input->slave_id;

        if (!$this->userdata->isSlaveOwner($slave_id)) {
            $this->response->dieWithError(1);
        }
        
        $results = array();
        if ($input->selection_mode == 0) {
            $results = $this->Temperature_history_model->getHistoryWithDate($slave_id, $input->mode);
        } else {
            $results = $this->Temperature_history_model->getHistoryRange($slave_id, $input->start_date, $input->end_date);
        }
        
        $output = new stdClass();
        $output->labels = [];
        $output->datasets = [];
        
        $system_mode = $this->getItem('mode', '#ffffff');
        $supply = $this->getItem('supply', '#1c97ff');
        $fresh = $this->getItem('fresh', '#1cff1c');
        $exhaust = $this->getItem('exhaust', '#ff981c');
        $extract = $this->getItem('extract', '#ffff1c');
        
        foreach ($results as $result) {
            array_push($output->labels, $result->date);
            array_push($system_mode->data, $result->mode);
            array_push($supply->data, $result->supply / 10);
            array_push($fresh->data, $result->fresh / 10);
            array_push($exhaust->data, $result->exhaust / 10);
            array_push($extract->data, $result->extract / 10);
        }
        
        array_push($output->datasets, $supply, $fresh, $exhaust, $extract, $system_mode);
        
        $this->response->setData($output);
        $this->response->dieWithError(0);
    }
    
    public function getHistoryRange(){
        
        
        
    }
    
    private function getItem($type, $color){
        $item = new stdClass();
        $item->label = $type;
        $item->fill = false;
        $item->borderColor = $color;
        $item->data = array();
        return $item;
    }
    
}
