import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'

export const Contents = () => {
  const [user, setUser] = useState<User | null>(null)

  const navi = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      console.log('onAuthStateChanged')
      if (u) {
        console.log('signIn', u)
        if (!!(u as any).reloadUserInfo.mfaInfo) {
          // MFA userかの確認
          console.log('mfa user')
          setUser(u)
        } else {
          console.log('not mfa user')
        }
      } else {
        console.log('signOut')
      }
    })
  }, [])
  if (user === null) {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
        <h1>MFAユーザーでログインしてください。</h1>
        <button
          className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
          onClick={() => navi('/')}
        >
          back home
        </button>
      </div>
    )
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <h1>SERVICE CONTENTS MFA OK!!!</h1>
    </div>
  )
}
