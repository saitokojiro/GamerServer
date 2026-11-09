import { CheckJson } from "./src/global"
import { PositionTcp } from "./src/network/TCP/Position";
import { broadcastSendListPlayer, connectedSockets, getRandomPointInZone, getRandomPointInZoneAB, getTargetPosition, loopByFrame, moveToward, moveTowardNPC, multiplicateur, Range, Range3D, rndMinMax, vec3D, type ISDataUdp } from "./src/network/TCP/utils";

import * as flatbuffers from 'flatbuffers';
import { FBPlayerData } from './schemaServer/fbplayerdata/sample';
import { playerPosition } from "./schemaServer/player-position/sample";
import { FBroom } from "./schemaServer/fbroom/sample";
import { monsterloc } from "./src/network/TCP/monsterloc";
import { NavMesh, Vec3f } from './schemaServer/nav-mesh/sample';
import EventEmitter from 'node:events';
import { Spawn } from "./src/network/TCP/world/Spawn";
import type { ISMonster, ISMonsterEntity } from "./src/Interface/ISMonster";
import { monsterList, monsterSpawn } from "./src/Monster/ListMonster";
import { Position } from "./src/network/WS/Position";
import { Monster } from "./schemaServer/monster/sample";
import { spawn } from "node:child_process";

let msgServer = async () => {
    //console.log("Game Server Project W")
    console.log("Server Type : TCP ")
    console.log("Version : 0.0.1")
    //console.log("Engine : Bun ")
    //console.log("By Saito Kojiro")
}
msgServer();
//let USocket: any[] = []
let USocket: Map<string, any> = new Map();
type SocketData = { sessionId: string };
let timerLoss: number = 300000
let timerPing: number = 500
let checkPlayer: number = 2000
let timeoutId: any;
let timeoutPingId: any;
let checkPlayerId: any;

//ok test 





let removeUserDisconnect = (socket: any) => {

    //let ArrayUserTemp: any[] = []
    let ArrayUserTemp: Map<string, any> = new Map()
    //USocket.some((el) => {
    USocket.forEach((el, key) => {
        console.log("user : " + el.data.sessionId)
        /*if (el.remoteAddress != socket.remoteAddress) {
            el?.end();
            ArrayUserTemp.push(el)
        }*/
        if (el.data.sessionId != socket.data.sessionId) {


            //ArrayUserTemp.push(el)
            ArrayUserTemp.set(key, el)
        }
        if (el.data.sessionId == socket.data.sessionId) {
            el?.end();
        }
    })
    USocket = ArrayUserTemp
    console.log("Socket END *************")
    //console.log("Player connected : " + USocket.length)
    console.log("Player connected : " + USocket.size)
}


let beatHeart = (socket: any) => {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
        socket?.end();
    }, timerLoss)
}

let pingClient = (socket: any, data: any) => {
    if (data.type == "pong") {
        clearTimeout(timeoutPingId);
        console.log(data)
    }
    timeoutPingId = setTimeout(() => {

        let stp: number = Date.now()
        //let stp: any = parseInt(new Date().getTime() / 1000, 10).toString()
        let jsonPing = {
            type: "ping",
            id: socket.data.sessionId,
            time: stp
        }
        console.log(stp)

        //socket.write(JSON.stringify(jsonPing));
        connectedSockets.broadcast(JSON.stringify(jsonPing), socket)
    }, timerPing)
}
let playerId = (name: string, type: string) => {
    let builder = new flatbuffers.Builder();
    let PlayerUID = builder.createString(name)
    let TypeCat = builder.createString(type)

    FBPlayerData.startFBPlayerData(builder);
    FBPlayerData.addType(builder, TypeCat)
    FBPlayerData.addName(builder, PlayerUID)

    let pO = FBPlayerData.endFBPlayerData(builder);

    builder.finish(pO)
    return builder.asUint8Array();
}






let UDPEmit = new EventEmitter();
let client = await Bun.udpSocket({
    hostname: "192.168.1.61",
    //port: 3302,
    socket: {
        data(socket, buf, port, addr) {
            //console.log(`message from ${addr}:${port}:`);
            let buff = new flatbuffers.ByteBuffer(new Uint8Array(buf))
            let po = NavMesh.getRootAsNavMesh(buff)
            //console.log(po.pointsLength());
            UDPEmit.emit("buff", buff);

            USocket.forEach((el, key) => {

            })

        },
    },
})





