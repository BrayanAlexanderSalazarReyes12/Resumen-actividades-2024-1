exports.handler = async (event, context) => {
    switch(event.httpMethod){
        case "POST":
            const params = JSON.parse(event.body);
            console.log("RECIBI UNA SOLICITUD", params);

            return{
                statusCode: 200,
                message: "Email enviado con exito"
            };
        default:
            return{
                statusCode: 405,
                message: "Metodo no soportado"
            }
    }
}