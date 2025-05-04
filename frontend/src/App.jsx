import FloatingShape from "./components/FloatingShape.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {SignupPage} from "./pages/SignupPage.jsx";
import {LoginPage} from "./pages/LoginPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import { Toaster } from "react-hot-toast"
import {useAuthStore} from "./store/authStore.js";
import {useEffect} from "react";
import {HomePage} from "./pages/HomePage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import {ResetPasswordPage} from "./pages/ResetPasswordPage.jsx";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to={'/login'} replace />
  }
  if(!user.isVerified) {
    return <Navigate to={'/verify-email'} replace />
  }
  return children;
}

// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if(isAuthenticated && user.isVerified) {
    return <Navigate to={'/'} replace />
  }
  return children;
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) {
    return <LoadingSpinner className={`animate-spin text-white`} />
  }

  return (
    <>
      <div className={`
        bg-emerald-900 flex items-center justify-center relative overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-green-900
      `}>
        <FloatingShape color={'bg-green-500'} size={`h-64 w-64`} top={`-5%`} left={`10%`} delay={0} />
        <FloatingShape color={'bg-emerald-500'} size={`h-42 w-42`} top={`70%`} left={`80%`} delay={5} />
        <FloatingShape color={'bg-lime-500'} size={`h-34 w-34`} top={`40%`} left={`-10%`} delay={2} />

        <Routes>
          <Route path={'/'} element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path={'/signup'} element={
            <RedirectAuthenticatedUser >
              <SignupPage />
            </RedirectAuthenticatedUser>}
          />
          <Route path={'/login'} element={
            <RedirectAuthenticatedUser >
              <LoginPage />
            </RedirectAuthenticatedUser>}
          />
          <Route path={'/forgot-password'} element={<ForgotPasswordPage />} />
          <Route path={'/verify-email'} element={<EmailVerificationPage />} />
          <Route path={'/reset-password/:token'} element={<ResetPasswordPage />} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