Bun.listen({
    hostname: "192.168.1.61",
    port: 3301,


    socket: {

        open(socket) {
            console.log("user connect")
            // socket.timeout(1000)
            console.log("open")
            let PlayerId: any = crypto.randomUUID();
            let PlayerAccount: {} = {
                "type": "connect",
                "id": PlayerId,
            }



            socket.data = {
                sessionId: PlayerId,
                lastMessage: null,
                monster: []

            } as SocketData;

            //console.log(socket.data)
            connectedSockets.add(socket)

            setTimeout(() => {
                USocket.set(PlayerId, socket)
                socket.write(playerId(PlayerId, "connect"))
            }, 10000)

            // USocket.push(socket)
            //console.log(USocket.length)
            beatHeart(socket);



            //  broadcastSendListPlayer(USocket, socket)


            console.log(USocket.size);


        },
        async data(socket, data) {

            //socket.timeout(10)
            let dataStr = data.toString()
            let dataBuf = data;


            if (CheckJson(dataStr)) {
                let dataJson = JSON.parse(dataStr)
                if (dataJson.type == "playerConnect") {
                    // broadcastSendListPlayer(USocket, socket)
                }
                console.log("------------")
                PositionTcp(socket, dataJson, USocket)
                console.log("------------")
                /* if (dataJson.type == "pong") {
                     beatHeart(socket)
                     pingClient(socket, dataJson)
                 }*/

            } else {
                //console.log("no json")

                //console.log(data)
                let buff = new flatbuffers.ByteBuffer(new Uint8Array(data))
                let position = playerPosition.getRootAsplayerPosition(buff)
                let anyRoom = FBroom.getRootAsFBroom(buff)
                // console.log(anyRoom.type())
                if (anyRoom.type() == 'join') {

                    console.log("testtttttttttttt : " + anyRoom.namejoin())
                    setTimeout(() => {
                        broadcastSendListPlayer(USocket, socket)
                    }, 5000)

                }
                else if (position.type() == "position") {


                    let dataJ = {
                        type: position.type(),
                        id: position.playerid(),
                        /*PlayerInfo: {
                            playerName: message.PlayerInfo?.playerName
                        },*/
                        position: position.pos(),
                        rotation: position.rot(),
                        velocityvector: position.velocityvector(),
                        velocityvalue: position.velocityvalue(),
                        IsJump: position.isjump(),
                        IsFalling: position.isfalling()

                        /* X: message.position.X,
                         Y: message.position.Y,
                         Z: message.position.Z*/
                    }
                    socket.data.lastMessage = dataJ;
                    //console.log("ID:" +position.playerid())
                    //monsterloc(socket, dataJ, USocket, client)
                    //Spawn(socket, dataJ, USocket, client)
                    PositionTcp(socket, dataJ, USocket)
                }


            }
        },
        async close(socket) {

            console.log("close")
            removeUserDisconnect(socket);
        },
        async drain(socket) {
            console.log("drain")
        },
        async error(socket, error) {
            console.log("err")
        },
        async end(socket) {
            console.log("end")
            removeUserDisconnect(socket);

        },

    }
})

let NPCCube = {
    id: 4564,
    state: "idle",
    position: null,
    path: null
}

const TICK_RATE = 20;
const TICK_MS = 1000 / TICK_RATE;
let lsnd = Date.now()


const monster: ISMonsterEntity[] = []

let CreatePath = loopByFrame(() => {
    console.log(monster.length)

    console.log(monster[0].type.uuid)
    console.log(monster[0].position)
    console.log(monster[0].targetPosition)
}, 4000)
CreatePath()
let errSpawn = 0

