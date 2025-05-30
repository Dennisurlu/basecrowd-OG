import React from 'react';
import ReactDOM from 'react-dom';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase/app';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
//import registerServiceWorker from './registerServiceWorker';
//import { unregister } from './registerServiceWorker';

//injectTapEventPlugin();
var config = {
  apiKey: "AIzaSyBNyHc1X_xxKYKNa71CN8SUe0mScUhq4y0",
  authDomain: "den-spanske-syge.firebaseapp.com",
  databaseURL: "https://den-spanske-syge.firebaseio.com",
  projectId: "den-spanske-syge",
  storageBucket: "den-spanske-syge.appspot.com",
  messagingSenderId: "829752121038"
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
//registerServiceWorker();
//unregister();
