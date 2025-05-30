import React, { Component } from 'react';
import firebase from 'firebase/app';
import CircularProgress from '@material-ui/core/CircularProgress';
//import Typography from '@material-ui/core/Typography';

import { ImageContainer } from 'components/image/ImageContainer';
import { InputContainer } from 'components/input/InputContainer';

import { Login } from 'components/login/Login';

import ResumeContainer from 'components/input/ResumeContainer';
import Guide from './Guide.js';
import * as CONSTANTS from '../constants.js';

import { setCurrentTranscriptionRef } from 'components/utils/FirebaseUtils.js';

import { NextDocumentDialog } from 'components/ui/NextDocumentDialog.js';
//import cookie from 'react-cookies'



export default class Document extends Component {

  constructor(props) {
    super(props);

    let showStartText = false;

    this.state = {
      project:null,
      document:null,
      transcriptions:null,
      currTranscription:null,
      template:null,
      transcriptionChanged:false,
      projectid:null,
      documentid:null,
      ready:false,
      fieldid:null,
      showStartText: showStartText,
      errorMessage:"",
      transcribingref:null,
      user:props.user,
      userData:props.userData,
      loadingData:false,

    }

  }


  componentDidMount(){
    const { projectid } = this.props.match.params;
    const { collectionid } = this.props.match.params;
    const { documentid } = this.props.match.params;
    const { mode } = this.props.match.params;
    const { fieldid } = this.props.match.params;
    if(this.state.user) this.initData(this.state.user, projectid, collectionid, documentid, mode, fieldid);
    document.title = projectid + "/" + collectionid + "/" + documentid;

  }

  componentWillReceiveProps(nextProps) {
    // ID PROJECT/COLLECTION/DOCUMENT IS DIFFERENT - LOAD DATA

    if(!nextProps.user || !nextProps.userData) {
      this.setState({user:nextProps.user, userData:nextProps.userData });
      console.log("no user returning");
      return;
    }

    const urlPid = nextProps.match.params.projectid;
    const urlCid = nextProps.match.params.collectionid;
    const urlDid = nextProps.match.params.documentid;
    const urlMode = nextProps.match.params.mode;
    const urlFid = nextProps.match.params.fieldid;

    const statePid = this.state.projectid;
    const stateCid = this.state.collectionid;
    const stateDid = this.state.documentid;
    const stateFid = this.state.fieldid;

    if(urlPid !== statePid || urlCid !== stateCid || urlDid !== stateDid   ){
      //console.log("NYE PID/CID/CID");
      this.setState({
          project:null,
          document:null,
          transcriptions:null,
          templates:null,
          ready:false,
          projectid:null,
          collectionid:null,
          documentid:null,
          fieldid:null,
          mode:null,
          user:nextProps.user,
          userData:nextProps.userData,

        })
        this.initData(nextProps.user,urlPid, urlCid, urlDid, urlMode, urlFid);
    } else {
      //console.log("MÅSKE ER DET KUN STATE ELLER FIELDID DER ER ÆDNRET???");
      //console.log("this.state.fieldid, urlFid", this.state.fieldid, urlFid);
      if(stateFid !== urlFid){
        console.log("FIELDID ÆNDRET", urlFid);
        document.title = stateDid + "/" + urlFid ;
        //console.warn("HVIS CURRENTTRANSCRIPTION && CHANGES => GEM", this.state.currTranscription);
        //console.log("transcriptionChanged", this.state.transcriptionChanged);
        const { transcriptions } = this.state;

        if(this.state.currTranscription && this.state.transcriptionChanged){
          this.saveTranscription(this.state.currTranscription);
          transcriptions[stateFid] = this.state.currTranscription;
        }

        const currTranscription = transcriptions[urlFid];


        this.setState({
          fieldid:urlFid,
          mode:urlMode,
          currTranscription:currTranscription,
          transcriptions:transcriptions,
          hoverField:null,
          transcriptionChanged:false,
          user:nextProps.user
        })

      }

    }

  }


