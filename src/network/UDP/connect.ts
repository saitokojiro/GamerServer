export let connect = async (sender: any, addr: any, port: any, data: any, list: Map<string, any>) => {
    if (data?.type() == "connect") {
        let user = {
            addr: addr,
            port: port,
            user: data?.namejoin()
        }
        console.log("Player: " + user.user + ' (' + user.addr + ":" + user.port + ")")
        list.set(data?.namejoin(), user)
    }
}