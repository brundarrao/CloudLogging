// import React, { Component } from 'react';
// import withFirebaseAuth from 'react-with-firebase-auth'
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import firebaseConfig from './firebaseConfig';
// import logo from './logo.svg';
// import './App.css';
// import Profile from './components/profile'

// const firebaseApp = firebase.initializeApp(firebaseConfig);

// class App extends Component {
//   render() {
//     const {
//       user,
//       signOut,
//       signInWithGoogle,
//     } = this.props;

//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           {
//             user
//               ? <Profile user={user} />
//               : <p>Sign In</p>
//           }

//           {
//             user
//               ? <button onClick={signOut}>Sign out</button>
//               : <button onClick={signInWithGoogle}>Sign in with Google</button>
//           }
//         </header>
//       </div>
//     );
//   }
// }

// const firebaseAppAuth = firebaseApp.auth();

// const providers = {
//   googleProvider: new firebase.auth.GoogleAuthProvider(),
// };

// export default withFirebaseAuth({
//   providers,
//   firebaseAppAuth,
// })(App);






import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Application from "./components/Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./components/ProfilePage";
import { UserContext } from "./providers/UserProvider";
function App() {
  
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  );
}

export default App;
