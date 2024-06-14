import { Login } from "./Components/Login"
import Forms from "./Components/Forms/Forms";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registro_asistencia from "./Pages/Registro_asistencia";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Registro_asistencia/:nombreActividad/:codigoActividad" element={<Registro_asistencia/>} />
        <Route path="/" element={<Forms/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
