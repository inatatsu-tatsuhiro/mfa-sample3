import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useState } from 'react'

import {
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
  MultiFactorResolver,
  GoogleAuthProvider,
  EmailAuthProvider,
} from 'firebase/auth'

import { configureCaptcha } from '../config/configureCaptcha'
import { Logout } from './Logout'

import { StyledFirebaseAuth } from 'react-firebaseui'

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/signedIn',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
}

export const FirebaseUILogin = () => {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [vid, setVid] = useState('')
  const [otp, setOTP] = useState('')
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null)

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
        await phoneAuthProvider
          .verifyPhoneNumber(phoneOptions, recaptchaVerifier)
          .then((verificationId) => {
            setVid(verificationId)
          })

        const res = getMultiFactorResolver(auth, error)
        setResolver(res)
        alert('Code has been sent to your phone')
      }
    }
  }

  const submitOtp = () => {
    if (resolver === null) {
      console.error('resolver not found')
      return
    }
    const credential = PhoneAuthProvider.credential(vid, otp)
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential)
    resolver
      .resolveSignIn(multiFactorAssertion)
      .then(function (userCredential) {
        // User signed in.
        console.log('user', userCredential)
      })
  }

  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}
