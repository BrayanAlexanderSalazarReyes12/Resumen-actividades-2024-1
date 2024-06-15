const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Método no soportado" })
            };
        }

        const params = JSON.parse(event.body);
        console.log("RECIBI UNA SOLICITUD", params);

        // Configurar el transporte de Nodemailer para Gmail
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // usa SSL
            auth: {
                user: "bsalazarreyes88@gmail.com", // dirección de Gmail
                pass: "jkgo qxst dqen zsox" // contraseña de aplicación generada en Google
            }
        });

        // Opciones del correo electrónico
        let mailOptions = {
            from: `"Sender Name" <bsalazarr@unicartagena.edu.co>`,
            to: params.correo,
            subject: `Certificado de asistencia ${params.nombredelevento}`,
            text: `Gracias por su participación en el evento. Adjunto encontrará el certificado de asistencia al evento ${params.nombredelevento}.`,
            attachments: [
                {
                    filename: 'asistencia.pdf',
                    content: params.pdf,
                    encoding: 'base64'
                }
            ]
        };

        // Enviar el correo electrónico
        let info = await transporter.sendMail(mailOptions);
        console.log("Email enviado: %s", info.messageId);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email enviado con éxito" })
        };
    } catch (error) {
        console.error("Error en la función Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor al enviar el email", error: error.message })
        };
    }
};
