import { useState } from "react"
import { Document, Page, Text, StyleSheet, View, pdf } from '@react-pdf/renderer';
import { db, storage} from "../../database/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Forms() {
    const [step, SetStep] = useState(1)
    const [form, SetForm] = useState({
        fechaDiligenciamiento: '',
        periodoAcademico: '',
        nombreActividad: '',
        codigoActividad: '',
        tipoActividad: '',
        fechaInicio: '',
        fechaFinal: '',
        unidadResponsable: '',
        salonPosgrado: '',
        tieneCosto: 'no',
        monto: '',
        duracionHoras: '',
        espacioFisico: '',
        nesesidades: [],
        espacio: '',
        apoyoComunicacion: '',
        ponentes: [{ ponente: '', documento: '', numDocumento: '', Nombres: '', PrimerApellido: '', SegundoApellido: '', Niveldeformacion: '', Vinculacion: '' }],
        asistemciapdf: null,
        asistente: [{nombreapellido: '',numDocumentoidentificacion: '',Estamento: '',Programaacademico: '',email: ''}],
        correo: '',
        Programaacademico: '',
        Estamento: '',
        numDocumentoidentificacion: '',
        nombreapellido: '',
        Vinculacion: ''
    })

    const [pdfupload, SetPdfupload] = useState(false)

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
    
    const fechaActual = new Date().toLocaleDateString();

    const Certificate = () => (
        <Document>
            <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Certificado de Realización de Formulario Resumen Actividades 2024-1</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Se certifica que el siguiente formulario ha sido completado con éxito:</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Fecha de diligenciamiento: {form.fechaDiligenciamiento}</Text>
                <Text style={styles.text}>Fecha de impresión: {fechaActual}</Text>
                <Text style={styles.text}>Periodo academico: {form.periodoAcademico}</Text>
                <Text style={styles.text}>Nombre de la actividad: {form.nombreActividad}</Text>
                <Text style={styles.text}>Codigo de la actividad: {form.codigoActividad}</Text>
                <Text style={styles.text}>Tipo actividad: {form.tipoActividad}</Text>
                <Text style={styles.text}>Nombre de la actividad: {form.nombreActividad}</Text>
                <Text style={styles.text}>Fecha inicio: {form.fechaInicio}</Text>
                <Text style={styles.text}>Fecha final: {form.fechaFinal}</Text>
                <Text style={styles.text}>Salon posgrado: {form.salonPosgrado}</Text>
                <Text style={styles.text}>Tiene costo: {form.tieneCosto}</Text>
                <Text style={styles.text}>Monto: {form.monto}</Text>
                <Text style={styles.text}>Duracion horas: {form.duracionHoras}</Text>
                <Text style={styles.text}>Requerimiento: {form.espacioFisico}</Text>
                <Text style={styles.text}>Nesesita: {form.nesesidades}</Text>
                <Text style={styles.text}>Espacio fisico: {form.espacio}</Text>
                <Text style={styles.text}>Requerimiento apoyo comunicacion: {form.apoyoComunicacion}</Text>
                {/* Renderizar cada ponente */}
                {form.ponentes.map((ponente, index) => (
                  <View key={index} style={styles.section}>
                    <Text style={styles.text}>Ponente {index + 1}:</Text>
                    <Text style={styles.text}>Descripción: {ponente.ponente}</Text>
                    <Text style={styles.text}>Tipo de documento: {ponente.documento}</Text>
                    <Text style={styles.text}>Número de documento: {ponente.numDocumento}</Text>
                    <Text style={styles.text}>Nombres: {ponente.Nombres}</Text>
                    <Text style={styles.text}>Primer apellido: {ponente.PrimerApellido}</Text>
                    <Text style={styles.text}>Segundo apellido: {ponente.SegundoApellido}</Text>
                    <Text style={styles.text}>Nivel de formación: {ponente.Niveldeformacion}</Text>
                    <Text style={styles.text}>Tipo de vinculación: {ponente.Vinculacion}</Text>
                  </View>
                ))}
                {/* Renderizar cada asistente */}
                {form.asistente.map((asistente, index_asis) => (
                  <View key={index_asis} style={styles.section}>
                    <Text style={styles.text}>Asistente {index_asis + 1}:</Text>
                    <Text style={styles.text}>Nombres y apellidos: {asistente.nombreapellido}</Text>
                    <Text style={styles.text}>Documento de identificación: {asistente.numDocumentoidentificacion}</Text>
                    <Text style={styles.text}>Estamento al que pertenece: {asistente.Estamento}</Text>
                    <Text style={styles.text}>Programa academico al que pertenece: {asistente.Programaacademico}</Text>
                    <Text style={styles.text}>Correo electronico: {asistente.correo}</Text>
                  </View>
                ))}
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>Gracias por su participación.</Text>
            </View>
            </Page>
        </Document>
    )
    
    const handleChange = (e, index = null, index_asis = null) => {
      const {name, value} = e.target;
      if(index !== null){
        const newPonentes = [...form.ponentes];
        newPonentes[index][name] = value;
        SetForm({...form, ponentes: newPonentes})
      }else if(index_asis !== null){
        const newAsistente = [...form.asistente];
        newAsistente[index_asis][name] = value;
        SetForm({...form, asistente: newAsistente})
      }else{
        SetForm({
          ...form,
          [name]: value
        });
      }
    }
    
    const handlenext = (e) => {
        e.preventDefault();
        SetStep(step + 1)
    }
    
    const resetform = () => {
      SetForm({
        fechaDiligenciamiento: '',
        periodoAcademico: '',
        nombreActividad: '',
        codigoActividad: '',
        tipoActividad: '',
        fechaInicio: '',
        fechaFinal: '',
        unidadResponsable: '',
        salonPosgrado: '',
        tieneCosto: 'no',
        monto: '',
        duracionHoras: '',
        espacioFisico: '',
        nesesidades: [],
        espacio: '',
        apoyoComunicacion: '',
        ponentes: '',
        documento: '',
        numDocumento: '',
        Nombres: '',
        PrimerApellido: '',
        SegundoApellido: '',
        Niveldeformacion: '',
        asistemciapdf: null,
        correo: '',
        Programaacademico: '',
        Estamento: '',
        numDocumentoidentificacion: '',
        nombreapellido: '',
        Vinculacion: ''
      })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const blob = await pdf(<Certificate/>).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificado.pdf';
        a.click();
        URL.revokeObjectURL(url);
        
        // Subir PDF a Firebase Storage
        const fileName = 'certificado.pdf';
        
        //vairables para descombertir los array
        let text_espaciofisico
        let text_nesesidades
        let text_apoyocomunicacion

        try {
            // Obtener el nombre del usuario (supongamos que está en el estado `form.nombreActividad`)
            const nombreUsuario = form.nombreActividad + form.codigoActividad; // Reemplaza esto con tu lógica para obtener el nombre del usuario
    
            // Crear una referencia a la carpeta del usuario
            const userFolderRef = ref(storage, nombreUsuario);
    
            // Crear una referencia para el archivo PDF
            const pdfRef = ref(userFolderRef, fileName);
    
            // Subir el PDF a la carpeta del usuario
            const snapshot = await uploadBytes(pdfRef, blob);
            console.log('PDF subido correctamente a Firebase Storage.', snapshot);

            // Obtener la URL del archivo subido
            const downloadURL = await getDownloadURL(pdfRef);
            
            // Subir el archivo adicional si existe
            if (pdfupload !== false) {
                console.log(2)
                const additionalFileRef = ref(userFolderRef, form.asistemciapdf.name);
                const additionalSnapshot = await uploadBytes(additionalFileRef, form.asistemciapdf);
                console.log('Archivo adicional subido correctamente a Firebase Storage.', additionalSnapshot);

                // Obtener la URL del archivo adicional subido
                const additionalDownloadURL = await getDownloadURL(additionalFileRef);

                //descompone el array de nesesidades y espacio fisico para guardarlo en firebase
                text_nesesidades = form.nesesidades.join(',');
                text_espaciofisico = form.espacio.join(',');
                text_apoyocomunicacion = form.apoyoComunicacion.join(',');
                // Crear documento en Firestore para el archivo adicional
                await addDoc(collection(db, 'certificados'), {
                    id:form.codigoActividad,
                    nombre: nombreUsuario,
                    fecha: form.fechaDiligenciamiento,
                    nombreacti: form.nombreActividad,
                    codigoActividad: form.codigoActividad,
                    tipoActividad: form.tipoActividad,
                    fechaInicio: form.fechaInicio,
                    fechaFinal: form.fechaFinal,
                    salonPosgrado: form.salonPosgrado,
                    tieneCosto: form.tieneCosto,
                    monto: form.monto,
                    duracionHoras: form.duracionHoras,
                    espacioFisico: form.espacioFisico,
                    nesesidades: text_nesesidades,
                    espacio: text_espaciofisico,
                    apoyoComunicacion : text_apoyocomunicacion,
                    ponentes: form.ponentes,
                    certificado: downloadURL,
                    asistemciapdf: additionalDownloadURL,
              });
            }else{
              text_nesesidades = form.nesesidades.join(',');
              text_espaciofisico = form.espacio.join(',');
              text_apoyocomunicacion = form.apoyoComunicacion.join(',');
              await addDoc(collection(db, 'certificados'), {
                id:form.codigoActividad,
                nombre: nombreUsuario,
                fecha: form.fechaDiligenciamiento,
                nombreacti: form.nombreActividad,
                codigoActividad: form.codigoActividad,
                tipoActividad: form.tipoActividad,
                fechaInicio: form.fechaInicio,
                fechaFinal: form.fechaFinal,
                salonPosgrado: form.salonPosgrado,
                tieneCosto: form.tieneCosto,
                monto: form.monto,
                duracionHoras: form.duracionHoras,
                espacioFisico: form.espacioFisico,
                nesesidades: text_nesesidades,
                espacio: text_espaciofisico,
                apoyoComunicacion : text_apoyocomunicacion,
                ponentes: form.ponentes,
                certificado: downloadURL
              });
            }
            console.log('Información del certificado guardada en Firestore.');
            // Aquí puedes realizar otras acciones después de cargar el PDF, como actualizar el estado del formulario
            SetStep(1);
        } catch (error) {
            console.error('Error al subir el PDF a Firebase Storage:', error);
        }

        console.log('form Data:', form);
        //restablece el formulario
        resetform();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        SetForm({
            ...form,
            asistemciapdf: file
        })
        SetPdfupload(true)
    }

    const handlecheckbox = (e) => {
      const {name, value, type, checked} = e.target;
      SetForm({
        ...form,
        [name]: checked ? [...form[name], value] : form[name].filter((option) => option !== value)
      })
    }

    const handleAddPonente = () => {
      SetForm({
        ...form,
        ponentes: [...form.ponentes, { ponente: '', documento: '', numDocumento: '', Nombres: '', PrimerApellido: '', SegundoApellido: '', Niveldeformacion: '', Vinculacion: '' }]
      })
    }

    const handleRemovePonente = index => {
      const newPonente = form.ponentes.filter((_, i) => i !== index);
      SetForm({...form, ponentes: newPonente})
    }

    const handleAddAsistente = () => {
      SetForm({
        ...form,
        asistente: [...form.asistente, {nombreapellido: '',numDocumentoidentificacion: '',Estamento: '',Programaacademico: '',email: ''}]
      })
    }

    const handleRemoveAsistente = index_asis => {
      const newAsistente = form.asistente.filter((_,i) => i !== index_asis);
      SetForm({...form, asistente: newAsistente})
    }

    const options = [
      { id: 1, label: 'Bombos' },
      { id: 2, label: 'Mesas' },
      { id: 3, label: 'Sillas' },
      { id: 4, label: 'Arañas' }
    ];

    const options_espaciofisico = [
      { id: 1, label: 'Aula Cruz Pombo' },
      { id: 2, label: 'Salon Ivonne Durán' },
      { id: 3, label: 'Salones de Multimedia' },
      { id: 4, label: 'Pasillos' },
      { id: 5, label: 'Lobby del Campus'},
      { id: 6, label: 'Salones de Posgrados'},
      { id: 7, label: 'Salones bloques A, B o C'}
    ];

    const options_apoyocomunicacion = [
      { id: 1, label: 'Dibulgación página web de la UdC' },
      { id: 2, label: 'Cubrimiento' },
      { id: 3, label: 'Diseño de piezas' },
      { id: 4, label: 'Publicación en redes de la facultad' },
      { id: 5, label: 'Publicación en redes de la universidad'},
      { id: 6, label: 'Otra...'}
    ];

  return (
    <section className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg mt-10 mb-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Resumen actividades 2024-1</h1>
      <form onSubmit={step == 4 ? handleSubmit : handlenext} className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Fecha de diligenciamiento<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fechaDiligenciamiento"
                value={form.fechaDiligenciamiento}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Periodo académico<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="periodoAcademico"
                value={form.periodoAcademico}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Nombre de la actividad académica<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nombreActividad"
                value={form.nombreActividad}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Código de la actividad académica<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="codigoActividad"
                value={form.codigoActividad}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Tipo de actividad<span className="text-red-500">*</span></label>
              <select 
                value={form.tipoActividad} 
                onChange={handleChange} 
                name="tipoActividad"
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="">Seleccionar...</option>
                <option value="diplomados">Diplomados</option>
                <option value="cursos-cortos">Cursos cortos</option>
                <option value="coloquios">Coloquios</option>
                <option value="conversatorios">Conversatorios</option>
                <option value="talleres">Talleres</option>
                <option value="seminarios">Seminarios</option>
                <option value="congreso">Congreso</option>
                <option value="estequloshop">Estequloshop</option>
                <option value="feria-de-emprendimiento">Feria de Emprendimiento</option>
                <option value="exposicion-de-afiches">Exposición de afiches</option>
                <option value="maratones">Maratones</option>
                <option value="concurso-de-puente">Concurso de puente</option>
                <option value="otra">Otra...</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Fecha de inicio<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Fecha final<span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fechaFinal"
                value={form.fechaFinal}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Unidad académica responsable<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="unidadResponsable"
                value={form.unidadResponsable}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">¿Cuál salón de posgrado o bloque?<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="salonPosgrado"
                value={form.salonPosgrado}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">¿Tiene algún costo la actividad?<span className="text-red-500">*</span></label>
              <select
                name="tieneCosto"
                value={form.tieneCosto}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
            {form.tieneCosto === 'si' && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">Indicar el monto</label>
                <input
                  type="number"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                />
              </div>
            )}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Duración en horas<span className="text-red-500">*</span></label>
              <input
                type="number"
                name="duracionHoras"
                value={form.duracionHoras}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              Siguiente
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Requerimiento de necesidades</label>
              <input
                type="text"
                name="espacioFisico"
                value={form.espacioFisico}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Para el evento necesita<span className="text-red-500">*</span></label>
              {options.map((option) => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="nesesidades"
                    id={`option-${option.id}`}
                    value={option.label}
                    onChange={handlecheckbox}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${option.id}`} className="text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Espacio fisico<span className="text-red-500">*</span></label>
              {options_espaciofisico.map((option) => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="espacio"
                    id={`option-${option.id}`}
                    value={option.label}
                    onChange={handlecheckbox}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${option.id}`} className="text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Requerimiento de apoyo en comunicación<span className="text-red-500">*</span></label>
              {options_apoyocomunicacion.map((option) => (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="apoyoComunicacion"
                    id={`option-${option.id}`}
                    value={option.label}
                    onChange={handlecheckbox}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${option.id}`} className="text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              Siguiente
            </button>
          </>
        )}
        {step === 3 && (
          <>
          <label className="block mb-2 font-medium text-gray-700">Ponentes del evento</label>
            {form.ponentes.map((ponente, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">Descripcion de los ponentes</label>
                <input
                  type="text"
                  name="ponente"
                  value={ponente.ponente}
                  onChange={e => handleChange(e, index)}
                  placeholder="Descripción (Opcional)"
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Tipo de documento<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="documento"
                  value={ponente.documento}
                  onChange={e => handleChange(e, index)}
                  placeholder="C.C, C.E, Pasaporte, T.I"
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Numero de documento<span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="numDocumento"
                  value={ponente.numDocumento}
                  onChange={e => handleChange(e, index)}
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Nombres<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="Nombres"
                  value={ponente.Nombres}
                  onChange={e => handleChange(e, index)}
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Primer Apellido<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="PrimerApellido"
                  value={ponente.PrimerApellido}
                  onChange={e => handleChange(e, index)}
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Segundo Apellido<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="SegundoApellido"
                  value={ponente.SegundoApellido}
                  onChange={e => handleChange(e, index)}
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Nivel de formacion<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="Niveldeformacion"
                  value={ponente.Niveldeformacion}
                  onChange={e => handleChange(e, index)}
                  placeholder="Profesional, Especialista, Magister, Doctorado, Posdoctorado"
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                <label className="block mb-2 font-medium text-gray-700">Tipo de vinculacion<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="Vinculacion"
                  value={ponente.Vinculacion}
                  onChange={e => handleChange(e, index)}
                  placeholder="Profesor de planta, Profesor ocacionales, Profesor de catedra, Externo internacional, Externo nacional"
                  required
                  className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300 mb-2"
                />
                {form.ponentes.length > 1 && (
                  <button type="button" onClick={() => handleRemovePonente(index)} className="bg-red-500 text-white p-2 rounded-lg mb-2">Eliminar Ponente</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddPonente} className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 mb-4">Añadir Ponente</button>
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              Siguiente
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Anexe aqui el PDF asistencia</label>
              <input
                type="file"
                accept=".pdf"
                name="asistemciapdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          { !pdfupload && (
            <>
              {form.asistente.map((asistente, index_asis) => (
                <div key={index_asis} className="mb-4">
                  <label className="block mb-2 font-medium text-gray-700">Nombres y apellidos<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="nombreapellido"
                    value={asistente.nombreapellido}
                    onChange={e => handleChange(e,null,index_asis)}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                  />
                  <label className="block mb-2 font-medium text-gray-700">Documento identificación<span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="numDocumentoidentificacion"
                    value={asistente.numDocumentoidentificacion}
                    onChange={e => handleChange(e,null,index_asis)}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                  />
                  <label className="block mb-2 font-medium text-gray-700">Estamento al que pertenece<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="Estamento"
                    value={asistente.Estamento}
                    onChange={e => handleChange(e,null,index_asis)}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                  />
                  <label className="block mb-2 font-medium text-gray-700">Programa academico al que pertenece<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="Programaacademico"
                    value={asistente.Programaacademico}
                    onChange={e => handleChange(e,null,index_asis)}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                  />
                  <label className="block mb-2 font-medium text-gray-700">Correo electronico<span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="correo"
                    value={asistente.correo}
                    onChange={e => handleChange(e,null,index_asis)}
                    required
                    className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring focus:ring-blue-300"
                  />
                  {form.asistente.length > 1 && (
                    <button type="button" onClick={() => handleRemoveAsistente(index_asis)} className="bg-red-500 text-white p-2 rounded-lg mb-2">Eliminar Asistente</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddAsistente} className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 mb-4">Añadir Asistente</button>
            </>
          )}
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
              Enviar
            </button>
          </>
        )}
      </form>
    </section>

  )
}

export default Forms