let tap: any;
UDPEmit.on("buff", (buff) => {
    let po = NavMesh.getRootAsNavMesh(buff)
    let index = monster.findIndex(e => e.type.uuid === po.uuid())
    //console.log(po.type())
    if (po.type() == "spawn") {

        //console.log("X: " + po.start()?.x() + "Y: " + po.start()?.y() + " Z :" + po.start()?.z())
        //tap = po.start()?.x();
        
        //console.log(monster)
        //console.log(index)
        if (index != -1) {
            let posiS = { x: po.start().x() * multiplicateur, y: po.start().y() , z: po.start().z() * multiplicateur }
            //let posiS = { x: po.start().x() * multiplicateur, y: po.start().y() + 140, z: po.start().z() * multiplicateur }
            let posiE = { x: po.end().x() * multiplicateur, y: po.end().y() , z: po.end().z() * multiplicateur }
            //let posiE = { x: po.end().x() * multiplicateur, y: po.end().y() + 140, z: po.end().z() * multiplicateur }
            //let posia = { x: 0, y: 0, z: 0 }
            monster[index].position = posiS
            monster[index].targetPosition = posiE
            monster[index].isMoving = false;
            monster[index].positionReady = false;

            console.log("spawn")
            console.log("send ID : " + monster[index].type.uuid )
            console.log("correction : " + "X : "+monster[index].position.x + " Y : " + monster[index].position.y + " Z : " + monster[index].position.z)
            console.log(monster[index].zone)
            console.log(monster[index].targetPosition)
            console.log(monster[index].position)
            //console.log(posia)

        } else {
            console.log("error index ")
        }


    }
    if (po.type() === "spawnErr") {
        let posia = { x: po.start().x() * 2, y: po.start().y() * 2, z: po.start().z() * 2 }
        console.log({
            "error": "problem value spawn",
            "value": "X:" + po.start().x() * 2 + " Y:" + po.start().y() * 2 + " Z:" + po.start().z() * 2
        })
        errSpawn = errSpawn + 1
    }
    if (po.type() === "moveNPC") {
        //console.log("X: " + po.start()?.x() + "Y: " + po.start()?.y() + " Z :" + po.start()?.z())
        //tap = po.start()?.x();
        //let index = monster.findIndex(e => e.type.uuid === po.uuid())
        //console.log(monster)
        //console.log(index)
        //console.log(index)
        if (index != -1) {
            //let posiS = { x: po.start().x() * multiplicateur, y: po.start().y() + 140, z: po.start().z() * multiplicateur }
            let posiS = { x: po.start().x() * multiplicateur, y: po.start().y() , z: po.start().z() * multiplicateur }
            let posiE = { x: po.end().x() * multiplicateur, y:  po.end().y(), z: po.end().z() * multiplicateur }
            //let posia = { x: 0, y: 0, z: 0 }
            // monster[index].position = posiS
            

            monster[index].path = [];
            monster[index].pathCount = -1;
            monster[index].pathStep = 0;
            for(let i = 0; i< po.pointsLength()  ; i++){
                //let vec = new vec3D(po.points(i)?.x() * multiplicateur, po.points(i)?.y(), po.points(i)?.z()*multiplicateur)
                let vec = {
                    x: po.points(i)?.x() * multiplicateur, 
                    y:  po.points(i)?.y(), 
                    z: po.points(i)?.z() * multiplicateur}
                monster[index].pathCount++;
                monster[index].path?.push(vec)
            }
            let vectTarget = { 
                x: po.points(0)?.x() * multiplicateur, 
                y: po.points(0)?.y() , 
                z: po.points(0)?.z() * multiplicateur,
            }

            monster[index].targetPosition = vectTarget
            monster[index].positionReady = false;
            monster[index].isMoving = false;
            monster[index].pathStep = 0;
            //if()
           // monster[index].pathCount = po.pointsLength()  ;
            //monster[index].pathCount = monster[index].pathCount - 1  ;

           /* console.log("path")
            console.log(monster[index].path.length)
            console.log(monster[index].pathCount)
            console.log("end path")
            console.log(monster[index].targetPosition)
            console.log(monster[index].position)*/
            //console.log(posia)

        } else {
            console.log("error index ")
        }
    }
    if (po.type() === "spawnErr") {
        let posia = { x: po.start().x() * multiplicateur, y: po.start().y(), z: po.start().z() * multiplicateur }
        console.log({
            "zone" : monster[index].zone,
            "error": "problem value Spawn",
            "value": "X:" + po.start().x() * multiplicateur + " Y:" + po.start().y() * multiplicateur + " Z:" + po.start().z() * multiplicateur
        })
        errSpawn = errSpawn + 1
    }
    if (po.type() === "moveNPCErr") {
        let posia = { x: po.start().x() * multiplicateur, y: po.start().y(), z: po.start().z() * multiplicateur }
        console.log({
            "zone" : monster[index].zone,
            "error": "problem value Move",
            "value": "X:" + po.start().x() * multiplicateur + " Y:" + po.start().y() + " Z:" + po.start().z() * multiplicateur
        })
        errSpawn = errSpawn + 1
    }
    if (po.type() === "navmesh") {
        let data = {
            x: po.points(0)?.x(),
            y: po.points(0)?.y(),
            z: po.points(0)?.z(),
        }
        console.log(data)
    }

})
//value :019bb29b-6489-7000-8d5b-e21212194587
tap = "ok";

let GameLoop = () => {
    const now = Date.now()
    let deltaTime = (now - lsnd) / 1000;
    lsnd = now;

    if (deltaTime > 0.1) deltaTime = 0.1
    Update(deltaTime)
    setTimeout(GameLoop, TICK_MS)

}

