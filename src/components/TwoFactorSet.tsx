import { auth } from '../config/firebase'
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from 'firebase/auth'
import { configureCaptcha } from '../config/configureCaptcha'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const TwoFactorSet = () => {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const twoFactorMethod = async (mobile: string) => {
    console.log(mobile)
    const recaptchaVerifier = configureCaptcha()
    console.log(recaptchaVerifier)
    const phoneNumber = '+81' + mobile
    const appVerifier = recaptchaVerifier
    const multiFactorUser = multiFactor(auth.currentUser!)
    const multiFactorSession = await multiFactorUser.getSession()
    const phoneAuthProvider = new PhoneAuthProvider(auth)
    const phoneInfoOptions = {
      phoneNumber: phoneNumber,
      session: multiFactorSession,
    }
    const verifyId = await phoneAuthProvider.verifyPhoneNumber(
      phoneInfoOptions,
      appVerifier
    )
    setVerificationId(verifyId)
  }

  const verifyAction = async (verificationId: string, otp: string) => {
    try {
      const firebaseCredentials = PhoneAuthProvider.credential(
        verificationId,
        otp
      )
      const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(firebaseCredentials)
      const multiFactorUser = multiFactor(auth.currentUser!)
      await multiFactorUser.enroll(multiFactorAssertion)
      console.log('success')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (e) {
      console.log(e, 'error')
    }
  }
  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 to-indigo-600 flex justify-center items-center w-full">
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
        <div className="space-y-4">
          <h1 className="text-center text-2xl font-semibold text-gray-600">
            多要素認証の設定
          </h1>
          <div>
            <label className="block mb-1 text-gray-600 font-semibold">
              電話番号
            </label>
            <input
              className="bg-indigo-50 px-4 py-2 outline-none rounded-md w-full"
              type="number"
              name="mobile"
              placeholder="Mobile number"
              required
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
        <button
          id="sign-in-button"
          onClick={() => twoFactorMethod(mobile)}
          className="mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide"
        >
          SMSに送信します
        </button>
      </div>
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
    </div>
  )
}
