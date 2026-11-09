//import { sendWithDelay } from "../../global";
import * as flatbuffers from 'flatbuffers';
import { FBroom } from "../../../schemaServer/fbroom/sample";


export let connectedSockets = new Set();
connectedSockets.broadcast = function (data, except) {
    //super(this) = connectedSockets
    //console.log(this)
    for (let sock of connectedSockets) {
        /*if (sock !== except) {
            
        }*/
        sock.write(data);

    }
}

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

export let broadcastSendListPlayer = function (data: Map<string, any>, except) {
    //console.log(data)
    //for (let player of data) {
    //for (let i = 0; i < data.length; i++) {
    /*if (sock !== except) {
        sock.write(data);
    }*//*
    if (except?.data.sessionId !== data[i].data.sessionId) {
        //setTimeout(() => {
        let JoinPlayer = {
            type: "join",
            id: data[i].data.sessionId
        };
        console.log(except.data.sessionId + " : " + data[i].data.sessionId)
        connectedSockets.broadcast(JSON.stringify(JoinPlayer), except);
        //}, i + 1000)
    }


}*/



    data.forEach((el, key) => {

        el.write(playerIdJoin(el.data.sessionId, 2))
        if (except?.data.sessionId !== el.data.sessionId) {
            //setTimeout(() => {
            let JoinPlayer = {
                type: "join",
                id: el.data.sessionId
            };

            console.log(except.data.sessionId + " : " + el.data.sessionId)
            // connectedSockets.broadcast(JSON.stringify(JoinPlayer), except);

            connectedSockets.broadcast(playerIdJoin(el.data.sessionId, "join"), except);

            console.log("user join : " + el.data.sessionId)
            // el.write(playerIdJoin(el.data.sessionId, 2))


            //}, i + 1000)
        }
    })






}
