exports.handler = async (event, context) => {
    switch(event.httpMethod){
        case "POST":
            const params = JSON.parse(event.body);
            console.log("RECIBI UNA SOLICITUD", params);
            return;
        default:
            return{
                statusCode: 405,
                message: "Metodo no soportado"
            }
    }
}