import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ReadCommand, PartialReadCommand } from '../data/ReadCommand';
import { RegisterDataService } from './RegisterDataService';
import 'rxjs/add/operator/map';

@Injectable()
export class CommandService {

    constructor(private http: HttpClient, private register_service: RegisterDataService) {}
    
    public sendReadCommands(partial_commands: PartialReadCommand[]){
        let commands = this.buildReadCommands(partial_commands);
        
        this.http.post(environment.service_url + "Registers/addReadCommand", {commands: JSON.stringify(commands)}).subscribe();
    }
    
    private buildReadCommands(partial_commands: PartialReadCommand[]) : ReadCommand[] {
        let commands: ReadCommand[] = [];
        let priority = 1;
        let gateway_id = this.register_service.getActiveSlave().gateway_id;
        let board_address = this.register_service.getActiveSlave().board_address; 
        
        partial_commands.map((command: PartialReadCommand, index: number) => {
            commands.push(new ReadCommand(priority, gateway_id, board_address, command))
        });
        
        return commands;
    }

}