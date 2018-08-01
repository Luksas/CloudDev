export class Account {
    
    id: string = "";
    username: string = "";
    email: string = "";
    roles: string[] = [];
    join_date: string = "";
    
    constructor(obj: any = null) {
        this.map(obj);
    }
    
    isGuest() : boolean {
        return this.roles.includes('GUEST');
    }
    
    isUser() : boolean {
        return this.roles.includes('USER');
    }
    
    isAdmin() : boolean {
        return this.roles.includes('ADMIN');
    }
    
    private map(obj: any){
        if (obj != null) {
            for (let prop in obj) {
                this[prop] = obj[prop];
            }
        }
    }
    
}