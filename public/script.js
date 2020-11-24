// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
// import firebase from "/node_modules/firebase/app";

// Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyDsxbQk89gAmQiwAaaiqyQQmf_1x3OQqIk",
  authDomain: "radio-orrery.firebaseapp.com",
  databaseURL: "https://radio-orrery.firebaseio.com",
  projectId: "radio-orrery",
  storageBucket: "radio-orrery.appspot.com",
  messagingSenderId: "924110178948",
  appId: "1:924110178948:web:3781a4c6d2fce979ad50d1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();




function main() {
  // console.log("main");
  let firebase = require('firebase');
  let firebaseui = require('firebaseui');

  // let ui = new firebaseui.auth.AuthUI(firebase.auth());

  // ui.start('#firebaseui-auth-container', {
  //   signInOptions: [
  //     firebase.auth.EmailAuthProvider.PROVIDER_ID
  //   ],
  // });

  // let uiConfig = {
  //   callbacks: {
  //     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
  //       // User successfully signed in.
  //       // Return type determines whether we continue the redirect automatically
  //       // or whether we leave that to developer to handle.
  //       return true;
  //     },
  //     uiShown: function () {
  //       // The widget is rendered.
  //       // Hide the loader.
  //       document.getElementById('loader').style.display = 'none';
  //     }
  //   },
  //   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  //   signInFlow: 'popup',
  //   signInSuccessUrl: '<url-to-redirect-to-on-success>',
  //   signInOptions: [
  //     // Leave the lines as is for the providers you want to offer your users.
  //     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //     firebase.auth.GithubAuthProvider.PROVIDER_ID,
  //     firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //     firebase.auth.PhoneAuthProvider.PROVIDER_ID
  //   ],
  //   // Terms of service url.
  //   tosUrl: '<your-tos-url>',
  //   // Privacy policy url.
  //   privacyPolicyUrl: '<your-privacy-policy-url>'
  // };

  // The start method will wait until the DOM is loaded.
  // ui.start('#firebaseui-auth-container', uiConfig);




  // Orrery
  const stars = document.getElementById("stars");

  const width = stars.width = window.innerWidth;
  const height = stars.height = window.innerHeight;

  let orrery = new Orrery(stars, width, height, star_data);
}

class Orrery {
  constructor(canvas, width, height, data) {
    this.canvas = canvas;
    this.background = 'rgb(253, 131, 117)';

    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;

    this.data = data;
    console.log(this.data[0]);

    // this.ctx.fillStyle = 'rgb(253, 131, 117)';
    this.ctx.fillStyle = 'rgb(0,0,0)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < 128; i++) {
      this.renderStar(Math.random() * 24, Math.random() * 90, Math.random() * 20);
    }

    // this.data.forEach(a => this.renderStar(a.ra, a.dec, a.mag))
  }

  renderStar = function (ra, dec, mag) {
    this.ctx.fillStyle = `rgb(255,255,255)`;
    this.ctx.globalAlpha = mag / 20;
    this.ctx.beginPath();
    this.ctx.arc(ra / 24 * this.width, dec / 90 * this.height, 3.2, 0, 2 * Math.PI, false);
    this.ctx.fill();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});