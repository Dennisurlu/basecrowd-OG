import React, { Component } from 'react';
//import firebase from 'firebase/app';
//import 'firebase/functions';

/*
import 'firebase/database';
import 'firebase/firestore';
*/
import { updateCompleteCount } from 'components/utils/FirebaseUtils.js';

export class Playground extends Component {

  constructor() {
    super();
    //const pid = "skattemandtalslister-test";
    //const pid = "begravelsesprotokol-aarhus-1916-1921";
    //const pid = "doedsattester-aarhus-andre";
    //const pid = "doedsattester-aarhus-b";
    const pid = "doedsattester-test";
    this.state = {pid:pid};

  }

  componentDidMount(){
    // indlæs alle projekter der ikke er complete
    // indlæs alle collections der ikke er complete
    // indlæs alle documenter der ikke er complete .where LAST_USER_WRITE > 24 timer
    /*
    var releaseBlockedDocuments = firebase.functions().httpsCallable('releaseBlockedDocuments');
    releaseBlockedDocuments({}).then((result) => {
      // Read result of the Cloud Function.
      //var sanitizedMessage = result.data.text;
      console.log("RETURNED", result);
    }).catch((error) => {
      // Getting the Error details.
      console.log("error", error);
      var code = error.code;
      var message = error.message;
      var details = error.details;
      // ...
    });
    */




  }

  updateProject = () => {
    return updateCompleteCount(this.state.pid)
    .then(result => {
      console.log("complete count updated", this.state.pid, result);
      this.setState({result:"complete count updated: " +this.state.pid})

    })
  }




  render() {

    return (
      <div>
      <button
        onClick={this.updateProject}>
        Opdater documents complete på projekt:{this.state.pid}</button>

        { this.state.result &&
          <p>{this.state.result}</p>
        }

      </div>


    );
  }

}
