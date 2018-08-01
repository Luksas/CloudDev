import { DeviceService } from '../../services/DeviceService';
import { AirHandlingUnit } from '../../data/AirHandlingUnit';
import { LineChartData } from '../../data/LineChartData';


export class BaseMonitoring {
    
    slaves : AirHandlingUnit[];
    slave_data: LineChartData;
    possible_dates: string[];
    
    constructor(protected device_service: DeviceService) {}
    
    ngOnInit(){
        this.initialiseDeviceList();
    }
    
    loadPossibleDates(selected_slave_id: number){
        
    }
    
    initialiseDeviceList(){
        this.slaves = [];
        
        this.device_service.getCurrentUserSlavesList().subscribe(response => {
            if (response.hasErrors()) {
                return;
            }
            
            if (response.response !== undefined) {
                this.slaves = response.response as AirHandlingUnit[];
            }
        });
    };
    
}