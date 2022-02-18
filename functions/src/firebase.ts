import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const region = 'asia-northeast1'

export const config = functions.config()

admin.initializeApp()

export { admin }
export { functions }
