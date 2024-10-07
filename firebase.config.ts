import admin from 'firebase-admin'

admin.initializeApp()

admin.firestore().settings({
  databaseId: 'portal-imobiliarias'
})
