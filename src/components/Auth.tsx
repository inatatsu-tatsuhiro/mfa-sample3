import { useNavigate } from 'react-router-dom'
import { Logout } from './Logout'

export const Auth = () => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <h1>Auth</h1>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('google')}
      >
        Googleログイン
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('microsoft')}
      >
        Microsoftログイン
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('email')}
      >
        メールでのアカウント作成
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('login')}
      >
        メールでのログイン
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('firebase-ui')}
      >
        FirebaseUI
      </button>
      <button
        className="mt-3 px-3 py-2 text-white bg-indigo-600 rounded"
        onClick={() => navigate('contents')}
      >
        管理者ページ
      </button>
      <Logout />
    </div>
  )
}