  saveTranscription = (transcription) => {
    console.log("saveTranscription");

    const { projectid } = this.state;
    const { collectionid } = this.state;
    const { documentid } = this.state;
    const userid = this.state.user.uid;

    const { transcriptions } = this.state;
    const { fieldid } = this.state;

    const complete = transcription.empty || transcription.unreadable || transcription.value !== "";
    transcription.complete = complete;
    console.log("SAVE CHANGES", projectid, collectionid, documentid, userid, fieldid, complete)

    transcriptions[fieldid] = transcription;

    //this.setState({transcriptions:transcriptions});
    //this.setState({transcriptionChanged:false, transcriptions:transcriptions});

    console.log("hvis alle transcriptions[key].complete\n-> gem også doc.userComplete[uid].complete");


    const allComplete = this.allTranscriptionsComplete(transcriptions);
    console.log("all complete", allComplete);
    const batch = firebase.firestore().batch();

    const fieldRef = firebase.firestore().collection('projects').doc(projectid)
       .collection('collections').doc(collectionid)
       .collection('documents').doc(documentid)
       .collection('users').doc(userid)
       .collection('fields').doc(fieldid);

    batch.set(fieldRef, transcription);

    const userRef = firebase.firestore().collection('users').doc(userid);

    const now = Date.now();
    const d = new Date();
    const nowString = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes()

    const userUpdateData = {
      lastUpdate:{
        project:projectid,
        collection:collectionid,
        document:documentid,
        fieldid:fieldid,
        date:now,
        dateString:nowString,
        value:transcription.value
      }
    }
    batch.update(userRef, userUpdateData);

    const docRef = firebase.firestore().collection('projects').doc(projectid)
     .collection('collections').doc(collectionid)
     .collection('documents').doc(documentid);
     const userComplete = {
         [userid]:allComplete
     };


    //batch.set(docRef, {userComplete:{[userid]:allComplete}}, { merge: true })
    batch.set(docRef, {userComplete}, { merge: true })

    console.log("SET userComplete userid, allComplete", userid, allComplete);
    console.log("userCompleteDoc", userComplete);

    batch.commit().then((result) => {
        console.log("result", result);
      }).catch(reason => {
        console.log("Error updating field og document", reason);
        return false;
      })

  }

  allTranscriptionsComplete = (userTranscriptions) => {
    console.log("allTranscriptionsComplete");

    const { keysSorted } = this.state;

    for (var i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      if(userTranscriptions[key] && userTranscriptions[key].complete){
        console.log("userTranscriptions[key].complete", userTranscriptions[key]);
      } else {
        return false
      }
    }
    return true;

  }



  initData = (user, projectid, collectionid, documentid, mode, fieldid) => {
    //console.log("user", user);
    if(!user){
      alert("brugeren skal være logged ind")
      return;
    }

    let project;
    let collection;
    let document;
    let keysSorted;
    const transcriptions = {};

    const userid = user.uid;

    const prSetUserDocumentRef = this.setUserDocumentRef(userid, projectid, collectionid, documentid);
    const prCreateUser = this.createDocumentUser(userid, projectid, collectionid, documentid);
    const prProject = this.loadData("projects/" + projectid);
    const prCollection = this.loadData("projects/" + projectid + "/collections/" + collectionid);
    const prDoc = this.loadData("projects/" + projectid + "/collections/" + collectionid + "/documents/" + documentid);

    const prTranscriptions = this.loadUserTranscriptions(projectid, collectionid, documentid, userid );

    var that = this;

    Promise.all([prSetUserDocumentRef, prCreateUser, prProject, prCollection, prDoc, prTranscriptions])
      .then(values => {

        project = values[2];
        collection = values[3];
        document = values[4];
        const loadedTranscriptions = values[5];
        for (var key in loadedTranscriptions) {
          transcriptions[key] = loadedTranscriptions[key]
        }

        return this.loadData("templates/" + document.template_id)
      }).then(t => {
        //console.log("TEMPLATE LOADED", t);
        //console.log("document.regions", document.regions);

        var key
        let allTemplatefields;

        if(!t.hasOwnProperty('fields')){
          // TEMPLATE HAVDE IKKE 'fields'
          // -> DVS dynamiske felter
          let { regions } = document;
          //console.log("keysSorted", keysSorted);
          console.log("TEMPLATE DYNAMIC ");
          let arrRegions = [];
          for (key in regions) {
            const region = regions[key];
            region.key = key;
            arrRegions.push(region)
          }
          console.log("arrRegions", arrRegions);

          arrRegions = arrRegions.sort(function(a,b){

            // BEGIN - SORT ON FIELD KEY
            // BEGIN - SORT ON FIELD KEY
            const aRowCol = that.getRowCol(a.key);
            const bRowCol = that.getRowCol(b.key);
            return aRowCol.row - bRowCol.row || aRowCol.col - bRowCol.col;
            // END - SORT ON FIELD KEY
            // END - SORT ON FIELD KEY

          })


          allTemplatefields = {};
          for (var i = 0; i < arrRegions.length; i++) {
            key = arrRegions[i].key;
            delete arrRegions[i].key;
            allTemplatefields[key] = {
              title:"" + key,
              index:i
            }
          }

          t.fields = allTemplatefields;

        } else {
          // TEMPLATE HAR FIELDS
          // -> DVS PRÆDEFINERET ANTAL FELTER
          allTemplatefields = t.fields;
        }

        const { fieldsComplete } = document;

        const templatefields = {};

        for (key in allTemplatefields){
          //console.log("allTemplatefields", key);
          if(fieldsComplete[key] === false || transcriptions.hasOwnProperty(key)){
            templatefields[key] = allTemplatefields[key];
          }
        }

        keysSorted = Object.keys(templatefields).sort(function(a,b){return templatefields[a].index-templatefields[b].index});

        // INIT TRANSCRIPTION OBJECTS FOR THIS USER
        for (key in templatefields) {
          //console.log("user t has", key, transcriptions.hasOwnProperty(key) );
          if (!transcriptions.hasOwnProperty(key)) {
            console.log("ADDING key");
            transcriptions[key] = {
                complete:false,
                empty:false,
                unreadable:false,
                value:"",
                datecreated:Date.now()
              }
          }
        }

        const { showStartText } = this.state;
        //console.log("showStartText", showStartText, fieldid);

        if(mode !== "r"){

          if(showStartText === false){
            if(fieldid === undefined || keysSorted.indexOf(fieldid) < 0 ){  //("ONLY IF FIELDID IS UNDEFINED", fieldid);
              fieldid = keysSorted[0];
            }

            const path = "/projects/" + projectid + "/" + collectionid + "/" + documentid + "/t/" + fieldid;
            console.log("REPLACE");
            this.props.history.replace(path);
          }
        }

        const currTranscription = transcriptions[fieldid];

        this.setState({
          projectid:projectid,
          collectionid:collectionid,
          documentid:documentid,
          project:project,
          collection:collection,
          document:document,
          template:t,
          templatefields:templatefields,
          keysSorted:keysSorted,
          transcriptions:transcriptions,
          currTranscription:currTranscription,
          mode:mode,
          fieldid:fieldid,
          ready:true
        });

      }).catch(err => {
        console.error("error loading", err);
      })
    }

