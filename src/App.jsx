import { Login } from "./Components/Login"
import Forms from "./Components/Forms/Forms";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Forms/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
