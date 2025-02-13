import { customHeader } from "../../global";

export let requestGet = (req, server) => {
    let url = new URL(req.url)

    if (url.pathname == "/ws") {
        if (url.searchParams.get('user') != undefined) {
            server.upgrade(req, {
                data: {
                    _logged: true,
                    user: url.searchParams.get("user"),
                    dataUser: null
                }
            })
        } else {
            let logoutJson: object = {
                status: "logout",
                redirect: "/",
            };
            let res = new Response(JSON.stringify(logoutJson), {
                status: 200,
                headers: customHeader,
            });

            return res;
        }

    }
}