let Update = (deltaTime: number) => {

    //console.error("spawn error" + errSpawn)

    monsterList.forEach(spawn => {
        if (!monster.find((el) => el.zone == spawn.zone)) {
            for (let i = 0; i < spawn?.max; i++) {
                let mSpawn = monsterSpawn(spawn)
                monster.push(mSpawn)

                let vecEnd = new vec3D(0, 0, 0)
                let Target: ISDataUdp = {
                    type: "spawn",
                    zone: mSpawn.zone,
                    uuid: mSpawn.type.uuid,
                    start: mSpawn.position,
                    end: mSpawn.targetPosition
                    //end: mSpawn.position
                }
                console.log("send ID : " + mSpawn.type.uuid )
                console.log("send : " + "X : "+mSpawn.position.x + " Y : " + mSpawn.position.y + " Z : " + mSpawn.position.z)
                Spawn(Target, client)
            }
        }
    })


    USocket.forEach((Socket, id) => {
        monster.forEach(spawn => {

            if (!Socket.data.monster.find((el) => el.type.uuid == spawn.type.uuid)) {
                //for (let i = 0; i < spawn?.max; i++) {
                //let mSpawn = monsterSpawn(spawn)


                Socket.data.monster.push(spawn)
                npcSend(Socket, spawn, "spawnNPC")

            }
            //console.log("position player: : X:" + Socket.data.lastMessage?.position.x() +" Y : " + ((Socket.data.lastMessage?.position.z() - 140) / 100) +" Z : "+ Socket.data.lastMessage?.position.y() )
            //console.log("position enemy : X:" + spawn.position.x +" Y : " + spawn.position.y +" Z : "+ spawn.position.z  )
            //let playerPosition = {x: Socket.data.lastMessage?.position.x(), y: ((Socket.data.lastMessage?.position.z() - 140) / 100) ,z:Socket.data.lastMessage?.position.y()}
            let playerPosition = {x: Socket.data.lastMessage?.position.x(), y: (Socket.data.lastMessage?.position.z() / 100) ,z:Socket.data.lastMessage?.position.y()}

            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
            console.error(playerPosition)
            console.log(spawn.position)
            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
            console.log("-------------------------------------------------")
           //if(Range3D({x: Socket.data.lastMessage?.position.x(), y: ((Socket.data.lastMessage?.position.z() - 140) / 100) ,z:Socket.data.lastMessage?.position.y()},  spawn.position, 100)){
           let r3d = Range3D( playerPosition,  spawn.position, 1000)
           if(r3d){
                console.error("TARGET : " + Socket.data.lastMessage.id)

            }
        })
    })

    monster.forEach(m => {
        if (Range3D(m.position, m.targetPosition, 10) && m.positionReady == true) {

            const spawn = monsterList.find(s => s.zone === m.zone)

            if (spawn) {
                let vecStart = new vec3D(
                    rndMinMax(spawn.zoneConfig.positionStart.x + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig?.positionEnd.x + (spawn.zoneConfig.MaxRange - 5)),
                    //rndMinMax(spawn.zoneConfig.positionStart.y + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.y + (spawn.zoneConfig.MaxRange - 5)),
                    rndMinMax(spawn.zoneConfig.positionStart.y, spawn.zoneConfig.positionEnd.y),
                    rndMinMax(spawn.zoneConfig.positionStart.z + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.z + (spawn.zoneConfig.MaxRange - 5))
                )

               // let rndPosi = getTargetPosition(m.position, spawn.zoneConfig, spawn.zoneConfig?.MaxRange)
                let vecEnd = new vec3D(0, 0, 0)
                let vecStartCorrect = new vec3D(vecStart.x, vecStart.y, vecStart.z)
                let vecEndCorrect = new vec3D(m.position.x, vecStart.y, m.position.z)
                let rndPosi = getTargetPosition(vecEndCorrect, spawn.zoneConfig, spawn.zoneConfig?.MaxRange)
                //console.log("position Y End: " + m.position.y)
                //console.log("position Y Start : " + vecStart.y)
                let Target: ISDataUdp = {
                    type: "moveNPC",
                    zone: m.zone,
                    uuid: m.type.uuid,
                    start: vecEndCorrect,
                    end: vecStartCorrect
                }
                // fonction pour le serveur NavMesh dans le but de vérifier les coordonné du NPC son valide sur la carte
                // et qu'il sont bien sur la carte et non dans le vide
                Spawn(Target, client)
            }
        }
        if (m.positionReady == false) {

            moveToward(m, deltaTime * 100 * 5)
            //moveTowardNPC(m, deltaTime*10)
            //console.log(data)

            if(Range3D(m.position, m.targetPosition, 5) && m.pathStep < m.pathCount)
            {
                
                //console.log("path" + m.pathCount)
                
                m.pathStep++ 
                //console.log(m.pathStep)
                //console.log(m.path.length)
                /*console.log("path 497 : "+ 
                    "X: " + m.path[m.pathStep].x +
                    " Y: " + m.path[m.pathStep].y+
                    " Z: " + m.path[m.pathStep].z
                )*/
                
                m.targetPosition = {x: m.path[m.pathStep].x , y: m.path[m.pathStep].y, z: m.path[m.pathStep].z}
                USocket.forEach((Socket, id) => {
                    npcSend(Socket, m, "MoveNPC")
                })

            }

            
            if (!m.isMoving) {
                USocket.forEach((Socket, id) => {

                    npcSend(Socket, m, "MoveNPC")
                })
                //console.log("send position : " + m.position)
                m.isMoving = true
            }

            if (Range3D(m.position, m.targetPosition, 10) && m.pathStep >= m.pathCount ) {
                //console.log("teest")
                //console.log("test")
                m.positionReady = true
                m.isMoving = false;
                m.pathStep = 0;

            }
            if(Range3D(m.position, m.targetPosition, 10)){
                m.positionReady = true
                m.isMoving = false;
                m.pathStep = 0;
            }
        }
    })




}


