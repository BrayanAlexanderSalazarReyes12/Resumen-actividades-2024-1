import { useState } from "react";
import ListResumenActividades from "./ListResumenActividades";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [usuario, SetUsuario] = useState('')
  const [pass, SetPass] = useState('')
  const [login, SetLogin] = useState(localStorage.getItem('Login'))

  

  const handlesubmit = () => {
    if(usuario == "Admin@gmail.com" && pass == "admin"){
      localStorage.setItem('Login',true)
    }
  }
  
  return (
    <>
      {login == 'true' ? (
        <ListResumenActividades 
          SetLogin = {SetLogin}
          login = {login}
        />
      ):(
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Resumen Actividades 2024-1    
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Iniciar sesión
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handlesubmit}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      placeholder="name@company.com" 
                      value={usuario}
                      onChange={e => SetUsuario(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      placeholder="••••••••" 
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                      value={pass}
                      onChange={e => SetPass(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
        
    </>
  )
}