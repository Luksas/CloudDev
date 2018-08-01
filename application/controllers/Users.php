<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Users
 *
 * @author Luksa
 */
class Users extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
        
        $this->load->model('Login_attempts_model');
        $this->load->helper("mail");
    }
    
    public function login(){
        $input = (object) $this->input->myPost();
        
        $user = $this->Users_model->getUserByUsername($input->username);
        $user_id = -1;
        if (is_object($user)) {
            $user_id = $user->id;
        }
        
        $password = hash('sha256', $input->password);
        
        if ($this->Login_attempts_model->isBlocked($user_id)) {
            $this->response->dieWithError("BLOCKED_ACCOUNT");
        }
        
        if (!$this->Users_model->canLogin($input->username, $password)) {
            $this->Login_attempts_model->add($user_id);
            
            // Blocked just now.
            if ($this->Login_attempts_model->isBlocked($user_id)) {
                send(
                    $user->email, 
                    'Your cloud.salda.lt account has been blocked for 15mins.', 
                    'Your account has been blocked for too many failed login attempts for 15 mins. If this was not you, please contact manager.'
                );
            }
            
            $this->response->dieWithError("INVALID_CREDENTIALS");
        }
        
        //Create session
        $this->session->set_userdata('username', $input->username);
        $this->loadCurrentUserDataFromSession();
        
        $this->response->setData($this->userdata);
        $this->response->dieWithError(0);
    }
    
    public function checkSession(){
        $this->loadCurrentUserDataFromSession(array('LOAD_GATEWAYS'));
        
        if ($this->userdata == null) {
            $this->response->dieWithError("CANNOT_LOGGIN");
        }
        
        if ($this->userdata->getId() == NULL) {
            $this->response->dieWithError("CANNOT_LOGGIN");
        }
        
        $this->response->setData($this->userdata);
        $this->response->dieWithError(0);
    }
    
    public function logout(){
        $this->userdata->clean();
        $this->session->set_userdata('username', null);
        $this->response->dieWithError(0);
    }
    
    public function update(){
        $input = (object) $this->input->myPost();
        
        if ($input->id != $this->userdata->id) {
            $this->response->dieWithError("ERROR");
        }
        
        $this->Users_model->updateEmail($this->userdata->id, $input->email);
        $this->response->dieWithError(0);
    }
    
    public function register(){
        $input = (object) $this->input->myPost();
        
        $this->exitIfNotValidUsername($input);
        $this->exitIfNotValidMail($input);
        $this->exitIfNotValidPassword($input);
        
        $this->Users_model->register(array(
            'username' => $input->username,
            'password' => hash('sha256', $input->password),
            'email' => $input->email
        ));
        
        send(
            $input->email, 
            'Cloud.salda.lt account has been created', 
            "You have succesfully created cloud.salda.lt account with username: {$input->username}."
        );
        
        $this->response->dieWithError(0);
    }
    
    private function exitIfNotValidUsername($input){
        if (!$this->Users_model->isUsernameUnique($input->username)) {
            $this->response->dieWithError("USERNAME_ALREADY_EXISTS");
        }
    }
    
    private function exitIfNotValidMail($input){
        if (filter_var($input->email, FILTER_VALIDATE_EMAIL) === FALSE) {
            $this->response->dieWithError("INVALID_EMAIL");
        }
    }
    
    private function exitIfNotValidPassword($input){
        if (strlen($input->password) < 8) {
            $this->response->dieWithError('PASSWORD_MUST_BE_ATLEAST_8_CHARACTERS');
        }
        
        if (hash('sha256', $input->password) != hash('sha256', $input->password)) {
            $this->response->dieWithError('PASSWORDS_DO_NOT_MATCH');
        }
    }
    
}
