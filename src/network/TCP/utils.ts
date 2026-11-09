import * as flatbuffers from 'flatbuffers';
import { FBroom } from "../../../schemaServer/fbroom/sample";
import { start } from 'repl';
import Monster from '../../Monster/BaseMonster';
import type { ISMonster, ISMonsterEntity } from '../../Interface/ISMonster';

let playerIdJoin = (name: string, type: string) => {
    let builder = new flatbuffers.Builder();
    let PlayerUID = builder.createString(name)
    let TypeCat = builder.createString(type)

    FBroom.startFBroom(builder);
    FBroom.addType(builder, TypeCat)
    FBroom.addNamejoin(builder, PlayerUID)

    let pO = FBroom.endFBroom(builder);

    builder.finish(pO)
    console.log('send')
    return builder.asUint8Array();
}

export let connectedSockets = new Set();
connectedSockets.broadcast = function (data, except) {
    //super(this) = connectedSockets
    //console.log(this)
    for (let sock of connectedSockets) {
        //  if (sock === except) continue;
        /*if (sock !== except) {
            
        }*/
        //sock.write(data);
        sock.write(data);
    }
}


export let broadcastSendListPlayer = function (socket: Map<string, any>, except) {

    let tempArr = []
    socket.forEach((el, key) => {

        connectedSockets.broadcast(playerIdJoin(el.data.sessionId, "join"), except);

    })

}

export let Range3D = (U1: any, U2: any, maxRange: number) => {
    const dx = U2.x - U1.x
    const dy = U2.y - U1.y
    const dz = U2.z - U1.z

    const distance = dx * dx + dy * dy + dz * dz
    //const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    const rangeSq = maxRange * maxRange
    return distance <= rangeSq;

}
export let Range = (U1: any, U2: any, maxRange: number) => {

    return Math.abs(U1 - U2) <= maxRange

}

export let RangeCube = (objPos: { X: number, Y: number, Z: number }, center: { X: number, Y: number, Z: number }, maxRange: number) => {
    return {
        x: Math.abs(objPos.X + center.X),
        y: Math.abs(objPos.Y + center.Y),
        z: Math.abs(objPos.Z + center.Z),
    }
}

export let rndMinMax = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export let origin3D = (Start: vec3D, End: vec3D) => {
    return {
        x: (Start.x + End.x) / 2,
        y: (Start.y + End.y) / 2,
        z: (Start.z + End.z) / 2,
    }
}

export let sizeZone = (Start: vec3D, End: vec3D) => {
    return {
        x: Math.abs(Start.x + End.x),
        y: Math.abs(Start.y + End.y),
        z: Math.abs(Start.z + End.z),
    }
}


function isInsideMaxRange(objPos: vec3D, center: vec3D, maxRange: number) {
    return Math.abs(objPos.x - center.x) <= maxRange &&
        Math.abs(objPos.y - center.y) <= maxRange &&
        Math.abs(objPos.z - center.z) <= maxRange;
}



export let loopByFrame = (callback: () => any, ms: number) => {
    let lsnd = Date.now()
    return () => {
        const snd = Date.now()
        if (snd - lsnd >= ms) {
            callback()
            lsnd = snd
        }
    }
}

export let getRandomPointInZone = (position: { x: number, y: number, z: number }, MaxRange: number) => {
    console.log("Utils.ts : ligne 114 : value :" + position.x + " " + position.y + " " + position.z)
    return {
        x: rndMinMax(position.x - MaxRange, position.x + MaxRange),
        //y: rndMinMax(position.Y, position.Y + (position.MaxRange - 5)),
        y: position.y,
        z: rndMinMax(position.z - MaxRange, position.z + MaxRange)
    }
}
export let getRandomPointInZoneAB = (positionA: { x: number, y: number, z: number }, positionB: { x: number, y: number, z: number }, MaxRange: number) => {
    console.log("Utils.ts : ligne 114 : value :" + positionA.x + " " + positionA.y + " " + positionA.z)
    return {
        x: rndMinMax(positionA.x - MaxRange, positionB.x + MaxRange),
        //y: rndMinMax(position.Y, position.Y + (position.MaxRange - 5)),
        y: rndMinMax(positionA.y - MaxRange, positionB.y + MaxRange),
        z: rndMinMax(positionA.z - MaxRange, positionB.z + MaxRange)
    }
}