  getRowCol = (key) => {
    const rIndex = key.indexOf('r');
    const cIndex = key.indexOf('c');
    const l = key.length;

    const row = key.substring(rIndex+1, cIndex);
    const col = key.substring(cIndex+1, l);
    //console.log("getRowCol", key, row, col);
    return {row:row, col:col}


  }

  loadData = (path) => {
    return firebase.firestore().doc(path).get()
    .then(snap => {
      if (snap.exists) {
        const project = snap.data();
        return project;
      } else {
        throw new Error("ingen data på " + path);
      }
    }).catch(err =>{
      throw new Error("fejl ved indlæsning af " + path + " - " + err);

    })
  }


  setUserDocumentRef = (uid, projectid, collectionid, documentid) => {
    //const refPath = "users/" + uid
    const docPath = "projects/" + projectid + "/collections/" + collectionid + "/documents/" + documentid;
    return setCurrentTranscriptionRef(uid, docPath, {transcribingref:docPath})
    .then(result => {
      return true;
    }).catch(reason => {
      return false;
    })

  }


  createDocumentUser = (userid, projectid, collectionid, documentid) => {
    const path = "projects/" + projectid + "/collections/" + collectionid + "/documents/" + documentid + "/users/" + userid
    return firebase.firestore().doc(path)
         .set({created:true}, {merge:true})
         .then(snap => {
           //console.log("User created on Document.", projectid, documentid, userid);
           return true;
         }).catch(reason => {
           //console.log("Error creating user on Document", reason);
           return reason;
         })
  }

  loadUserTranscriptions = (projectid, collectionid, documentid, userid) => {
    //console.log("loadUserTranscriptions");
    const ref = firebase.firestore().collection('projects').doc(projectid)
                  .collection('collections').doc(collectionid)
                  .collection('documents').doc(documentid)
                  .collection('users').doc(userid)
                  .collection('fields')
                  //.where('userid', '==', userid)
                  //.where('complete', '==', false)

    return ref.get()
    .then(querySnapshot => {
      const result = {};
        querySnapshot.forEach(field => {
            var key = field.id;
            //console.log("key", key);
            result[key] = field.data()
        });
        //console.log("result", result);
        return result;
    })
    .catch(error => {
        console.error("Error getting userFields: ", error);
        return error;
    });
  }

