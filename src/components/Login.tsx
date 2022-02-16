import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useState } from 'react'

import {
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
} from 'firebase/auth'

import { configureCaptcha } from '../config/configureCaptcha'
import { Logout } from './Logout'

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const loginForm = async () => {
    const recaptchaVerifier = configureCaptcha()
    console.log(recaptchaVerifier)
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    } catch (error: any) {
      if (error.code === 'auth/multi-factor-auth-required') {
        console.log(error.code)
        const multiResolver = getMultiFactorResolver(auth, error)
        const phoneOptions = {
          multiFactorHint: multiResolver!.hints[0],
          session: multiResolver!.session,
        }
        const phoneAuthProvider = new PhoneAuthProvider(auth)
        await phoneAuthProvider.verifyPhoneNumber(
          phoneOptions,
          recaptchaVerifier
        )
        alert('Code has been sent to your phone')
      }
    }
  }
  const navigate = useNavigate()
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex justify-center items-center w-full">
        <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">
              ログインページ
            </h1>
            <div>
              <label className="block mb-1 text-gray-600 font-semibold">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-600 font-semibold">
                パスワード
              </label>
              <input
                className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
                type="password"
                required
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            id="sign-in-button"
            onClick={() => loginForm()}
            className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide"
          >
            ログイン
          </button>
          <Logout />
          <button
            className="mt-4 w-full px-3 py-2 text-white bg-indigo-600 rounded tracking-wide"
            onClick={() => navigate('/email')}
          >
            アカウント作成に切り替えます
          </button>
          <button
            className="mt-4 w-full px-3 py-2 text-white bg-indigo-600 rounded tracking-wide"
            onClick={() => navigate('/')}
          >
            トップに戻ります
          </button>
        </div>
      </div>
    </div>
  )
}
