/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class ReadCommand {
    
    priority: number = 1;
    gateway_id: number;
    board_address: number;
    modbus_function_code: number;
    start_address: number;
    count: number;
    
    constructor(priority: number, gateway_id: number, board_address: number, command: PartialReadCommand){
        this.priority = priority;
        this.gateway_id = gateway_id;
        this.board_address = board_address;
        this.modbus_function_code = command.modbus_function_code;
        this.start_address = command.start_address;
        this.count = command.count;
    }
}

export class PartialReadCommand {
    
    modbus_function_code: number;
    start_address: number;
    count: number;
    
    constructor(modbus_function_code: number, start_address: number, count: number){
        this.modbus_function_code = modbus_function_code;
        this.start_address = start_address;
        this.count = count;
    }
}
