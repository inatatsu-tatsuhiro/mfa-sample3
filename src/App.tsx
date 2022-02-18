import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Auth } from './components/Auth'
import { Google } from './components/Google'
import { SignIn } from './components/SignIn'
import { Login } from './components/Login'
import { TwoFactorSet } from './components/TwoFactorSet'
import { FirebaseUI } from './components/FirebaseUI'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { Contents } from './components/Contents'

onAuthStateChanged(auth, (user) => {
  console.log('onAuthStateChanged')
  if (user) {
    console.log('signIn', user)
    if (!!(user as any).reloadUserInfo.mfaInfo) {
      // MFA userかの確認
      console.log('mfa user')
    } else {
      console.log('not mfa user')
    }
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
        <Route path="/firebase-ui" element={<FirebaseUI />} />
        <Route path="/contents" element={<Contents />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
