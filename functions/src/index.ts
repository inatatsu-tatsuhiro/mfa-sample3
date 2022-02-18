import { UserRecord } from 'firebase-functions/v1/auth'
import { admin, functions } from './firebase'

const auth = admin.auth()

const GROUP = {
  'opening-line': '__UNIQUE_ID__'
} as {[key: string]: string }

async function handler(user: UserRecord, ctx: functions.EventContext) {
  console.info(
    'email: %s, name: %s, verified: %s, provider: %s, claims: %s',
    user.email,
    user.displayName,
    user.emailVerified,
    JSON.stringify(user.providerData),
    JSON.stringify(user.customClaims)
  )

  if(user.email) {
    const domain = user.email.substring(user.email.lastIndexOf('@') + 1)
    if(GROUP[domain]) {
      await auth.setCustomUserClaims(user.uid, {
        domain
      })
    }
  } else {
    console.warn("User doesn't have E-Mail attribute.")
  }

  return user
}

export const authUserOnCreate = functions.auth.user().onCreate(handler)
