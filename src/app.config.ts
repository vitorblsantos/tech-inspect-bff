import admin from 'firebase-admin'

admin.initializeApp({
  projectId: 'vitorblsantos'
})

admin.firestore().settings({
  databaseId: 'vitorblsantos',
  timestampsInSnapshots: true
})

export const Firebase = admin
export const Firestore = admin.firestore()
