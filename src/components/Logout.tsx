import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'

export const Logout = () => {
  const logOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('success')
      })
      .catch((error) => {
        // An error happened.
        console.log(error)
      })
  }
  return (
    <div>
      <button 
      className="mt-4 w-full px-3 py-2 text-white bg-indigo-600 rounded tracking-wide"
      onClick={logOut}>ログアウト</button>
    </div>
  )
}