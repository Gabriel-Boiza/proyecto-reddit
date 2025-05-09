import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import HeaderLogin from '../../layouts/headerLogin.jsx';
import { useAuth } from '../../context/authContext.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, message, isError } = useAuth();

  const [user, setUser] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(user);
    if (success) {
      setTimeout(() => navigate(from, { replace: true }), 500);
    }
  };

  const handleUsernameInput = (e) => {
    setUser({ ...user, email: e.target.value });
  };

  const handlePasswordInput = (e) => {
    setUser({ ...user, password: e.target.value });
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[url('../assets/svg/login-background.svg')] bg-cover bg-center opacity-20 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderLogin />
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="bg-neutral-800 bg-opacity-90 rounded-lg p-8 w-full max-w-md shadow-lg">
            <h1 className="text-center text-white text-2xl font-extrabold mb-4">Log In</h1>

            <p className="text-white text-sm text-center mb-6">
              By continuing, you agree to our <a href="#" className="text-blue-400 underline">User Agreement</a> and acknowledge that you understand the <a href="#" className="text-blue-400 underline">Privacy Policy</a>.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Email or username"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleUsernameInput}
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handlePasswordInput}
              />

              <a href="#" className="text-blue-400 text-sm hover:underline mt-1">Forgot password?</a>

              <button type="submit" className="bg-gray-600 text-white rounded-full py-2 mt-3 hover:bg-gray-500">
                Log In
              </button>
            </form>

            {message && (
              <p className={`text-sm text-center mt-4 ${isError ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </p>
            )}

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
