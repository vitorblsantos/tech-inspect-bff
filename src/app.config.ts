import admin from 'firebase-admin'

admin.initializeApp({
  projectId: 'vitorblsantos'
})

admin.firestore().settings({
  databaseId: 'vitorblsantos'
})

export const Firebase = admin
