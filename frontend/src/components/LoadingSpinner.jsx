import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <>
      <div className={`
        bg-emerald-900 flex items-center justify-center relative overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-green-900
      `}>
        <motion.div
          className={`w-16 h-16 border-4 border-t-green-500 rounded-full border-green-200`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    </>
  )
}

export default LoadingSpinner;