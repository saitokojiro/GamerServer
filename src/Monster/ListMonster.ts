import { randomUUIDv7 } from "bun";
import type { ISMonster, ISMonsterEntity } from "../Interface/ISMonster";
import { Orc } from "./type/Orc";
import { getTargetPosition, rndMinMax } from "../network/TCP/utils";
import type Monster from "./BaseMonster";

export let monsterList: ISMonster[] = [
    {
        zone: "D1",
        zoneConfig: {
            positionStart: { x: 0, y: 0.5, z: 5757 },
            positionEnd: { x: -10276, y: 1, z: -8915 },
            MaxRange: 10,
        },
        type: Orc,
        position: { x: -4358, y: 2, z: 732 },
        targetPosition: { x: -4358, y: 5, z: 732 },
        positionReady: false,
        isMoving: false,
        speedMove: 1.5,
        max: 10,
        modifier: (monster) => {
            monster.uuid = randomUUIDv7();
        },


    },
    {
        zone: "D2",
        zoneConfig: {
            positionStart: { x: 0, y: 2, z: 5757 },
            positionEnd: { x: 5827, y: 4, z: 800 },
            MaxRange: 100,
        },
        type: Orc,
        position: { x: 5, y: 2, z: 4 },
        targetPosition: { x: 5, y: 5, z: 4 },
        positionReady: false,
        isMoving: false,
        speedMove: 3,
        max: 10,
        modifier: (monster) => {
            monster.uuid = randomUUIDv7();
        },


    }
    /*zoneConfig: {
            positionStart: { x: 0, y: 0.5, z: 5757 },
            positionEnd: { x: -10276, y: 1, z: -8915 },
            MaxRange: 1,
        },
        type: Orc,
        position: { x: -4358, y: 0.5, z: 732 },
        targetPosition: { x: -4358, y: 1, z: 732 }, */
    /* {
         zone: "D2",
         zoneConfig: {
             positionStart: { x: 0, y: 0.5, z: 732 },
             positionEnd: { x: 5827, y: 1.5, z: 5757 },
             MaxRange: 10
         },
         type: Orc,
         position: { x: 215, y: 215, z: 215 },
         targetPosition: { x: 210, y: 210, z: 210 },
         positionReady: false,
         speedMove: 1,
         max: 10,
         modifier: (monster) => {
             monster.uuid = randomUUIDv7();
         },
         
 
     }*/
]

export function monsterSpawn(spawnPoint: ISMonster): ISMonsterEntity {

    const monster = new spawnPoint.type()
    if (spawnPoint?.zoneConfig) {
        /*spawnPoint.position = {
            x: rndMinMax(spawnPoint.zoneConfig.positionStart.x, spawnPoint.zoneConfig.positionEnd.x + (spawnPoint.zoneConfig.MaxRange - 5)),
            y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y + (spawnPoint.zoneConfig.MaxRange - 5)),
            z: rndMinMax(spawnPoint.zoneConfig.positionStart.z, spawnPoint.zoneConfig.positionEnd.z + (spawnPoint.zoneConfig.MaxRange - 5))
        };
        spawnPoint.targetPosition = {
            x: rndMinMax(spawnPoint.zoneConfig.positionStart.x, spawnPoint.zoneConfig.positionEnd.x + (spawnPoint.zoneConfig.MaxRange - 5)),
            y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y + (spawnPoint.zoneConfig.MaxRange - 5)),
            z: rndMinMax(spawnPoint.zoneConfig.positionStart.z, spawnPoint.zoneConfig.positionEnd.z + (spawnPoint.zoneConfig.MaxRange - 5))
        }*/

        /**
         * Rework
         */

        /*spawnPoint.position = {
            x: rndMinMax(spawnPoint.zoneConfig.positionStart.x - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig?.positionEnd.x + (spawnPoint.zoneConfig.MaxRange + 5)),
            y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            //y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            z: rndMinMax(spawnPoint.zoneConfig.positionStart.z - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig.positionEnd.z + (spawnPoint.zoneConfig.MaxRange + 5))
        };*/
        spawnPoint.position = {
            x: rndMinMax(spawnPoint.zoneConfig.positionStart.x, spawnPoint.zoneConfig.positionEnd.x),
            y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            z: rndMinMax(spawnPoint.zoneConfig.positionStart.z, spawnPoint.zoneConfig.positionEnd.z),
        };

        /*spawnPoint.targetPosition = {
            x: rndMinMax(spawnPoint.zoneConfig.positionStart.x - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig?.positionEnd.x + (spawnPoint.zoneConfig.MaxRange + 5)),
            y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            //y: rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            z: rndMinMax(spawnPoint.zoneConfig.positionStart.z - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig.positionEnd.z + (spawnPoint.zoneConfig.MaxRange + 5))
        }*/
        /*let vecStart = new vec3D(
            rndMinMax(spawnPoint.zoneConfig.positionStart.x - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig?.positionEnd.x + (spawnPoint.zoneConfig.MaxRange + 5)),
            rndMinMax(spawnPoint.zoneConfig.positionStart.y, spawnPoint.zoneConfig.positionEnd.y),
            rndMinMax(spawnPoint.zoneConfig.positionStart.z - (spawnPoint.zoneConfig.MaxRange - 5), spawnPoint.zoneConfig.positionEnd.z + (spawnPoint.zoneConfig.MaxRange + 5))
        )*/
    }
    if (spawnPoint?.modifier) spawnPoint.modifier(monster)
    //console.log("ListMonster : ligne 37 : value :" + monster.uuid)
    //console.log(spawnPoint.position)

    return {
        zone: spawnPoint.zone,
        type: monster,
        //position: {...spawnPoint.position},
        //targetPosition: {...spawnPoint.targetPosition} ,
        //position: spawnPoint.position,
        zoneConfig: spawnPoint.zoneConfig,
        path: [],
        pathStep: 0,
        pathCount: 0,
        position: { ...spawnPoint.position },
        targetPosition: getTargetPosition(spawnPoint.position, spawnPoint.zoneConfig, spawnPoint.zoneConfig?.MaxRange) ,
        isTarget: false,
        isMoving: spawnPoint.isMoving,
        positionReady: spawnPoint.positionReady,
        speedMove: spawnPoint.speedMove,
        velocityVector: { x: 0, y: 0, z: 0 },
        velocityValue: 0,
        distanceRemaining: 0
    }
}

