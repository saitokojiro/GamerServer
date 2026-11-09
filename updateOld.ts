
let Update = (deltaTime:number) => {

    /*const now = Date.now();
    const deltaTime = (now - lsnd) / 1000;
    lsnd = now*/

  /*  USocket.forEach((socket, id) => {
        console.log("==========Event Tick===============")
        if (socket.data.lastMessage !== null) {
            //console.log(socket.data.lastMessage.position.x().toFixed(1))
            //console.error(socket.data.lastMessage.position.y())
            console.log(tap)

            if (Range(socket.data.lastMessage.position.x(), -132.3, 10)) {
                // CreatePath()

                console.error("True")
                console.error("Truedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd")
            } else {

                console.error("false")
            }
        }

        console.log("==========END Event Tick===========")
    })
    */
    console.error("spawn error" + errSpawn)

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
                }
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
                const builder = new flatbuffers.Builder(1024);
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
                console.log(spawn.type.uuid)



                // }
            }
        })
    })
    
    monster.forEach(m => {

        // console.log(Range3D(m.position, m.targetPosition, 1))
        // console.log(m.positionReady)
        //if (m.targetPosition == m.position ) {
        if (Range3D(m.position, m.targetPosition, 10) && m.positionReady == true) {

            const spawn = monsterList.find(s => s.zone === m.zone)

            if (spawn) {
                //console.log("ok")
                console.log("ok")

                let targetPosition = {
                    x: rndMinMax(spawn.zoneConfig.positionStart.x - (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig?.positionEnd.x + (spawn.zoneConfig.MaxRange + 5)),
                    y: rndMinMax(spawn.zoneConfig.positionStart.y, spawn.zoneConfig.positionEnd.y),
                    z: rndMinMax(spawn.zoneConfig.positionStart.z - (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.z + (spawn.zoneConfig.MaxRange + 5))
                }
                /*let vecStart = new vec3D(
                    rndMinMax(m.zoneConfig.positionStart.x + (m.zoneConfig.MaxRange - 5), m.zoneConfig?.positionEnd.x + (m.zoneConfig.MaxRange - 5)),
                    rndMinMax(m.zoneConfig.positionStart.y + (m.zoneConfig.MaxRange - 5), m.zoneConfig.positionEnd.y + (m.zoneConfig.MaxRange - 5)),
                    rndMinMax(m.zoneConfig.positionStart.z + (m.zoneConfig.MaxRange - 5), m.zoneConfig.positionEnd.z + (m.zoneConfig.MaxRange - 5))
                )*/
                    let vecStart = new vec3D(
                    rndMinMax(spawn.zoneConfig.positionStart.x + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig?.positionEnd.x + (spawn.zoneConfig.MaxRange - 5)),
                    rndMinMax(spawn.zoneConfig.positionStart.y + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.y + (spawn.zoneConfig.MaxRange - 5)),
                    rndMinMax(spawn.zoneConfig.positionStart.z + (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.z + (spawn.zoneConfig.MaxRange - 5))
                )
                // m.targetPosition = targetPosition
                /*let vecStart = new vec3D(
                    rndMinMax(spawn.zoneConfig.positionStart.x - (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig?.positionEnd.x + (spawn.zoneConfig.MaxRange + 5)),
                    140,
                    rndMinMax(spawn.zoneConfig.positionStart.z - (spawn.zoneConfig.MaxRange - 5), spawn.zoneConfig.positionEnd.z + (spawn.zoneConfig.MaxRange + 5))
                )*/
                let vecEnd = new vec3D(0, 0, 0)
                let vecStartCorrect = new vec3D(vecStart.x, 0.5, vecStart.z)
                let Target: ISDataUdp = {
                    type: "moveNPC",
                    zone: m.zone,
                    uuid: m.type.uuid,
                    start: vecStartCorrect,
                    end: vecEnd
                }
                /*console.log("position ====")
                console.log(m.position)
                console.log("target ====")
                console.log(m.targetPosition)
                console.log("VecStart ====")
                console.log(vecStart)*/
                //console.log(vecStart)
                //m.positionReady = false
                Spawn(Target, client)
                //console.log(vecStart)
                //console.log(spawn.type.uuid)*/
            }
        }
        if (m.positionReady == false) {

            //moveToward(m, deltaTime * 100)
            USocket.forEach((Socket, id) => {
                const builder = new flatbuffers.Builder(1024);
                const typeStr = builder.createString("MoveNPC")
                const zone = builder.createString(m.zone)
                const playerID = builder.createString("Nan")
                const uuid = builder.createString(m.type.uuid)

                const pos = Vec3f.createVec3f(builder, m.position.x, 140, m.position.z)
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
                
            })
            if (Range3D(m.position, m.targetPosition, 10)) {
                //console.log("teest")
                console.log("test")
                m.positionReady = true
            }
        }
    })





    //CreatePath()
    //console.error("----************------------------*******************-----------")
    //Spawn(null, null, null, client)

    /*monster.forEach(m => {
        moveTowards(m, deltaTime);

        // Si arrivé, on redonne une destination
        if (!m.target) {
            const spawn = monsterList.find(s => s.zone === m.zone);
            if (spawn) {
                m.target = getRandomPointInZone(spawn.zoneConfig);
            }
        }
    });*/





    //setTimeout(tick, TICK_MS);
}