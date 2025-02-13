import { playerPosition } from "../../../schema/player-position/sample";
import type { ISUser } from "../../Interface/ISGlobal"
//import { position } from "../UDP/position";
import * as flatbuffers from 'flatbuffers';
import { Vec3 } from './../../../schema/player-position/sample/vec3';
//import { position } from './../UDP/position';




/*
model
{
    type: position,
    id: "4568AB",
    name: userTest,
    position: {
        X: 255,
        Y: 255,
        Z: 255,
    }

}

*/

let PositionPlayer = (name: string, type: string, position: any, rotation: any, velocity: any, velocityvalue: any, jump: boolean, falling: boolean) => {
    let builder = new flatbuffers.Builder();
    let TypeContent = builder.createString(type)
    let PlayerUID = builder.createString(name)

    playerPosition.startplayerPosition(builder)
    playerPosition.addType(builder, TypeContent)
    playerPosition.addPlayerid(builder, PlayerUID)
    playerPosition.addPos(builder, Vec3.createVec3(builder, position.X, position.Y, position.Z))
    playerPosition.addRot(builder, Vec3.createVec3(builder, rotation.X, rotation.Y, rotation.Z))
    playerPosition.addVelocityvector(builder, Vec3.createVec3(builder, velocity.X, velocity.Y, velocity.Z))
    playerPosition.addVelocityvalue(builder, velocityvalue)
    playerPosition.addIsjump(builder, jump)
    playerPosition.addIsfalling(builder, falling)
    let pO = playerPosition.endplayerPosition(builder);

    builder.finish(pO)
    console.log('send')
    return builder.asUint8Array();
}

//test serveur


//export let PositionTcp = (socket: any, message: any, USocket: any[]) => {
export let PositionTcp = (socket: any, message: any, USocket: Map<string, any>) => {
    if (message.type == "position") {


        // let data = <ISUser>{
        //     type: message.type,
        //     id: message.id,
        //     name: message.name,
        //     /*PlayerInfo: {
        //         playerName: message.PlayerInfo?.playerName
        //     },*/
        //     position: {
        //         X: message.position.X,
        //         Y: message.position.Y,
        //         Z: message.position.Z
        //     }
        // }



        let data = {
            type: message.type,
            id: message.id,
            name: message.name,
            /*PlayerInfo: {
                playerName: message.PlayerInfo?.playerName
            },*/
            position: [message.position.X, message.position.Y, message.position.Z],
            /* X: message.position.X,
             Y: message.position.Y,
             Z: message.position.Z*/
        }

        //socket.write(JSON.stringify(data))
        USocket.forEach((el, key) => {


            if (el.data.sessionId != message.id) {

                // el.write(JSON.stringify(data))
                //el.write()

                console.log("position :" + "X: " + message.position.x() + " Y: " + message.position.y() + " Z: " + message.position.z())
                console.log("position :" + "X: " + message.rotation.x() + " Y: " + message.rotation.y() + " Z: " + message.rotation.z())
                console.log("position :" + "X: " + message.velocityvector.x() + " Y: " + message.velocityvector.y() + " Z: " + message.velocityvector.z())

                el.write(PositionPlayer(message.id, "position",
                    {
                        X: message.position.x(),
                        Y: message.position.y(),
                        Z: message.position.z(),
                    },
                    {
                        X: message.rotation.x(),
                        Y: message.rotation.y(),
                        Z: message.rotation.z(),
                    },
                    {
                        X: message.velocityvector.x(),
                        Y: message.velocityvector.y(),
                        Z: message.velocityvector.z(),
                    },
                    message.velocityvalue,
                    message.IsJump,
                    message.IsFalling
                ))
            }
        });
        //ws.

    }


}