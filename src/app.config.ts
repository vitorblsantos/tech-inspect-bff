import admin from 'firebase-admin'

admin.initializeApp()

admin.firestore().settings({
  databaseId: 'tech-inspect'
})

export const Firebase = admin
