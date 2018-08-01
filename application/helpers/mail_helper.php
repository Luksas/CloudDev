<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Sends email
 * @param string $to
 * @param string $subject
 * @param string $message
 * @return int - 1 on success 0 on failure
 */
function send($to, $subject, $message) {
    $CI = &get_instance();
    
    // No email server configured.
    if (!$CI->config->item('email_server_settings')) {
        return false;
    }
    
    $CI->load->library('email', $CI->config->item('email_server_settings'));
    $CI->email->from("noreply@salda.lt");
    $CI->email->to($to);
    $CI->email->subject($subject);
    $CI->email->message($message);
    $result = $CI->email->send();

    if ($result) {
        return true;
    }
    
    return false;
}