let npcSend = (Socket, m: ISMonsterEntity, type: string) => {
    const builder = new flatbuffers.Builder(1024);
    // const typeStr = builder.createString("MoveNPC")
    const typeStr = builder.createString(type)
    const zone = builder.createString(m.zone)
    const playerID = builder.createString("Nan")
    const uuid = builder.createString(m.type.uuid)

    const pos = Vec3f.createVec3f(builder, m.position.x, 140, m.position.z)
    const targetPosition = Vec3f.createVec3f(builder, m.targetPosition.x, 140, m.targetPosition.z)
    const velocity = Vec3f.createVec3f(builder, m.velocityVector.x, 140, m.velocityVector.z)
    //const velocity = Vec3f.createVec3f(builder, 0, 0, 0)
    Monster.startMonster(builder)
    Monster.addType(builder, typeStr)
    Monster.addZone(builder, zone)
    Monster.addPlayerid(builder, playerID)
    Monster.addName(builder, uuid)
    Monster.addHp(builder, 0)
    Monster.addMp(builder, 0)
    Monster.addLv(builder, 0)
    Monster.addExp(builder, 0)
    Monster.addIsjump(builder, false)
    Monster.addIsfalling(builder, false)
    Monster.addPosorigine(builder, pos)
    Monster.addPos(builder, pos)
    Monster.addPostarget(builder, targetPosition)
    Monster.addRot(builder, targetPosition)
    Monster.addVelocityvector(builder, velocity)
    Monster.addVelocityvalue(builder, m.velocityValue)
    const monsterOffest = Monster.endMonster(builder)
    builder.finish(monsterOffest)
    const buffer = builder.asUint8Array()
    Socket.write(buffer)
}



GameLoop();







/*const builder = new flatbuffers.Builder(1024);
                const typeStr = builder.createString("spawnNPC")
                const zone = builder.createString(spawn.zone)
                const playerID = builder.createString("Nan")
                const uuid = builder.createString(spawn.type.uuid)

                const pos = Vec3f.createVec3f(builder, spawn.position.x, spawn.position.y, spawn.position.z)
                const rot = Vec3f.createVec3f(builder, 0, 0, 0)
                Monster.startMonster(builder)
                Monster.addType(builder, typeStr)
                Monster.addZone(builder, zone)
                Monster.addPlayerid(builder, playerID)
                Monster.addName(builder, uuid)
                Monster.addHp(builder, 0)
                Monster.addMp(builder, 0)
                Monster.addLv(builder, 0)
                Monster.addExp(builder, 0)
                Monster.addIsjump(builder, false)
                Monster.addIsfalling(builder, false)
                Monster.addPos(builder, pos)
                Monster.addRot(builder, rot)
                Monster.addRot(builder, rot)
                Monster.addVelocityvector(builder, rot)
                Monster.addVelocityvalue(builder, 0)
                const monsterOffest = Monster.endMonster(builder)
                builder.finish(monsterOffest)
                const buffer = builder.asUint8Array()
                Socket.write(buffer)
                console.log(spawn.type.uuid)*/



// }