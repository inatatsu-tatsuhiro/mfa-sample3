import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Auth } from './components/Auth'
import { Google } from './components/Google'
import { SignIn } from './components/SignIn'
import { Login } from './components/Login'
import { TwoFactorSet } from './components/TwoFactorSet'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'

onAuthStateChanged(auth, (user) => {
  console.log('onAuthStateChanged')
  if (user) {
    console.log('signIn')
  } else {
    console.log('signOut')
  }
})

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/google" element={<Google />} />
        <Route path="/email" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/two-factor-set" element={<TwoFactorSet />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
