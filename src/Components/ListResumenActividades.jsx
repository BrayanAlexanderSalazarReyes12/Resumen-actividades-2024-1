import { useState, useEffect } from 'react';
import { db } from '../database/firebase.js'; // Ajusta la ruta según la ubicación de tu archivo firebase.js
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Document, Page, Text, StyleSheet, View, pdf} from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const ListResumenActividades = ({ SetLogin, login }) => {
  const [certificados, setCertificados] = useState([]);
  const [filteredCertificados, setFilteredCertificados] = useState([]);
  const [searchParams, setSearchParams] = useState({
    nombreacti: '',
    fecha: '',
    codigoActividad: '',
    tipoActividad: '',
    fechaInicio: '',
    fechaFinal: '',
    tieneCosto: '',
    duracionHoras: ''
  });
  const [asistencia, setAsistencia] = useState([])
  const [nombreactividad, SetNombreactividad] = useState([]) 
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'certificados'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Certificados:', data);
      setCertificados(data);
      setFilteredCertificados(data);
    });

    const asistencia = onSnapshot(collection(db, 'registros_asistente'), (snapshot) => {
      const datacer = snapshot.docs.map(doc => ({...doc.data()}))
      console.log('asistencia',datacer)
      setAsistencia(datacer)
    })

    // Cleanup function
    return () => {
      unsubscribe();
      asistencia();
    };
  }, []);

  const handleLogout = async () => {
    try {
      //await signOut(auth);
      // Redireccionar a la página de inicio de sesión u otra página deseada
      SetLogin(false)
      localStorage.setItem("Login",false);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const navigate = useNavigate();

  const handleRegistrarEvento = () => {
    localStorage.setItem("Login",login);
    navigate('/');
  }

  const handleDownload = (url) => {
    // Lógica para descargar el archivo con la URL proporcionada
    window.open(url, '_blank');
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };

  const filterCertificados = () => {
    setFilteredCertificados(certificados.filter(certificado => {
      return Object.keys(searchParams).every(param => {
        if (!searchParams[param]) return true;
        return String(certificado[param]).toLowerCase().includes(searchParams[param].toLowerCase());
      });
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

  const nombres = filteredCertificados.map(certificado => certificado.nombreacti);

  const pdfasis = async (nombreevento) => {
    try {
      // Filtrar la asistencia por el nombre del evento
      const asistenciaFiltrada = asistencia.filter(asistencia => asistencia.nombredelevento === nombreevento);
      const Crearasistencia = (
        <Document>
          <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Certificado de Realización de Formulario Resumen Actividades 2024-1</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Se certifica que el siguiente formulario ha sido completado con éxito:</Text>
            </View>
            <View style={styles.section}>
                {/* Renderizar cada asistente */}
                {asistenciaFiltrada.map((asistencia, index) => (
                  <View key={index} style={styles.section}>
                    <Text style={styles.text}>Asistente {index + 1}:</Text>
                    <Text style={styles.text}>Nombres y apellidos: {asistencia.nombreapellido}</Text>
                    <Text style={styles.text}>Documento de identificación: {asistencia.numDocumentoidentificacion}</Text>
                    <Text style={styles.text}>Estamento al que pertenece: {asistencia.Estamento}</Text>
                    <Text style={styles.text}>Programa academico al que pertenece: {asistencia.Programaacademico}</Text>
                    <Text style={styles.text}>Correo electronico: {asistencia.correo}</Text>
                  </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Gracias por su participación.</Text>
            </View>
          </Page>
        </Document>
      );
      const asPdf = pdf();
      asPdf.updateContainer(Crearasistencia);
      const asblob = await asPdf.toBlob();
      saveAs(asblob, 'registro_asistencia.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const enviarcorreo = async (nombreevento) => {
    try {
      const asistenciaFiltrada = asistencia.filter(asistencia => asistencia.nombredelevento === nombreevento);
      
      for (let i=0; i<asistenciaFiltrada.length; i++){
        const asistencia = asistenciaFiltrada[i];
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
                        <Text style={styles.text}>Nombres y apellidos: {asistencia.nombreapellido}</Text>
                        <Text style={styles.text}>Documento de identificación: {asistencia.numDocumentoidentificacion}</Text>
                        <Text style={styles.text}>Estamento al que pertenece: {asistencia.Estamento}</Text>
                        <Text style={styles.text}>Programa académico al que pertenece: {asistencia.Programaacademico}</Text>
                        <Text style={styles.text}>Correo electrónico: {asistencia.correo}</Text>
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
            //saveAs(asBlob, 'registro_asistencia.pdf');

            // Send PDF in a POST request
            const res = await fetch("https://resumendeactividades2024-1.netlify.app/.netlify/functions/Enviar_asistencia_evento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo: asistencia.correo,
                    nombredelevento: asistencia.seleccionado,
                    pdf: pdfBase64
                })
            });

            if (res.ok) {
                console.log("PDF enviado exitosamente");
            } else {
                console.error("Error al enviar el PDF");
            }
        };
      }
    } catch (error) {
      console.error('Error al manejar la asistencia:', error);
    }
  }

  useEffect(() => {
    filterCertificados();
  }, [searchParams, certificados]);

  if (certificados.length === 0) {
    return (
      <div className="container mx-auto text-center mt-8">
        <h1 className="text-2xl font-bold mb-4">Lista de Resumen de Certificados</h1>
        <p>No hay certificados disponibles.</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cerrar sesión
        </button>
        <button
          onClick={handleRegistrarEvento}
          className="ml-8 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Registrar nuevo evento
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Lista de Resumen de Certificados</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cerrar sesión
        </button>
        <button
          onClick={handleRegistrarEvento}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Registrar nuevo evento
        </button>
      </div>
      <div className="overflow-x-auto mb-4">
        <div className="mb-4">
          <input
            type="text"
            name="nombreacti"
            placeholder="Nombre Actividad"
            value={searchParams.nombreacti}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="fecha"
            placeholder="Fecha Diligenciamiento"
            value={searchParams.fecha}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="codigoActividad"
            placeholder="Código Actividad"
            value={searchParams.codigoActividad}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="tipoActividad"
            placeholder="Tipo Actividad"
            value={searchParams.tipoActividad}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="fechaInicio"
            placeholder="Fecha Inicio"
            value={searchParams.fechaInicio}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="fechaFinal"
            placeholder="Fecha Final"
            value={searchParams.fechaFinal}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="tieneCosto"
            placeholder="Tipo Costo"
            value={searchParams.tieneCosto}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
          <input
            type="text"
            name="duracionHoras"
            placeholder="Duración Evento En Horas"
            value={searchParams.duracionHoras}
            onChange={handleSearchChange}
            className="p-2 m-2 border rounded"
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nombre Actividad</th>
              <th className="px-4 py-2">Fecha Diligenciamiento</th>
              <th className="px-4 py-2">Codigo Actividad</th>
              <th className='px-4 py-2'>Tipo Actividad</th>
              <th className="px-4 py-2">Fecha Inicio</th>
              <th className="px-4 py-2">Fecha Final</th>
              <th className="px-4 py-2">Salon o Bloque</th>
              <th className='px-4 py-2'>Tipo Costo</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Duracion Evento En Horas</th>
              <th className="px-4 py-2">Requerimiento</th>
              <th className='px-4 py-2'>Para El Evento Nesesita</th>
              <th className="px-4 py-2">Espacio Fisico</th>
              <th className="px-4 py-2">Apoyo Comunicacion</th>
              <th className='px-4 py-2'>QR</th>
              <th className="px-4 py-2">Asistencia</th>
              <th className='px-4 py-2'>Certificado</th>
              <th className='px-4 py-2'>Enviar Correos</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificados.map(certificado => (
              <tr key={certificado.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{certificado.nombreacti}</td>
                <td className="px-4 py-2">{certificado.fecha}</td>
                <td className="px-4 py-2">{certificado.codigoActividad}</td>
                <td className="px-4 py-2">{certificado.tipoActividad}</td>
                <td className="px-4 py-2">{certificado.fechaInicio}</td>
                <td className="px-4 py-2">{certificado.fechaFinal}</td>
                <td className="px-4 py-2">{certificado.salonPosgrado}</td>
                <td className="px-4 py-2">{certificado.tieneCosto}</td>
                <td className="px-4 py-2">{certificado.monto}</td>
                <td className="px-4 py-2">{certificado.duracionHoras}</td>
                <td className="px-4 py-2">{certificado.espacioFisico}</td>
                <td className="px-4 py-2">{certificado.nesesidades}</td>
                <td className="px-4 py-2">{certificado.espacio}</td>
                <td className="px-4 py-2">{certificado.apoyoComunicacion}</td>
                <td className="px-4 py-2">
                  {certificado.qr != undefined ? 
                    (
                      <button
                          onClick={() => handleDownload(certificado.qr)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                          Descargar
                      </button>
                    ):
                    (
                      <p className=''>No cuenta con QR</p>
                    )
                  }
                </td>
                <td className="px-4 py-2">
                  {certificado.asistemciapdf != undefined ? 
                    (
                      <button
                          onClick={() => handleDownload(certificado.asistemciapdf)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                          Descargar
                      </button>
                    ):
                    (
                      <button
                          onClick={() => pdfasis(certificado.nombreacti)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                          Descargar asistencia
                      </button>
                    )
                  }
                </td>
                <td className="px-4 py-2">
                    <button
                        onClick={() => handleDownload(certificado.certificado)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Descargar
                    </button>
                </td>
                <td className="px-4 py-2">
                    <button
                        onClick={() => enviarcorreo(certificado.nombreacti)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Destinatarios
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListResumenActividades;