  onResumeBack = () => {
    console.log("onResumeBack");
    const { keysSorted } = this.state;
    this.showFieldById(CONSTANTS.STATE_TRANSCRIBING, keysSorted[keysSorted.length-1]);
  }



  updateTranscriptionComplete = (transcription) =>{
    const complete = transcription.empty || transcription.unreadable || transcription.value !== "";
    transcription.complete = complete;
    //console.log("updateTranscriptionComplete", complete);
    this.setState({currTranscription:transcription});

  }

  onFieldOver = key => {
    this.setState({hoverField:key})
  }
  onFieldOut = key => {
    this.setState({hoverField:null})
  }


  handleFieldLink = key => e => {
    this.showFieldById(CONSTANTS.STATE_TRANSCRIBING, key);
  }

  onCancelEdit = () => {
    console.log("onCancelEdit");
    this.setState({fieldid:null, currTranscription:null});
  }

  onEditFieldSave = () => {
    console.log("onEditFieldSave");
    const path = this.getDocumentPath() + "/r";
    this.props.history.push(path);
  }



  showFieldById = (key) => {
    //console.log('showFieldById', inputState, key);

    this.setTranscriptonByFieldKey(key);
  }

  onTranscriptionChange = () => {
    this.setState({transcriptionChanged:true, errorMessage:""});
  }

  updateTranscription = (transcription) => {
    console.log("updateTranscription", transcription);
    this.setState({currTranscription:transcription});
  }


  getNextKey = (key) => {
    const {keysSorted} = this.state;
    var index = keysSorted.indexOf(key);
    if(index < keysSorted.length -1){
      return keysSorted[index+1];
    }
    return null;
  }

  getPrevKey = (key) => {
    const {keysSorted} = this.state;
    var index = keysSorted.indexOf(key);
    if(index > 0){
      return keysSorted[index-1];
    }
    return null;
  }

  onNext = () => {
    const {keysSorted} = this.state;
    var index = keysSorted.indexOf(this.state.fieldid);

    if(index < keysSorted.length -1){
      const nextId = keysSorted[index+1];
      const path = this.getDocumentPath() + "/t/" + nextId;
      this.props.history.push(path);
      //this.showFieldById(CONSTANTS.STATE_TRANSCRIBING, nextId);
    }

  }

  onPrev = () => {
    const {keysSorted} = this.state;
    var index = keysSorted.indexOf(this.state.fieldid);
    if(index > 0){
      const prevId = keysSorted[index-1];
      const path = this.getDocumentPath() + "/t/" + prevId;
      this.props.history.push(path);
      //this.showFieldById(CONSTANTS.STATE_TRANSCRIBING, prevId);
    }


  }

onResumeFinishClicked = () => {
  const { projectid, collectionid, user} = this.state;
  const { uid } = user;

  console.log("onResumeFinishClicked", projectid, collectionid, uid);

  this.dialogRef.getFirstDoc(projectid, uid, this.getDocumentPath());

}


  onRestart = () => {
    console.log("onRestart");
    const path = this.getDocumentPath() + "/";
    this.props.history.push(path);
  }

  onResume = () => {
    console.log("onResume");
    const path = this.getDocumentPath() + "/r/";
    this.props.history.push(path);
  }

  getDocumentPath = () => {
    const { projectid } = this.state;
    const { collectionid } = this.state;
    const { documentid } = this.state;
    return "/projects/" + projectid + "/" + collectionid + "/" + documentid
  }

