export default class Monster {
    name: string;
    level: number;
    pv: number;
    constructor() {
        this.name = "";
        this.level = 0;
        this.pv = 0
    }
    setName = (name: string) => {
        this.name = name
    }
    getName = () => {
        return this.name
    }
    setPv = (pv: number) => {
        this.pv = pv
    }
    getPv = () => {
        return this.pv
    }

    setLevel = (level: number) => {
        this.level = level
    }
    getLevel = () => {
        return this.level
    }



}