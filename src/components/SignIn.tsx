import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useState } from 'react'

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'

export const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const signInMethod = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredentials) => {
        sendEmailVerification(userCredentials.user).then(() => {
          console.log('success')
          navigate('/two-factor-set')
        })
      }
    )
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex justify-center items-center w-full">
        <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
          <div className="space-y-4">
            <h1 className="text-center text-2xl font-semibold text-gray-600">
              メールアドレスとパスワードでのアカウント作成
            </h1>
            <div>
              <label className="block mb-1 text-gray-600 font-semibold">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => signInMethod(email, password)}
            className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide"
          >
            アカウント作成
          </button>
          <button
            className="mt-3 px-3 py-2 w-full text-white bg-indigo-600 rounded"
            onClick={() => navigate('/login')}
          >
            ログインに切り替えます
          </button>
          <button
            className="mt-3 px-3 py-2 w-full text-white bg-indigo-600 rounded"
            onClick={() => navigate('/')}
          >
            トップページへ
          </button>
        </div>
      </div>
    </div>
  )
}
