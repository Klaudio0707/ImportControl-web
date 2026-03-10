import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthContextProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Process from './pages/Process';
import Header from './components/Header';

function App() {


  return (
    <>
      <Toaster />
      <AuthContextProvider>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
            <Route path="/process/:id" element={<Process />} />
            <Route path='/process' element={<Process />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App
