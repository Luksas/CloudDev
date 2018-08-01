/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
import { Register } from './Register';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/observable/of';

export class RegisterList {
    
    private registers = new Map<string, BehaviorSubject<Register>>();
    
    public cleanRegisters(){
        this.registers = new Map<string, BehaviorSubject<Register>>();
    }
    
    public get(key: string) : BehaviorSubject<Register> {
        let subject = this.registers.get(key);
        if (subject === undefined) {
            let arr = key.split('_');
            subject = new BehaviorSubject<Register>(new Register(arr[1], arr[0], "0", "0"));
            
            this.registers.set(key, subject);
        }
        
        return subject;
    }
    
    public next(register: Register){
        this.emitUpdate(register);
    }
    
    public nextByKey(key: string){
        let subject = this.registers.get(key);
        
        if (subject !== undefined) {
            this.emitUpdate(subject.value);
        }
    }
    
    public loadRegistersFromResponse(array: any[]){
        for (let i = 0; i < array.length; i++) {
            let new_register = this.createRealRegister(array[i] as Register);
            let old_register = this.get(new_register.buildKey()).value;
            
            // Only need to emit registers that have changed
            if (!new_register.equals(old_register)) {
                this.emitUpdate(new_register);
            }
        }
    }
    
    private createRealRegister(register: Register) : Register {
        return new Register(register.address, register.modbus_function_code, register.value, register.date);
    }
    
    private emitUpdate(register: Register){       
        var key = register.buildKey();
        let subject = this.registers.get(key);
        
        console.log('emit register');
        
        if (this.isSubjectUndefined(subject)) {
            subject = new BehaviorSubject<Register>(new Register(register.address, register.modbus_function_code, register.value, register.date));
            
            // Ignore this register (ignoring is done when user SETS the register value, to prevent old value returning)
            if (subject.value.needToIgnorePoll()) {
                return;
            }
            
            this.registers.set(key, subject);
        }
        
        subject.next(register);
    }
    
    private isSubjectUndefined(subject: BehaviorSubject<Register>){
        return subject === undefined;
    }
    
}