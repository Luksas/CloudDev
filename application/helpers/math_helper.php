<?php

/**
 * Calculated average value in array
 * @param integer[] $array
 * @return integer
 */
function array_average_number($array){
    return array_sum($array) / count($array);
}

/**
 * Calculated average date in array
 * @param string[] $array
 * @return string
 */
function array_average_date($array){
    $format = 'Y-m-d H:i:s';

    $total = 0;
    $count = 0;

    foreach($array as $value)
    {
      $total += DateTime::createFromFormat($format, $value)->getTimestamp();
      $count++;
    }

    return date($format, $total / $count);
}