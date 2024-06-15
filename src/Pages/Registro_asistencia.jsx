import { useState } from "react";
import { db } from "../database/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Document, Page, Text, StyleSheet, View, pdf} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
function Registro_asistencia() {
    const [asistente, setAsistente] = useState({
        nombreapellido: '',
        numDocumentoidentificacion: '',
        Estamento: '',
        Programaacademico: '',
        correo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsistente(prevState => ({
          ...prevState,
          [name]: value
        }));
    };


    const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: 30,
        },
        title: {
          fontSize: 24,
          textAlign: 'center',
          marginBottom: 20,
          fontWeight: 'bold',
          color: '#333333',
        },
        section: {
          margin: 10,
          padding: 10,
          flexGrow: 1,
        },
        text: {
          fontSize: 16,
          textAlign: 'center',
          margin: 5,
          color: '#555555',
        },
      });

    const location = useLocation();

    const handleRegistrarAsistencia = async (e) => {
        e.preventDefault();
        // Obtener la parte de la URL deseada
        const partes = location.pathname.split('/');
        const seleccionado = partes[2]; // Dependiendo de tu ruta específica    

        try {
            const Certificadodeasistencia = (
                <Document>
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Certificado de asistencia al evento </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.text}>Se certifica que la persona asistió al evento:</Text>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.text}>Nombres y apellidos: {asistente.nombreapellido}</Text>
                            <Text style={styles.text}>Documento de identificación: {asistente.numDocumentoidentificacion}</Text>
                            <Text style={styles.text}>Estamento al que pertenece: {asistente.Estamento}</Text>
                            <Text style={styles.text}>Programa académico al que pertenece: {asistente.Programaacademico}</Text>
                            <Text style={styles.text}>Correo electrónico: {asistente.correo}</Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.text}>Gracias por su participación en el evento.</Text>
                    </View>
                </Page>
                </Document>
            );
            const asPdf = pdf();
            asPdf.updateContainer(Certificadodeasistencia);
            const asBlob = await asPdf.toBlob();
            
            // Convert PDF to Base64
            const reader = new FileReader();
            reader.readAsDataURL(asBlob);
            reader.onloadend = async () => {
                const pdfBase64 = reader.result.split(',')[1]; // Get Base64 string

                // Save PDF locally
                saveAs(asBlob, 'registro_asistencia.pdf');

                // Send PDF in a POST request
                const res = await fetch("https://resumendeactividades2024-1.netlify.app/.netlify/functions/Formulario_asistencia", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        pdf: pdfBase64,
                        correo: asistente.correo,
                        nombredelevento: asistente.nombredelevento
                    })
                });

                if (res.ok) {
                    console.log("PDF enviado exitosamente");
                } else {
                    console.error("Error al enviar el PDF");
                }

                // Save attendee information to Firestore
                await addDoc(collection(db, "registros_asistente"), {
                    nombreapellido: asistente.nombreapellido,
                    numDocumentoidentificacion: asistente.numDocumentoidentificacion,
                    Estamento: asistente.Estamento,
                    Programaacademico: asistente.Programaacademico,
                    correo: asistente.correo,
                    nombredelevento: seleccionado
                });
                console.log('Información del certificado guardada en Firestore.');

                // Reset form
                setAsistente({
                    nombreapellido: '',
                    numDocumentoidentificacion: '',
                    Estamento: '',
                    Programaacademico: '',
                    correo: ''
                });
            };
        } catch (error) {
            console.error('Error al manejar la asistencia:', error);
        }
    
    }

  return (
    <section className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg mt-10 mb-10">
        <form className="space-y-6" onSubmit={handleRegistrarAsistencia}>
            <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                    Nombres y apellidos<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="nombreapellido"
                    value={asistente.nombreapellido}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
                <label className="block mb-2 font-medium text-gray-700">
                    Documento identificación<span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="numDocumentoidentificacion"
                    value={asistente.numDocumentoidentificacion}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
                <label className="block mb-2 font-medium text-gray-700">
                    Estamento al que pertenece<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="Estamento"
                    value={asistente.Estamento}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
                <label className="block mb-2 font-medium text-gray-700">
                    Programa academico al que pertenece<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="Programaacademico"
                    value={asistente.Programaacademico}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
                <label className="block mb-2 font-medium text-gray-700">
                    Correo electronico<span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    name="correo"
                    value={asistente.correo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg mt-4">
                    Registrar Asistencia
                </button>
            </div>
        </form>
    </section>
  )
}

export default Registro_asistencia