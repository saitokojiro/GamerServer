export interface ISUser {

    type: string,
    id: string,
    name: string,
    PlayerInfo?: {
        playerName: string,
        class?: string
        Stat?: [
            pv: Number,
            pm: Number,
            VitAtt: Number,
            Melee: Number,
            Magic: Number,
            Distance: Number,
            Def: Number,
        ]
        inventory: [{}];


    }
    position: {
        X: number,
        Y: number,
        Z: number,
    }
}


export interface ISUserUdp {
    UserId: string,
    addr: string,
    port: number
    timeOutId?: any
    room: ISRoom;
    position: {
        X: number,
        Y: number,
        Z: number,
    }
}

export interface ISRoom {
    roomID: string,
    playerMax: number
    playerCounter: number
}

export let UserList: ISUserUdp[];