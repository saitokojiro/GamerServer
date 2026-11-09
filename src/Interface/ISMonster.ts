import type Monster from "../Monster/BaseMonster";
import type { vec3D } from "../network/TCP/utils";

export interface ISMonster {
    zone: string,
    zoneConfig ?: Zone,
    type: new ()=> any,
    position: {x:number, y: number, z : number},
    targetPosition : {x:number, y: number, z : number}
    positionReady : boolean,
    isMoving : boolean,
    speedMove : number
    max?: number,
    modifier ?: (monster : StatMonster)=> void

}

export interface ISMonsterEntity {
    zone: string,
    zoneConfig ?: Zone,
    type: Monster,
    position: {x:number, y: number, z : number},
    targetPosition : {x:number, y: number, z : number, err?:number}
    targetEnemy ?:{x:number, y: number, z : number, err?:number}
    positionOrigin ?:{x:number, y: number, z : number, err?:number}
    isTarget : boolean
    path :any[]
    pathCount :number
    pathStep : number
    positionReady : boolean,
    isMoving : boolean,
    speedMove : number
    max?: number,
    velocityVector?: { x: number, y: number, z: number },  // direction normalisée
    velocityValue?: number,  // vitesse en unités/sec
    distanceRemaining?: number,
    lastSentPosition?:{x:number,y:number, z:number},
    networkDirty? : boolean,
    modifier ?: (monster : StatMonster)=> void

}



export interface Zone{
    positionStart : {x:number, y: number, z : number},
    positionEnd ?: {x:number, y: number, z : number},
    MaxRange : number
}

export interface StatMonster {
    id:number;
    uuid : any;
    name: string;
    level: number;
    pv: number;
    def?: number;
    attack?:number
    state: string
}