import { useState } from "react";
import { db } from "../database/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useLocation } from "react-router-dom";

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

    const location = useLocation();

    const handleRegistrarAsistencia = async (e) => {
        e.preventDefault();
        // Obtener la parte de la URL deseada
        const partes = location.pathname.split('/');
        const seleccionado = partes[2]; // Dependiendo de tu ruta específica    

       try {
            await addDoc(collection(db,"registros_asistente"),{
                nombreapellido: asistente.nombreapellido,
                numDocumentoidentificacion: asistente.numDocumentoidentificacion,
                Estamento:asistente.Estamento,
                Programaacademico:asistente.Programaacademico,
                correo:asistente.correo,
                nombredelevento:seleccionado
            });
            console.log('Información del certificado guardada en Firestore.');

            setAsistente({
                nombreapellido: '',
                numDocumentoidentificacion: '',
                Estamento: '',
                Programaacademico: '',
                correo: '',
            })
       } catch (error) {
        console.error('Error al subir el PDF a Firebase Storage:', error);
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