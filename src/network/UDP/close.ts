export let close = (socket: any, message: any, USocket: Map<string, any>) => {
    if (message?.type() == 'close') {
        let name = message.namejoin()
        console.log("Player " + name + " is Disconnected")
        USocket.delete(name)
        USocket.forEach((value, key) => console.log("Player connected : " + value.user))
    }
}