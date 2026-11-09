import * as flatbuffers from 'flatbuffers';
import { NavMesh, Vec3f } from '../../../../schemaServer/nav-mesh/sample';
import { multiplicateur, type ISDataUdp } from '../utils';

export let Spawn = async (Data:ISDataUdp, client) =>{


    //let positionP = message.position
    
        //console.log(positionP.x()/100)
        //console.log(((positionP.z()-140)+5)/10)
        //let zp = ((positionP.z()-140.01)+5)/10;
        //zp.toFixed(2)
        //console.log("X: " + positionP.x() / 100 + " Z: " + positionP.z() / 100 + " Y: " + positionP.y() / 100)
        //console.log(positionP.z()/100)
        
        
        const builder = new flatbuffers.Builder(1024);
        const typeStr = builder.createString(Data.type);
        const zone = builder.createString(Data.zone)
        const Uuid = builder.createString(Data.uuid)
        //console.log("data Y: "+  Data.start.y)
    
        const startVec = Vec3f.createVec3f(builder, Data.start.x /multiplicateur, Data.start.y, Data.start.z /multiplicateur);
        //const startVec = Vec3f.createVec3f(builder, 1, 8.9, -1);
        const endVec = Vec3f.createVec3f(builder, Data.end.x /multiplicateur, Data.end.y, Data.end.z /multiplicateur);
        //console.log(Data.start.y )
        //console.log(Data.end.y )
    
        //const path = [Vec3f.createVec3f(builder, -9, 0.5, -9)];
        const path = [startVec];
        const pointsVector = NavMesh.createPointsVector(builder, path);
    
        NavMesh.startNavMesh(builder);
    
        NavMesh.addType(builder, typeStr);
        NavMesh.addZone(builder, zone)
        NavMesh.addUuid(builder, Uuid)
        NavMesh.addStart(builder, startVec);
        NavMesh.addEnd(builder, endVec);
        NavMesh.addPoints(builder, pointsVector);
        const meshOffset = NavMesh.endNavMesh(builder); 
        builder.finish(meshOffset);
    
    
        const buffer = builder.asUint8Array();
        try {
            
            client.send(buffer, 11000, "192.168.1.61");
        } catch (error) {
            console.log( "faill to send server")
            
        }
    


}