import { useState, useEffect } from 'react';
import { db } from '../database/firebase.js'; // Ajusta la ruta según la ubicación de tu archivo firebase.js
import { collection, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'certificados'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Certificados:', data);
      setCertificados(data);
      setFilteredCertificados(data);
    });

    // Cleanup function
    return () => {
      unsubscribe();
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
                      <p className=''>No cuenta con hoja de asistencia</p>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListResumenActividades;


