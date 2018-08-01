<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of History
 *
 * @author Luksa
 */
class History extends MY_Controller {
    
    public function __construct() {
        parent::__construct(array('LOAD_GATEWAYS'));
        
        if (!$this->userdata->isGuest()) {
            $this->response->dieWithError('NO_ACCESS');
        }
    }
    
    public function getAlarmHistory($slave_id){        
        if (!$this->userdata->isSlaveOwner($slave_id)) {
            $this->response->dieWithError('NO_ACCESS');
        }
        
        $this->load->model('Alarm_history_model');
        $alarms = $this->Alarm_history_model->getHistory($slave_id);
        $this->response->setData($alarms);
        $this->response->dieWithError(0);
    }
    
}
