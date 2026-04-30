import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { FacebookAuthProvider, GithubAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCALUai0pUYAOydt_LT_GOmleYB1vtQQmI',
  authDomain: 'web-cloud-ynov-19e3c.firebaseapp.com',
  projectId: 'web-cloud-ynov-19e3c',
  storageBucket: 'web-cloud-ynov-19e3c.firebasestorage.app',
  messagingSenderId: '438413809312',
  appId: '1:438413809312:web:9a33d5ac414e63c3a15bc5',
  measurementId: 'G-7LR9Q89BF6',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

if (typeof window !== 'undefined') {
  void isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app, auth, facebookProvider, githubProvider };

