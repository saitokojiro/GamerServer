import type { StatMonster } from "../Interface/ISMonster";

export default class Monster implements StatMonster {
    id:number;
    uuid : any;
    name: string;
    level: number;
    pv: number;
    state: string
    constructor(name:string, hp:number) {
        this.id = 0;
        this.uuid = ""
        this.name = name;
        this.level = 0;
        this.pv = hp;
        this.state = "";
    }
    setId = (id: number) =>{
        this.id = id;
    }
    getId = ()=>{
        return this.id;
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
    
    setStatement = (state: string) =>{
        this.state = state;
    }
    getStatement = ()=>{
        return this.state;
    }



}