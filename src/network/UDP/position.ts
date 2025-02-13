import { playerPosition } from "../../../schema/player-position/sample";
import type { ISUser } from "../../Interface/ISGlobal"
import * as flatbuffers from 'flatbuffers';
import { Vec3 } from './../../../schema/player-position/sample/vec3';


let PositionPlayer = (name: string, type: string, position: any) => {
    let builder = new flatbuffers.Builder();
    let TypeContent = builder.createString(type)
    let PlayerUID = builder.createString(name)

    playerPosition.startplayerPosition(builder)
    playerPosition.addType(builder, TypeContent)
    playerPosition.addPlayerid(builder, PlayerUID)
    playerPosition.addPos(builder, Vec3.createVec3(builder, position.X, position.Y, position.Z))

    let pO = playerPosition.endplayerPosition(builder);

    builder.finish(pO)
    console.log('send')
    return builder.asUint8Array();
}


//export let PositionTcp = (socket: any, message: any, USocket: any[]) => {
export let PlayersPosition = (socket: any, message: any, USocket: Map<string, any>) => {
    if (message.type() == "position") {
        USocket.forEach((el, key) => {
            if (el.user != message.id) {
                socket.send(PositionPlayer(message.id, "position", {
                    X: message.position.x(),
                    Y: message.position.y(),
                    Z: message.position.z(),
                }), el.port, el.addr)
            }
        });
    }


}