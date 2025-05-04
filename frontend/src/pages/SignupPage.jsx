import { motion } from "framer-motion";
import Input from "../components/Input.jsx";
import {User, Mail, Lock, Loader} from "lucide-react";
import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
import {useAuthStore} from "../store/authStore.js";

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <motion.div
        className={`max-w-md w-full bg-gray-800/50 backdrop-blur-2xl rounded-2xl shadow-xl overflow-hidden`}
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
      >
        <div className={`p-8`}>
          <h1 className={`text-3xl text-center font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text`}>Create Account</h1>
          <form onSubmit={handleSignup}>
            <Input
              icon={User}
              type={`text`}
              placeholder={`Full Name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              icon={Mail}
              type={`email`}
              placeholder={`Email Address`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              icon={Lock}
              type={`password`}
              placeholder={`Password`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className={`text-red-500/90   mt-2`}>{error}</p>}
            <PasswordStrengthMeter password={password} />
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
              {isLoading ? <Loader className={`animate-spin text-white mx-auto`} /> : 'Sign In'}
            </motion.button>
          </form>
        </div>
        <div className={`px-8 py-4 bg-gray-900/50 flex justify-center`}>
          <p className={`text-gray-400 text-sm`}>Already have an account?{" "}<Link to={"/login"} className={`text-green-400 hover:underline`}>Login</Link></p>
        </div>
      </motion.div>
    </>
  )
}