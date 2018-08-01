export class AlarmItem {
    
    modbus_key: string;
    alarm_class: string = "warning";
    
    constructor(modbus_key: string, alarm_class: string){
        this.modbus_key = modbus_key;
        this.alarm_class = alarm_class;
    }
    
}

