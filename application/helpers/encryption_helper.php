<?php

function encryptAES128CBC($data, $encryption_key){
    // Prepare for encryption
    $initialization_vector = random_bytes(16);
    $key = pack('H*', $encryption_key);
    
    // Calc padding length
    $padding = 16 - (strlen($data) % 16);
    
    // Generate padding
    $padding_str = str_repeat(chr($padding), $padding);
    
    // Encrypt data + padding
    $encrypted_hex_str = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $data . $padding_str, MCRYPT_MODE_CBC, $initialization_vector);
        
    return $initialization_vector . $encrypted_hex_str;
}

function decryptAES128CBC($input, $encryption_key){
    $key = pack('H*', $encryption_key);

     // Gets the encryption vector size for CBC encryption algorithm.
     $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);

     // Retriave the IV, iv_size should be created using mcrypt_get_iv_size()
     $iv_dec = substr($input, 0, $iv_size);

     // Removes initialization vector from inputs
     $input_without_iv = substr($input, $iv_size);

     // Decodes given input with initialization vector and key;
     $plaintext_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $input_without_iv, MCRYPT_MODE_CBC, $iv_dec);

     parse_str($plaintext_dec);

     return $plaintext_dec;
}