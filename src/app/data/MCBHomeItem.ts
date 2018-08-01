export class MCBHomeItem {

    name: string;
    image: string;
    point: boolean;
    coef: number;
    value_key: string;
    visible_key: string;
    show_when: number;

    constructor(name: string, image: string, point: boolean, value_key: string, visible_key: string, coef: number, show_when: number) {
        this.name = name;
        this.image = image;
        this.point = point;
        this.value_key = value_key;
        this.visible_key = visible_key;
        this.show_when = show_when;
        this.coef = coef;
    }

}