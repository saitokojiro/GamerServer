export let Annonce = (ws, message, USocket) => {

    if (message.type == "annonce") {
        if (message?.role == "admin") {

            console.log("ok")
            ws.publish("global", message.msg)
        }
    }

}