import { CheckJson } from "./src/global"
import { PositionTcp } from "./src/network/TCP/Position";
import { broadcastSendListPlayer, connectedSockets } from "./src/network/TCP/utils";

import * as flatbuffers from 'flatbuffers';
import { FBPlayerData } from './schema/fbplayerdata/sample';
import { playerPosition } from "./schema/player-position/sample";
import { FBroom } from "./schema/fbroom/sample";

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

Bun.listen({
    hostname: "127.0.0.1",
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



            socket.data = { sessionId: PlayerId };
            //console.log(socket.data)
            connectedSockets.add(socket)
            USocket.set(PlayerId, socket)
            socket.write(playerId(PlayerId, "connect"))
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
