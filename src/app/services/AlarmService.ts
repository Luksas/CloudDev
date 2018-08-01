import { Injectable, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { AlarmItem} from '../data/AlarmItem'

@Injectable()
export class AlarmService implements OnInit {
    
    private warnings: AlarmItem[];
    private alarms: AlarmItem[];
    
    constructor() {
        this.loadWarnings();
        this.loadAlarms();
    }
    
    ngOnInit(){
        this.loadWarnings();
        this.loadAlarms();
    }
    
    getAllAlertListKeys(){
        return this.alarmItemArrayToKeyArray(this.getAllAlertList());
    }
    
    getAllAlertList(): AlarmItem[] {
        return this.alarms.concat(this.warnings);
    }
    
    getWarnings(): AlarmItem[]{
        return this.warnings;
    }
    
    getAlarms(): AlarmItem[]{
        return this.alarms;
    }
    
    isAlarm(modbus_key: string): boolean {
        return this.isInArray(this.alarms, modbus_key);
    }
    
    isWarning(modbus_key: string): boolean {
        return this.isInArray(this.warnings, modbus_key);
    }
    
    private isInArray(array:  AlarmItem[], modbus_key: string): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i].modbus_key == modbus_key) {
                return true;
            }
        }
        
        return false;
    }
    
    private alarmItemArrayToKeyArray(array:  AlarmItem[]): string[]{
        let result: string[] = [];
        
        for (let i = 0; i < array.length; i++) {
            result.push(array[i].modbus_key);
        }
        
        return result;
    }
    
    private loadWarnings(){
        this.warnings = [];
        this.warnings.push(new AlarmItem('DI_1', 'warning'));
        this.warnings.push(new AlarmItem('DI_3', 'warning'));
        this.warnings.push(new AlarmItem('DI_4', 'warning'));
        this.warnings.push(new AlarmItem('DI_6', 'warning'));
        this.warnings.push(new AlarmItem('DI_8', 'warning'));
        this.warnings.push(new AlarmItem('DI_9', 'warning'));
        this.warnings.push(new AlarmItem('DI_12', 'warning'));
        this.warnings.push(new AlarmItem('DI_13', 'warning'));
        this.warnings.push(new AlarmItem('DI_14', 'warning'));
        this.warnings.push(new AlarmItem('DI_16', 'warning'));
        this.warnings.push(new AlarmItem('DI_17', 'warning'));
        this.warnings.push(new AlarmItem('DI_18', 'warning'));
        this.warnings.push(new AlarmItem('DI_19', 'warning'));
        this.warnings.push(new AlarmItem('DI_20', 'warning'));
        this.warnings.push(new AlarmItem('DI_21', 'warning'));
        this.warnings.push(new AlarmItem('DI_22', 'warning'));
        this.warnings.push(new AlarmItem('DI_23', 'warning'));
        this.warnings.push(new AlarmItem('DI_33', 'warning'));
        this.warnings.push(new AlarmItem('DI_35', 'warning'));
        this.warnings.push(new AlarmItem('DI_37', 'warning'));
        this.warnings.push(new AlarmItem('DI_48', 'warning'));
        this.warnings.push(new AlarmItem('DI_49', 'warning'));
        this.warnings.push(new AlarmItem('DI_50', 'warning'));
        this.warnings.push(new AlarmItem('DI_52', 'warning'));
        this.warnings.push(new AlarmItem('DI_53', 'warning'));
        this.warnings.push(new AlarmItem('DI_54', 'warning'));
        this.warnings.push(new AlarmItem('DI_55', 'warning'));
        this.warnings.push(new AlarmItem('DI_56', 'warning'));
        this.warnings.push(new AlarmItem('DI_57', 'warning'));
    }
    
    private loadAlarms(){
        this.alarms = [];
        this.alarms.push(new AlarmItem('DI_2', 'alarm'));
        this.alarms.push(new AlarmItem('DI_5', 'alarm'));
        this.alarms.push(new AlarmItem('DI_7', 'alarm'));
        this.alarms.push(new AlarmItem('DI_10', 'alarm'));
        this.alarms.push(new AlarmItem('DI_11', 'alarm'));
        this.alarms.push(new AlarmItem('DI_15', 'alarm'));
        this.alarms.push(new AlarmItem('DI_24', 'alarm'));
        this.alarms.push(new AlarmItem('DI_25', 'alarm'));
        this.alarms.push(new AlarmItem('DI_26', 'alarm'));
        this.alarms.push(new AlarmItem('DI_27', 'alarm'));
        this.alarms.push(new AlarmItem('DI_28', 'alarm'));
        this.alarms.push(new AlarmItem('DI_29', 'alarm'));
        this.alarms.push(new AlarmItem('DI_30', 'alarm'));
        this.alarms.push(new AlarmItem('DI_31', 'alarm'));
        this.alarms.push(new AlarmItem('DI_32', 'alarm'));
        this.alarms.push(new AlarmItem('DI_34', 'alarm'));
        this.alarms.push(new AlarmItem('DI_36', 'alarm'));
        this.alarms.push(new AlarmItem('DI_38', 'alarm'));
        this.alarms.push(new AlarmItem('DI_39', 'alarm'));
        this.alarms.push(new AlarmItem('DI_40', 'alarm'));
        this.alarms.push(new AlarmItem('DI_41', 'alarm'));
        this.alarms.push(new AlarmItem('DI_42', 'alarm'));
        this.alarms.push(new AlarmItem('DI_43', 'alarm'));
        this.alarms.push(new AlarmItem('DI_44', 'alarm'));
        this.alarms.push(new AlarmItem('DI_45', 'alarm'));
        this.alarms.push(new AlarmItem('DI_46', 'alarm'));
        this.alarms.push(new AlarmItem('DI_47', 'alarm'));
        this.alarms.push(new AlarmItem('DI_51', 'alarm'));
    }
    
    

}