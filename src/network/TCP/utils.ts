import * as flatbuffers from 'flatbuffers';
import { FBroom } from "../../../schema/fbroom/sample";

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