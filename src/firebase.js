import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCOt7xBvenqyLZ9gheVfT-Wz9Du14S-Q0c',
  authDomain: 'survey-village-69574.firebaseapp.com',
  databaseURL: 'https://survey-village-69574-default-rtdb.firebaseio.com/',
  projectId: 'survey-village-69574',
  storageBucket: 'survey-village-69574.appspot.com',
  messagingSenderId: '664569608909'
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// export const facebookProvider = new firebase.auth.FacebookAuthProvider()
export const messaging = firebase.messaging();