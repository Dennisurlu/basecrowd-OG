import 'babel-polyfill';
import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';


import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Modal from '@material-ui/core/Modal';

import TopMenuBar from 'components/ui/TopMenuBar';
import { ImageTest } from 'components/playground/ImageTest';
import { Playground } from 'components/playground/Playground.js';
import { Feedback } from 'components/pages/Feedback.js';
import { CookieConsentPage } from 'components/pages/CookieConsentPage.js';
import { Methodology } from 'components/pages/Methodology.js';
import { FrontPage } from 'components/pages/frontpage/FrontPage.js';
import { UserActivity } from 'components/pages/UserActivity.js';

import { UiMessages } from 'components/ui/UiMessages.js';

import { MouseWheelZoom } from 'components/pages/MouseWheelZoom.js';
//
import Projects from 'components/projects/Projects.js';
import GoogleAnalytics from 'components/utils/GoogleAnalytics';

import { Login } from 'components/login/Login.js';

import CookieConsent from "react-cookie-consent";

import { setCurrentTranscriptionRef } from 'components/utils/FirebaseUtils.js';
import { loadUserData } from 'components/utils/FirebaseUtils.js';

import { releaseBlockedDocuments } from 'components/utils/FirebaseUtils.js';

const font = "'Open Sans', sans-serif";
const theme = createMuiTheme({
  typography: {
    fontFamily: font,
  },
  fontFamily: font,
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
    primary: {
      main: '#2acc79',
    },
    secondary:{
      main:'#95a5a6'
    }
  },
});



class App extends Component {

  constructor() {
      super();
      this.state = {
        user:null,
        isLoginModalOpen:false,
      };
  }

  componentDidMount(){

    releaseBlockedDocuments();

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const { uid } = firebaseUser;
        console.log("uid", uid);
        return loadUserData(uid)
        .then(userData => {
          console.log("loadUserData response", userData);
          if(!userData){
            console.log("userData was null setting to empty object {}");
            userData = {};
          }
          this.resetCurrentTranscriptionRef(uid);
          this.setState({user:firebaseUser, isLoginModalOpen:false, userData:userData });
        }).catch(error => {
          console.error("error loading userData", error);
        })
      } else {
        this.setState({user:null, userData:null, isLoginModalOpen:false});
      }
    });

  }


  resetCurrentTranscriptionRef = (uid) => {
    const path = "users/" + uid
    return setCurrentTranscriptionRef(uid, path, {transcribingref:null})
     .then(result => {
         //console.log("User transcribingref set to null");
         return true;
       }).catch(reason => {
         console.log("Error setting transcribingref", reason);
         return false;
       })

  }

  openLoginModal = () => {
    this.setState({ isLoginModalOpen: true });
  }

  handleClose = () => {
    this.setState({ isLoginModalOpen: false });
  };

  logOut = () => {
    console.log("logOut");
    this.setState({ anchorElUser: null });
    firebase.auth().signOut().then(() => {
      //history.push("/");
      window.location.href = '/'
    })
  }


  render() {

    const outer = {
      width:'100%',
      height:'100%',
      margin:'0 auto',
      backgroundColor:'rgb(49, 57, 68)'
    }

    const { user, userData } = this.state;

    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        </Router>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isLoginModalOpen}
          onClose={this.handleClose}
        >
          <div>
            <Login user={user} />

          </div>
        </Modal>

            <div className="App" style={outer}>
              <UiMessages />
              <TopMenuBar user={user} logOut={this.logOut} />

              <div style={{height:'calc(100% - 64px)'}}>
                  <Switch>
                    <Route path="/login" render={(props) => <Login user={user} {...props} /> } />
                    <Route path="/useractivity" component={UserActivity}/>
                    <Route path="/feedback" component={Feedback}/>
                    <Route path="/cookie-consent" component={CookieConsentPage}/>
                    <Route path="/methodology" component={Methodology}/>
                    <Route path="/playground" component={Playground}/>
                    <Route path="/mousewheelzoom" component={MouseWheelZoom}/>
                    <Route path="/projects" render={(props) => <Projects user={user} userData={userData} {...props} /> } />
                    <Route path="/" render={(props) => <FrontPage openLoginModal={this.openLoginModal} user={user} {...props} /> } />

                    <Route path="/imagetest" component={ImageTest}/>

                  </Switch>
                </div>
                  <GoogleAnalytics />

            </div>
            <CookieConsent
                location="top"
                buttonText="OK"
                cookieName="acceptcookieconsent"
                style={{ background: "#2B373B" }}
                buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                expires={150}
            >
                Vi anvender cookies for at sikre at vi giver dig den bedst mulige oplevelse af vores website. Hvis du fortsætter med at bruge dette site vil vi antage at du er indforstået med det.{" "}
                <Link to="/cookie-consent">Læs mere</Link>
            </CookieConsent>
          </MuiThemeProvider>
      </React.Fragment>

    );
  }
}

export default App;
