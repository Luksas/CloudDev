<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BasicAutoLoader
 *
 * @author Luksa
 */
class BasicAutoLoader {
    
    public function __construct(){
        spl_autoload_register(array($this, 'loader'));
    }

    public function loader($className){
        if (substr($className, 0, 6) == 'models'){
            require  APPPATH .  str_replace('\\', DIRECTORY_SEPARATOR, $className) . '.php';
        }
    }
    
}
