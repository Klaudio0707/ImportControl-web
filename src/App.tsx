import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'

function App() {


  return (
    <>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<Login />} />
            {/* <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            /> */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
