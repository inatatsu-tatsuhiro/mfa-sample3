import { useNavigate } from 'react-router-dom'
import {
  signInWithPopup,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  OAuthProvider,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { configureCaptcha } from '../config/configureCaptcha'
import { useState } from 'react'

export const Microsoft = () => {
  const [verificationId, setVerificationId] = useState('')
  const [otp, setOtp] = useState('')
  const [resolve, setResolve] = useState<any>()
  const navigate = useNavigate()
  const provider = new OAuthProvider('microsoft.com')

  async function microsoftLogin() {
    const recaptchaVerifier = configureCaptcha()
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result)
        const token = credential!.accessToken
        const user = result.user
        sendEmailVerification(user)
        console.log(token, user, 'signIn')
        setTimeout(() => {
          navigate('/two-factor-set')
        }, 1000)
      })
      .catch(async (error) => {
        let resolver: any
        if (error.code === 'auth/multi-factor-auth-required') {
          resolver = getMultiFactorResolver(auth, error)
          setResolve(resolver)
        }
        const phoneOptions = {
          multiFactorHint: resolver!.hints[0],
          session: resolver!.session,
        }
        const phoneAuthProvider = new PhoneAuthProvider(auth)
        const verifyId = await phoneAuthProvider.verifyPhoneNumber(
          phoneOptions,
          recaptchaVerifier
        )
        setVerificationId(verifyId)
      })
  }

  const verifyAction = async (verificationId: string, otp: string) => {
    try {
      const firebaseCredentials = PhoneAuthProvider.credential(
        verificationId,
        otp
      )
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(firebaseCredentials)
      const credentials = await resolve.resolveSignIn(multiFactorAssertion)
      console.log(credentials, 'credentials')
      console.log('success')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (e) {
      console.log(e, 'error')
    }
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <h1>MicroSoft Login</h1>
      <button
        id="sign-in-button"
        onClick={() => microsoftLogin()}
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
      >
        MicroSoftログイン
      </button>
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
        <div className="space-y-4">
          <h1 className="text-center text-2xl font-semibold text-gray-600">
            認証コードの入力
          </h1>
          <div>
            <label className="block mb-1 text-gray-600 font-semibold">
              認証コード
            </label>
            <input
              className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              type="number"
              name="mobile"
              placeholder="Mobile number"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>
        <button
          id="sign-in-button"
          onClick={() => verifyAction(verificationId, otp)}
          className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide"
        >
          認証を実施します
        </button>
      </div>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('/email')}
      >
        Navigate to Email Login
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('/')}
      >
        back home
      </button>
    </div>
  )
}
