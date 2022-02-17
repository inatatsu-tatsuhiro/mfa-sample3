import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useState } from 'react'

import {
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
} from 'firebase/auth'

import { configureCaptcha } from '../config/configureCaptcha'
import { Logout } from './Logout'

export const Login = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [otp, setOtp] = useState('')
  const [resolve, setResolve] = useState<any>()
  const loginForm = async () => {
    const recaptchaVerifier = configureCaptcha()
    console.log(recaptchaVerifier)
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    } catch (error: any) {
      let resolver: any;
      if (error.code === 'auth/multi-factor-auth-required') {
        console.log(error.code)
        resolver = getMultiFactorResolver(auth, error)
        setResolve(resolver)
      }
      const multiResolver = getMultiFactorResolver(auth, error)
        
      const phoneOptions = {
        multiFactorHint: multiResolver!.hints[0],
        session: multiResolver!.session,
      }
      const phoneAuthProvider = new PhoneAuthProvider(auth)
      const verifyId = await phoneAuthProvider.verifyPhoneNumber(
        phoneOptions,
        recaptchaVerifier
      )
      setVerificationId(verifyId)
      alert('Code has been sent to your phone')
    }
  }

  const verifyAction = async () => {
    try {
      const firebaseCredentials = PhoneAuthProvider.credential(
        verificationId,
        otp
      );
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(firebaseCredentials);
      const credentials = await resolve.resolveSignIn(
        multiFactorAssertion
      );
      console.log(credentials, "credentials");
      console.log("success");
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (e) {
      console.log(e, 'error')
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
          <div>
            <label className="block mb-1 text-gray-600 font-semibold">
              認証コード
            </label>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setOtp(e.target.value)}
              className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
            />
          </div>
          <button
            id="sign-in-button"
            onClick={() => verifyAction()}
            className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide"
          >
            コード認証
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
