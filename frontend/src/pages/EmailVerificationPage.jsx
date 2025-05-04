import {Loader} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {easingDefinitionToFunction, motion} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {useAuthStore} from "../store/authStore.js";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { verifyEmail, error, isLoading} = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

  //   Handle Pasted content
    if(value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");

      pastedCode.forEach((pasteCode, index) => {
        newCode[index] = pasteCode || "";
      })
      setCode(newCode);

      const firstEmptyField = newCode.find((field) => field.value === "");
      const focusIndex = firstEmptyField === null ? 5 : firstEmptyField;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if(value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if(e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const response = await verifyEmail(verificationCode);
      navigate('/');
      toast.success(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(code.every(digit => digit !== "")) {
      handleVerification(new Event('submit'));
    }
  }, [code]);

  
  return (
    <>
      <motion.div
        className={`max-w-md w-full bg-gray-800/50 backdrop-blur-2xl rounded-2xl shadow-lg overflow-hidden`}
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}
      >
        <div className={`p-8`}>
          <h2 className={`text-3xl text-center font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text capitalize`}>Verify your Email</h2>
          <p className={`text-sm text-white text-center mb-6`} >Enter the 6-digit code sent to your email address.</p>
          <form onSubmit={handleVerification} className={`space-y-6`}>
            <div className={`flex justify-between`}>
              {code.map((digit, index) => {
                return <input
                  key={index}
                  ref={(el) =>  (inputRefs.current[index] = el)}
                  type={`text`}
                  maxLength={'6'}
                  value={digit}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none`}
                  disabled={isLoading}
                />
              })}
            </div>
            {error && <p className={`text-red-500/90 mt-2`}>{error}</p>}
            <motion.button
              whileHover={{ scale: 1.02}}
              whileTap={{ scale: 0.98}}
              type={`submit`}
              disabled={isLoading || code.some((digit) => !digit)}
              className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
            >
              {isLoading ? <Loader className={`animate-spin text-white mx-auto`} /> : 'Verify Email'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </>
  )
}

export default EmailVerificationPage;