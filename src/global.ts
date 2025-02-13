export let method: {
    GET: "GET",
    POST: "POST"
}
export let customHeader: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
}

export let CheckJson = (str: any) => {

    try {
        JSON.parse(str)
    } catch (error) {
        return false
    }
    return true;

}

