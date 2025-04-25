import { Link } from 'react-router-dom';
import HeaderLogin from '../components/headerLogin.jsx';

function Login() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Capa con fondo SVG */}
      <div className="absolute inset-0 bg-[url('../assets/svg/login-background.svg')] bg-cover bg-center opacity-20 z-0" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderLogin />

        <div className="flex flex-1 justify-center items-center px-4">
          <div className="bg-neutral-800 bg-opacity-90 rounded-lg p-8 w-full max-w-md shadow-lg">
            <h1 className="text-center text-white text-2xl font-extrabold mb-4">Log In</h1>
            
            <p className="text-white text-sm text-center mb-6">
              By continuing, you agree to our <a href="#" className="text-blue-400 underline">User Agreement</a> and acknowledge that you understand the <a href="#" className="text-blue-400 underline">Privacy Policy</a>.
            </p>

            {/* Botones de login */}
            <div className="flex flex-col gap-3 mb-4">
              <button className="bg-white text-black rounded-full py-2 font-medium hover:bg-gray-100">
                📱 Continue With Phone Number
              </button>
              <button className="bg-white text-black rounded-full py-2 font-medium hover:bg-gray-100">
                🔍 Continue with Google
              </button>
              <button className="bg-white text-black rounded-full py-2 font-medium hover:bg-gray-100">
                 Continue With Apple
              </button>
            </div>

            {/* Línea divisoria */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-600" />
              <span className="text-white text-xs mx-2">OR</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            {/* Formulario */}
            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Email or username"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <a href="#" className="text-blue-400 text-sm hover:underline mt-1">Forgot password?</a>

              <button
                type="submit"
                className="bg-gray-600 text-white rounded-full py-2 mt-3 hover:bg-gray-500"
              >
                Log In
              </button>
            </form>

            <p className="text-white text-sm text-center mt-4">
              New to Reddix? <Link to="/register" className="text-blue-400 hover:underline">Sign Up</Link>
            </p>

            <p className="text-center mt-4">
              <Link to="/" className="text-blue-400 hover:underline">Back to main page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
