const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    switch (event.httpMethod) {
        case "POST":
            const params = JSON.parse(event.body);
            console.log("RECIBI UNA SOLICITUD", params);

            // Configurar el transporte de Nodemailer para Gmail
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "bsalazarr@unicartagena.edu.co", // dirección de Gmail desde variables de entorno
                    pass: "1234567890" // contraseña de Gmail o contraseña específica de la aplicación desde variables de entorno
                }
            });

            // Opciones del correo electrónico
            let mailOptions = {
                from: `"Sender Name" <bsalazarr@unicartagena.edu.co>`, // dirección del remitente
                to: params.correo, // lista de destinatarios
                subject: `certificado de asistencia ${params.nombredelevento}`, // asunto
                text: `Gracias por su participación en el evento este es el certificado de asistencia al evento ${params.nombredelevento}`, // cuerpo del mensaje en texto plano
                attachments: [
                    {
                        filename: 'asistencia.pdf', // nombre del archivo adjunto
                        content: params.pdfBase64, // contenido del archivo en base64
                        encoding: 'base64' // codificación del archivo
                    }
                ]
            };

            try {
                // Enviar el correo electrónico
                let info = await transporter.sendMail(mailOptions);
                console.log("Email sent: %s", info.messageId);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Email enviado con exito" })
                };
            } catch (error) {
                console.error("Error sending email: ", error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "Error al enviar el email", error: error.message })
                };
            }

        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Metodo no soportado" })
            };
    }
};
