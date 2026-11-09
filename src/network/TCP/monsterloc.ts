import * as flatbuffers from 'flatbuffers';
import { NavMesh, Vec3f } from '../../../schemaServer/nav-mesh/sample';
import EventEmitter from 'node:events';
import { multiplicateur } from './utils';
//import { NavMesh, Vec3f } from "./.schema/nav-mesh/sample"



export let monsterloc = async (ws, message, USocket, client) => {

    let positionP = message.position

    //console.log(positionP.x()/100)
    //console.log(((positionP.z()-140)+5)/10)
    //let zp = ((positionP.z()-140.01)+5)/10;
    //zp.toFixed(2)
    console.log("X: " + positionP.x()  + " Z: " + positionP.z()  + " Y: " + positionP.y() )
    
    let capsule = 140
    let capsuleServer = 0.25
    console.log()
    const builder = new flatbuffers.Builder(1024);
    const typeStr = builder.createString("navmesh");
    const zone = builder.createString("aa")
    const Uuid = builder.createString("aa")
    let correctJump = positionP.z()
    if (message.IsJump == true) {
        //correctJump = correctJump - 95.0
        //correctJump = correctJump - 35
    }
    console.log("is jump: " + message.IsJump)
    console.log("jump" + correctJump)
    let val:number = positionP.x() / multiplicateur
    //let vala:number = correctJump / ((multiplicateur/2) *3)
    let vala:number =  correctJump/multiplicateur
    let valz:number = positionP.y() / multiplicateur
    console.log("X: " + val  + " Z: " + vala  + " Y: " + valz )
    const startVec = Vec3f.createVec3f(builder,  parseFloat(val.toFixed(2)), parseFloat(vala.toFixed(2)), parseFloat(valz.toFixed(2)));
    //const startVec = Vec3f.createVec3f(builder, 1, 8.9, -1);
    const endVec = Vec3f.createVec3f(builder, 0, 1, 0);

    //const path = [Vec3f.createVec3f(builder, -9, 0.5, -9)];
    const path = [startVec];
    const pointsVector = NavMesh.createPointsVector(builder, path);

    NavMesh.startNavMesh(builder);

    NavMesh.addType(builder, typeStr);
    NavMesh.addStart(builder, startVec);
    NavMesh.addEnd(builder, endVec);
    NavMesh.addPoints(builder, pointsVector);
    const meshOffset = NavMesh.endNavMesh(builder);
    builder.finish(meshOffset);


    const buffer = builder.asUint8Array();

    client.send(buffer, 11000, "192.168.1.61");

}