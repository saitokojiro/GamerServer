import type { ISUser } from "../../Interface/ISGlobal"

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



export let Position = (ws: any, message: any, USocket: any[]) => {
    if (message.type == "position") {
        console.log("pass")
        let data = <ISUser>{
            type: message.type,
            id: message.id,
            name: message.name,
            /* PlayerInfo: {
                 playerName: message.PlayerInfo?.playerName
             },*/
            position: {
                X: message.position.X,
                Y: message.position.Y,
                Z: message.position.Z
            }
        }

        console.log(message?.position)
        USocket.forEach(el => {
            if (el.data.dataUser.id != message.id) {
                el.send(JSON.stringify(data))
            }
        });
        //ws.send(JSON.stringify(data))
        //ws.publish("global", JSON.stringify(data))
    }


}