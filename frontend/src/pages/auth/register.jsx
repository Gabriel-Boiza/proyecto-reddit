import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from 'react';
import HeaderLogin from '../../layouts/headerLogin.jsx';
import { domain } from '../../context/domain.js';
function Register() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log(message)
  }, [message])
  
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; //name es e.target.name y value e.target.value
    setUser({...user,[name]: value,}); //coge el atributo name y lo pone como variable del json
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(user.password === user.confirmPassword){
      const userObject = {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      }
      axios.post(`${domain}register`, userObject)
      .then(response => {
        setIsError(false)
        setMessage(response.data.message)
        setTimeout(() => navigate("/"), 500);
      })
      .catch(error => {
        setIsError(true)
        setMessage(error.response.data.message)
      })

    }
  };


  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Imagen de fondo con opacidad reducida */}
      <div className="absolute inset-0 bg-[url('../assets/svg/login-background.svg')] bg-cover bg-center opacity-20 z-0"></div>

      {/* Contenido encima del fondo */}
      <div className="relative z-10 flex flex-col flex-1">
        <HeaderLogin />

        {/* Contenedor centrado */}
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="bg-neutral-800 bg-opacity-90 rounded-lg p-8 w-full max-w-md shadow-lg">
            <h1 className="text-center text-white text-2xl font-extrabold mb-4">Sign Up</h1>

            <p className="text-white text-sm text-center mb-6">
              By continuing, you agree to our <a href="#" className="text-blue-400 underline">User Agreement</a> and acknowledge that you understand the <a href="#" className="text-blue-400 underline">Privacy Policy</a>.
            </p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Username"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <a href="#" className="text-blue-400 text-sm hover:underline mt-1">Forgot password?</a>

              <button
                type="submit"
                className="bg-gray-600 text-white rounded-full py-2 mt-3 hover:bg-gray-500"
              >
                Register
              </button>
            </form>

            {message && (
              <p className={`text-sm text-center mt-4 ${isError ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}

            <p className="text-white text-sm text-center mt-4">
              Already registered? <Link to="/login" className="text-blue-400 hover:underline">Log In</Link>
            </p>

            <p className="text-center mt-4">
              <Link to="/" className="text-blue-400 hover:underline text-center">Back to main page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
