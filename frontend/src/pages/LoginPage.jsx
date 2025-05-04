import Input from "../components/Input.jsx";
import {useState} from "react";
import {LockIcon, UserIcon, Loader} from "lucide-react";
import {motion} from 'framer-motion';
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "../store/authStore.js";

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { error, login, isLoading} = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <motion.div
        className={`max-w-md w-full bg-gray-800/50 backdrop-blur-2xl rounded-2xl shadow-lg overflow-hidden`}
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
      >
        <div className={`p-8`}>
          <h2 className={`text-3xl text-center font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text`}>Welcome Back</h2>
          <form onSubmit={handleLogin}>
          <Input
            icon={UserIcon}
            type={'email'}
            placeholder={`Email Address`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Input
            icon={LockIcon}
            type={'password'}
            placeholder={`Password`}
            className={`
            `}
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Link to={'/forgot-password'} className={`text-sm text-green-500 hover:underline`}>Forgot password?</Link>
          {error && <p className={`text-red-500 mt-2`}>{error}</p>}
          <motion.button
            className={`
              mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
              hover:from-gray-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              focus:ring-offset-gray-900 transition duration-200
            `}
            whileHover={{ scale: 1.02}}
            whileTap={{ scale: 0.98}}
            type={`submit`}
            disabled={isLoading}
          >
            {isLoading ? <Loader className={`animate-spin text-white mx-auto`} /> : 'Login'}
          </motion.button>
        </form>
        </div>
        <div className={`px-8 py-4 bg-gray-900/50 flex justify-center`}>
          <p className={`text-gray-400 text-sm`}>Don't have a account?{" "}<Link to={`/signup`} className={`text-green-400 hover:underline`}>Signup</Link></p>
        </div>
      </motion.div>


    </>
  )
}