export let moveToward = (monster: ISMonsterEntity, detlaTime: number) => {
    // if (!monster?.targetPosition) return
    //console.log(monster.position)

    const dx = monster.targetPosition.x - monster.position.x
    const dy = monster.targetPosition.y - monster.position.y
    const dz = monster.targetPosition.z - monster.position.z

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (distance < 10) {
        //console.error("check")
        // monster.targetPosition = monster.position;
        //monster.targetPosition = {x:monster.position.x,y:monster.position.y, z:monster.position.z}
        //monster.targetPosition = {x:monster.position.x,y:monster.position.y, z:monster.position.z}
        //console.log(monster.targetPosition)
        return;
    }

    const step = monster.speedMove * detlaTime;
    const actualStep = Math.min(step, distance)

    monster.position.x += (dx / distance) * actualStep;
    monster.position.y += (dy / distance) * actualStep;
    monster.position.z += (dz / distance) * actualStep;

    //console.log(monster.position)

}

export let moveTowardNPC = (monster: ISMonsterEntity, deltaTime: number) => {
    if (!monster?.targetPosition) return;

    // Calcul de la direction vers la target
    const dx = monster.targetPosition.x - monster.position.x;
    const dy = monster.targetPosition.y - monster.position.y;
    const dz = monster.targetPosition.z - monster.position.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance < 1e-3) {
        // On est déjà sur la target
        monster.velocityVector = { x: 0, y: 0, z: 0 };
        monster.velocityValue = 0;
        return;
    }

    // Calcul du pas de déplacement côté serveur
    const step = monster.speedMove * deltaTime; // ton ancien deltaTime * 100 * 3
    const actualStep = Math.min(step, distance);

    // Déplacement effectif
    monster.position.x += (dx / distance) * actualStep;
    monster.position.y += (dy / distance) * actualStep;
    monster.position.z += (dz / distance) * actualStep;

    // Calcul de la vitesse réelle (unités / seconde)
    const speed = actualStep / deltaTime;

    // Stockage de la direction normalisée et de la vitesse pour l’envoyer au client
    monster.velocityVector = {
        x: dx / distance,
        y: dy / distance,
        z: dz / distance
    };
    monster.velocityValue = speed;

    // Retour optionnel pour debug ou log
    return {
        step: actualStep,
        distanceRemaining: distance - actualStep,
        velocityVector: monster.velocityVector,
        velocityValue: monster.velocityValue
    };
};

export let getTargetPosition = (
    currentPos: { x: number, y: number, z: number },
    zone: { positionStart: any; positionEnd: any },
    maxRange: number
) => {
    // Tirage aléatoire autour du point courant
    let x = currentPos.x + (Math.random() * 2 - 1) * maxRange;
    let z = currentPos.z + (Math.random() * 2 - 1) * maxRange;

    // Clamp pour rester dans la zone carrée
    x = Math.max(zone.positionStart.x, Math.min(x, zone.positionEnd.x));
    z = Math.max(zone.positionStart.z, Math.min(z, zone.positionEnd.z));

    return { x, y: currentPos.y, z };
}

//el.write(playerIdJoin(el.data.sessionId, "join"))
/*if (except?.data.sessionId !== el.data.sessionId) {

}*/
/*export let broadcastSendListPlayer = function (data: any[], except) {
    //console.log(data)
    //for (let player of data) {
    
if (except?.data.sessionId !== data[i].data.sessionId) {
    //setTimeout(() => {
    let JoinPlayer = {
        type: "join",
        id: data[i].data.sessionId
    };
    console.log(except.data.sessionId + " : " + data[i].data.sessionId)
    connectedSockets.broadcast(JSON.stringify(JoinPlayer), except);
    
}


        }

    } * /


/*
//Message reçu du serveur : {"type":"join","id":"7ed99969-fd28-4fbc-a723-bd2b2dae66bc", "position":{"x":250,"y":250}}{"type":"join","id":"efd06296-6a88-4b8d-91fe-d6a7a0774d23", "position":{"x":250,"y":250}}{"type":"join","id":"6b4d6405-604f-402a-8d84-ee7a9a074c25", "position":{"x":250,"y":250}}


Message reçu du serveur : {"type":"join","id":"7ed99969-fd28-4fbc-a723-bd2b2dae66bc", "position":{"x":250,"y":250}}
Message reçu du serveur : {"type":"join","id":"efd06296-6a88-4b8d-91fe-d6a7a0774d23", "position":{"x":250,"y":250}}
Message reçu du serveur : {"type":"join","id":"6b4d6405-604f-402a-8d84-ee7a9a074c25", "position":{"x":250,"y":250}}*/

interface ISvec3D {
    x: number
    y: number
    z: number
}

export class vec3D implements ISvec3D {
    x: number
    y: number
    z: number
    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

}


export interface ISDataUdp {
    type: string,
    zone: string,
    uuid: string
    start: vec3D,
    end: vec3D
}
export let multiplicateur = 1000 / 2