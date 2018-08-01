export class MCBMainMenuItem {
    
    image: string;
    text: string;
    href: string;
    active: string;
    visible: boolean = true;
    
    constructor(image: string, href: string, text: string, active: string) {
        this.image = image;
        this.text = text;
        this.href = href;
        this.active = active;
    }
    
}