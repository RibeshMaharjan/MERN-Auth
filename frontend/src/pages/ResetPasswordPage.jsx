import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [reNewPassword, setReNewPassword] = useState('')
  const {resetPassword, isLoading, error, message} = useAuthStore();
  const {token} =  useParams();
  console.log(token)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newPassword !== reNewPassword) {
      alert("Password do not match");
      return;
    }
    try {
      await resetPassword(token, newPassword, reNewPassword);
      toast.success("Password reset Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error)
      toast.error(error.message || "Error resetting password");
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
      >
        <div className='p-8'>
          <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Reset Password
          </h2>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type='password'
              placeholder='New Password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type='password'
              placeholder='Confirm New Password'
              value={reNewPassword}
              onChange={(e) => setReNewPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </>
  )
}