  render() {
    const { projectid, collectionid, documentid, fieldid, user, userData } = this.state;
    console.log("USER", user);
    if(!user || !userData){
      console.log("FORDI BRUGEREN IKKE ER LOGGET IND");
      return (
        <div>
          {/*
          <Typography>Du skal være logget ind for at bidrage</Typography>
          */}
          <Login />
        </div>
      )
    }

    const { project, collection, document } = this.state;

    const { template } = this.state;
    const { transcriptions } = this.state;
    const { currTranscription } = this.state;
    const { templatefields } =  this.state;
    const { keysSorted } = this.state;

    let { mode } = this.state;
    if(mode !== "r") mode = "t";  // HVIS stateid === "r" (RESUME) -> t (TRANSCRIBE)

    const documentpath = this.getDocumentPath();


    if(!this.state.ready) {
      return (
        <div style={{padding:40}}>
          <code>Indlæser data ...</code>
          <p></p>
          <CircularProgress />
        </div>
      );
    }

    const fileReference = document.filePath;

    let fieldLinks = [];

    fieldLinks.push(<button key={"key_start"} onClick={this.onRestart} >onRestart</button>);
    for (var i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      fieldLinks.push( <button key={key} onClick={this.handleFieldLink(key)} >{key}</button> );
    }
    fieldLinks.push( <button key={"key_resume"} onClick={this.onResume} >resume</button> );


    //let { fieldid } = this.state;


    const fieldClickEnabled = mode === "r";
    //console.log("fieldClickEnabled", fieldClickEnabled);


    /*
    const debug =   <div style={{position:'absolute', zIndex:10}}>

                      <div style={{pointerEvents:'none'}}>
                        <code>mode: {mode}</code>
                        <code>transcriptionChanged: {""+this.state.transcriptionChanged}</code>
                        <code>projectid: {projectid}</code>
                        <code>collectionid: {collectionid}</code>
                        <code>documentId: {documentid}</code>

                        <code>fieldid: {fieldid}</code>
                        <code>userid: {this.props.user.uid}</code>
                        <code>path: {documentpath + "/" + fieldid }</code>

                      </div>
                      <div style={{maxWidth:540}}>
                        {fieldLinks}
                      </div>
                    </div>;
                    */


    const firstFieldPath = documentpath + "/t/" + keysSorted[0];

    const prevKey = this.getPrevKey(fieldid);
    const nextKey = this.getNextKey(fieldid);
    const prevFieldPath = prevKey ? documentpath + "/" + mode + "/" + prevKey : null;
    const nextFieldPath = nextKey ? documentpath + "/" + mode + "/" + nextKey : null;

    let showGuide = false;

    if(userData){
      console.log("userData.showGuide", userData.showGuide, user);
      showGuide = userData.showGuide === undefined || userData.showGuide === true;
    }
    console.log("showGuide", showGuide);

    return (
      <div style={{height:'100%'}} >


        <NextDocumentDialog history={this.props.history} ref={instance => { this.dialogRef = instance }} />

      {user && userData &&
        <Guide showGuide={showGuide} user={user} userData={userData} />
      }

        {/*process.env.REACT_APP_DEV === "true" && false  && debug*/}

        <div style={{display:'grid', gridTemplateColumns:'auto 485px', height:'100%', backgroundColor:'#313944'}}>

          <ImageContainer
            documentpath={documentpath + "/r"}
            collectionDocumentCount={collection.document_count}
            document={document}
            mode={mode}
            fieldid={fieldid}
            onFieldOver={fieldClickEnabled ? this.onFieldOver : null}
            onFieldOut={fieldClickEnabled ? this.onFieldOut: null}
            fileReference={fileReference}
            hoverField={this.state.hoverField}
            currTranscription={currTranscription}
            templatefields={templatefields}
             />

          {mode === "r" &&
            // RESUME
            //this.state.inputState === CONSTANTS.STATE_RESUME ?

              <ResumeContainer
                documentpath={documentpath + "/r"}
                projectid={projectid}
                collectionid={collectionid}
                documentid={documentid}
                fieldid={fieldid}
                keysSorted={keysSorted}
                currTranscription={currTranscription}

                onResumeFinishClicked={this.onResumeFinishClicked}
                onResumeBack={this.onResumeBack}
                onFieldOver={this.onFieldOver}
                onFieldOut={this.onFieldOut}
                onCancelEdit={this.onCancelEdit}
                onEditFieldSave={this.onEditFieldSave}
                updateTranscription={this.updateTranscription}
                onTranscriptionChange={this.onTranscriptionChange}

                userid={this.props.user.uid}
                document={document}
                template={template}
                transcriptions={transcriptions}
                hoverField={this.state.hoverField}
                errorMessage={this.state.errorMessage}

              />
            }

            {mode === "t"  &&
            // TRANSCRIBE
              <InputContainer
                firstFieldPath={firstFieldPath}
                fieldid={fieldid}
                currTranscription={currTranscription}
                template={template}
                templatefields={templatefields}
                project={project}
                collectionid={collectionid}

                document={document}
                transcriptions={transcriptions}
                keysSorted={keysSorted}
                nextFieldPath={nextFieldPath}
                prevFieldPath={prevFieldPath}
                onNext={this.onNext}
                onPrev={this.onPrev}
                onResume={this.onResume}
                updateTranscription={this.updateTranscription}
                onTranscriptionChange={this.onTranscriptionChange}

                errorMessage={this.state.errorMessage}
              />
            }


        </div>
      </div>

    );
  }

}
