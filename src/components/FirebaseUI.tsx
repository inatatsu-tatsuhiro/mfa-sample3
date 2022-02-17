import { useNavigate } from 'react-router-dom'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../config/firebase'

export const FirebaseUI = () => {
  const provider = new GoogleAuthProvider()
  const emailProvider = new EmailAuthProvider()
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: 'test',
    signInOptions: [
      provider.providerId,
      emailProvider.providerId,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  }
  const navigate = useNavigate()
  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}
