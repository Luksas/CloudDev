/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class MenuItem {
    
    label: string;
    href: string;
    active: string;
    children: MenuItem[];
    
    constructor(fields?: {
            label?: string,
            href?: string,
            active?: string,
            children?: MenuItem[]
        }) {
        
        if (fields) Object.assign(this, fields);
    }
    
    hasChildren() : boolean {
        if (this.children === undefined) {
            return false;
        }
        
        if (this.children == null) {
            return false;
        }
        
        return true;
    }
    
};