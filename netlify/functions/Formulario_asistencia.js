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

        // Validar que los parámetros necesarios están presentes y son válidos
        if (!params.correo || !params.nombredelevento || !params.pdfBase64) {
            console.log(params.correo)
            console.log(params.nombredelevento)
            console.log(params.pdfBase64)
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Faltan parámetros requeridos o son inválidos" })
            };
        }

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
            subject: `Certificado de asistencia ${params.nombredelevento}`, // asunto
            text: `Gracias por su participación en el evento. Adjunto encontrará el certificado de asistencia al evento ${params.nombredelevento}.`, // cuerpo del mensaje en texto plano
            attachments: [
                {
                    filename: 'asistencia.pdf', // nombre del archivo adjunto
                    content: params.pdfBase64, // contenido del archivo en base64
                    encoding: 'base64' // codificación del archivo
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