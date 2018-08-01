/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class Register {
    
    address: string;
    modbus_function_code: string;
    value: string;
    date: string;
    ignore_polls: number = 0;
    
    // This value is useless! - used to emit changes to UI, if need to visually change some value
    emit_value: number = 0;
    
    constructor(address: string, modbus_function_code: string, value: string, date: string) {
        this.address = address;
        this.modbus_function_code = modbus_function_code;
        this.value = value;
        this.date = date;
    };
    
    needToIgnorePoll() : boolean {
        if (this.ignore_polls > 0) {
            this.ignore_polls--;
            return true;
        }
        
        return false;
    }
    
    buildKey() : string {
        if (this.getModbusString() === undefined) {
            return this.modbus_function_code + "_" + this.address;
        }
        
        return this.getModbusString() + "_" + this.address;
    }
    
    getModbusNum(){
        if (this.getModbusString() !== undefined) {
            return this.modbus_function_code;
        }
        
        var keys = {
            "COILS": "1",
            "DI": "2",
            "HR": "3",
            "IR": "4"
        };
        
        return keys[this.modbus_function_code];
    }
    
    getModbusString(){
        var keys = {
            "1": "COILS",
            "2": "DI",
            "3": "HR",
            "4": "IR"
        };
        
        return keys[this.modbus_function_code];
    }
    
    equals(register: Register){
        if (register === undefined) {
            return false;
        }
        
        return this.date == register.date;
    }
    
}
