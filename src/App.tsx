
import './App.css'
import { AuthProvider } from './contexts/AuthContext'

function App() {


  return (
    <>
     <AuthProvider>
    <h1>teste</h1>
    </AuthProvider>
    </>
  )
}

export default App
