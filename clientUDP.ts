import * as flatbuffers from 'flatbuffers';
import { NavMesh, Vec3f } from "./schemaServer/nav-mesh/sample"
import { Vec3 } from './schemaServer/player-position/sample';
import EventEmitter from 'node:events';


/*
let client = await Bun.udpSocket({
    connect: {
        port: 11000,
        hostname: "192.168.1.61"
    }
})*/

 /*let dataTest =    
{
  x: -6430.711381520592,
  y: 1,
  z: -4371.305749388959,
}*/
let dataTest =    
{
  x: -203.07545471191406,
  y: 200.15000915527344,
  z: -979.5505981445312
}
let diviser = 1000 /5
let capsule = 140
let capsuleServer= 0.15
console.log("data check = "+ dataTest.x/diviser);
console.log("data check = "+ dataTest.y/diviser *(capsuleServer/(capsule/diviser)));
console.log("data check = "+ dataTest.z/diviser);
const builder = new flatbuffers.Builder(1024);
const typeStr = builder.createString("spawn");
console.log((capsule/diviser)*(capsuleServer/(capsule/diviser)))

//(capsule/diviser)*(capsuleServer/(capsule/diviser))
const startVec = Vec3f.createVec3f(builder, dataTest.x/diviser, dataTest.y/diviser, dataTest.z/diviser);
const endVec = Vec3f.createVec3f(builder, 0, 0, 0);

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



/*
Bun.udpSocket({
    hostname: "192.168.1.61",
    port: 3302,
    socket: {
        async data(socket, buf, port, addr) {
            console.log(`message from ${addr}:${port}:`);
            console.log(buf.toString());
            socket.send(buffer, port, addr)
        },
        drain(socket) {
            console.log("drain")
        },
        error(socket, error) {
            console.log("close")
        },
    }
})



*/
    let event = new EventEmitter();
    const server = await Bun.udpSocket({
        hostname: "192.168.1.61",
        //port: 3302,
        socket: {
            data(socket, buf, port, addr) {
                console.log(`message from ${addr}:${port}:`);
                let buff = new flatbuffers.ByteBuffer(new Uint8Array(buf))
                let po = NavMesh.getRootAsNavMesh(buff)
                console.log(po.pointsLength());
                //data = po.pointsLength()
                event.emit("newdata", buff);
            },
        },
    });

    event.on("newdata",(data)=>{
        let po = NavMesh.getRootAsNavMesh(data)
        console.log("data check X = "+ po.start()?.x()*2);
        console.log("data check Y = "+ po.start()?.y()*2);
        console.log("data check Z = "+ po.start()?.z()*2);
    })
    //console.log("data chack :" + data)
    server.send(buffer, 11000, "192.168.1.61");

/*
setInterval(() => {


    for (let i = 0; i < 30000; i++) {
        try {




            // Vérification locale avant envoi :
            //const bb = new flatbuffers.ByteBuffer(buffer);
            //const parsed = NavMesh.getRootAsNavMesh(bb);
            //console.log("→ start:", parsed.start()?.x(), parsed.start()?.y(), parsed.start()?.z());
            //console.log("→ end:", parsed.end()?.x(), parsed.end()?.y(), parsed.end()?.z());
            //console.log("Buffer size:", buffer.length);

            server.send(buffer, 11000, "192.168.1.61");
            //console.log(buffer)
            console.log("send")
        } catch (error) {
            console.log("log")
        }
    }




}, 1)*/