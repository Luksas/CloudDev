import { AirHandlingUnit } from './AirHandlingUnit';

export class Gateway {
    
    id: number;
    name: string;
    mac: string;
    status_id: number;
    active: boolean = false;
    slaves: AirHandlingUnit[];
    
    isActive(){
        return this.active;
    }
    
    getSlaveCount(): number
    {
        return this.slaves.length;
    }
    
    // Returns non existing slave board address
    getUniqueSlaveAddress(){
        let unique_address = 1;
        
        for (let i = 0; i < this.slaves.length; i++) {
            if (this.slaves[i].board_address == unique_address) {
                // Skip address and reset
                unique_address++;
                i = 0;
            }
        }
        
        return unique_address;
    }
    
}
