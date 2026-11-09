import { resolve } from "bun"
import { CheckJson } from "./src/global"
import type { ISUserUdp } from "./src/Interface/ISGlobal"
import { connect } from "./src/network/UDP/connect"
import { PlayersPosition, position } from "./src/network/UDP/position"


import * as flatbuffers from 'flatbuffers';
import { FBPlayerData } from './schemaServer/fbplayerdata/sample';
import { playerPosition } from "./schemaServer/player-position/sample";
import { FBroom } from "./schemaServer/fbroom/sample";
import { close } from "./src/network/UDP/close"

let msgServer = async () => {
    console.log("Game Server Project W")
    console.log("Server Type : UDP ")
    console.log("Version : 0.0.1")
    console.log("Engine : Bun ")
    console.log("By Saito Kojiro")
}
msgServer();

let config = {
    hostname: "127.0.0.1",
    port: 3302
}


let timerLoss: number = 3000
let timeoutId: any;
let timeoutPingId: any;
let timerPing: number = 2000

//const arrayUser: ISUserUdp[] = [];
const arrayUser: Map<string, any> = new Map();
const activeUsers: Map<string, { addr: Buffer, port: number, lastPingTime: number }> = new Map();

let pingClient = (socket: any, data: any, listArray: ISUserUdp[], addr: Buffer, port: number) => {


    if (data.toString() == "pong") {
        clearTimeout(timeoutPingId);
        console.log("ok 11111111111111111111")
    }
    timeoutPingId = setTimeout(() => {

        for (const el of listArray) {
            console.log("port user : " + el.port)
            socket.send('ping', el.port, el.addr.toString())

        }

    }, timerPing)
    /*
   for (const el of listArray) {
       socket.send('ping', el.port, el.addr.toString())

   }
   /* timeoutPingId = setTimeout(() => {
        pingClient(socket, data, listArray, addr, port); // Call pingClient again
    }, timerPing);*/


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

let ULooper: any;

Bun.udpSocket({
    hostname: "192.168.1.61",
    port: 3302,
    socket: {
        async data(socket, buf, port, addr) {


            let buff = new flatbuffers.ByteBuffer(new Uint8Array(buf))
            let anyRoom = FBroom.getRootAsFBroom(buff)
            let position = playerPosition.getRootAsplayerPosition(buff)
            console.log(anyRoom.type())
            connect(socket, addr, port, anyRoom, arrayUser)
            close(socket, anyRoom, arrayUser)
            PlayersPosition(socket, position, arrayUser)

            /*  if (anyRoom.type() == 'close') {
                  let name = anyRoom.namejoin()
                  console.log("Player " + name + " is Disconnected")
                  arrayUser.delete(name)
                  arrayUser.forEach((value, key) => console.log("Player connected : " + value.user))
              }*/

            if (!ULooper) {
                ULooper = setInterval(() => {

                    arrayUser.forEach((value, key) => {
                        console.log("player :" + value.user)
                        let data = Buffer.from("helloworld")
                        socket.send(data, value.port, value.addr)
                    })

                    console.log(arrayUser.size)
                    if (arrayUser.size <= 0) {
                        clearInterval(ULooper)
                        ULooper = null;
                    }
                }, 500)
            }







        },
        drain(socket) {
            console.log("drain")
        },
        error(socket, error) {
            console.log("close")
        },
    }
})


