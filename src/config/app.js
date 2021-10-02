/* global process */

export default {
  // Application config
  app: {
    flightControlPositions: {
      'CAPCOM': 'Capsule Communicator',
      'EVA': 'Extravehicular Activity',
      'FD': 'Flight Director',
      'FOD': 'Flight Operations Directorate',
      'FS': 'Flight Surgeon',
      'PAO': 'Public Affairs Office'
    }
  },

  // Firebase config
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  }
};
