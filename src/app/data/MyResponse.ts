export class MyResponse {
    
    error: number;
    
    response: any;
    
    constructor(error: number, response: any){
        this.error = error;
        this.response = response;
    }
    
    getErrorMessage() : string {
        
        // To-Do - use translation service to get error message by error code!
        
        return "Error has occured";
    }
    
    hasErrors() : boolean {
        return this.error != 0;
    }
    
}