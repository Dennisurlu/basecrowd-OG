import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';


export class DocumentList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      documents:null
    }
  }

  componentDidMount(){
    this.loadDocuments()
  }

  loadDocuments = () => {
    const { projectid } = this.props.match.params;
    const { collectionid } = this.props.match.params;

    const userid = this.props.user ? this.props.user.uid : null;
    console.log("loadDocuments", projectid, userid);

    const projectRef = firebase.firestore().collection('projects').doc(projectid);
    const collectionRef = projectRef.collection('collections').doc(collectionid)
    const documentsRef = collectionRef.collection('documents')
    let project;
    const documents = {};

    projectRef.get()
    .then(doc => {
      project = doc.data();
      return documentsRef.get()
    }).then(querySnapshot => {
        querySnapshot.forEach(document => {
            var key = document.id;
            documents[key] = document.data();
        });
        return true;
    }).then(result => {
      console.log("SUKCES");
      this.setState({project:project, documents:documents})
    })

  }

  render() {
    console.log("RENDER");
    const { projectid } = this.props.match.params;
    const { collectionid } = this.props.match.params;
    const { documents, project } = this.state;

    const userid = this.props.user ? this.props.user.uid : null;
    //const userid = this.props.user.uid;

    var elms = [];

    const cell = {
      display:'table-cell',
      paddingLeft:10,
      color:'#3a3f46'
    }

    const cellTitle = {
      display:'table-cell',
      paddingLeft:10,
      whiteSpace:'nowrap',
      color:'#3a3f46'
    }


    if (!documents) {
      elms.push(<div key="sdf">
                  <p key="a" style={{color:'#3a3f46'}}>Indlæser dokument-samlinger</p>
                  <CircularProgress key="b" />
                </div>
                );
    } else {
      //console.log(Object.keys(documents));
      if(Object.keys(documents).length > 0){
        elms.push(<div style={{display:'table-row'}} key="header">
                    <div style={cell}>Id</div>
                    <div style={cell}>Index</div>
                    <div style={cell}>Template</div>
                    <div style={cell}>User complete</div>
                    <div style={cell}>Doc complete</div>
                    <div style={cell}>Fields complete</div>
                    <div style={cell}>Num users</div>
                    <div style={cell}>curr trans count</div>
                    <div style={cell}>curr trans count (timestamp)</div>
                    <div style={cell}>transcr blocked</div>
                  </div>);

          console.log("documents", documents);
        for(var key in documents){
          console.log("key", key);
          const doc = documents[key];
          var path = "/projects/" + projectid + "/" + collectionid + "/" + key;
          const userComplete = doc.userComplete ? doc.userComplete[userid] : "(undef)";
          const usersOnDocument = doc.currently_transcribing ? Object.keys(doc.currently_transcribing) : Object.keys(doc.currently_transcribing_timestamp);
          console.log("doc", doc);
          const fieldKeys = Object.keys(doc.fieldsComplete);
          const numFields = fieldKeys.length;
          let numFieldsComplete = 0;
          let strFieldsComplete = ""
          Object.entries(doc.fieldsComplete).forEach(
            ([key, value]) => {
              if(value)  numFieldsComplete++;
              strFieldsComplete += key + ":" + value + "\n";
            }

          );


          let strUserComplete = "";
          Object.entries(doc.userComplete).forEach(
            ([key, value]) => {
              strUserComplete += key + ":" + value + "\n";
            }
              //console.log(key, value)
          );



          //console.log(key, documents[key]);
          let showText = key;
          if(showText.length > 40){
            const l = key.length;
            showText = key.substring(0,20) + " … " + key.substring(l-14,l)
          }
          console.log("showText", showText);
          elms.push(<div style={{display:'table-row'}} key={key}>
                      <div style={cellTitle} title={key}><Link to={path} >{showText}</Link></div>
                      <div style={cell}>{doc.index}</div>
                      <div style={cell}>{doc.template_id}</div>
                      <div style={cell} title={strUserComplete}>{String(userComplete ? userComplete : 'false' )}</div>
                      <div style={cell}>{String(doc.complete ? doc.complete : 'false' )}</div>

                      <div style={cell} title={strFieldsComplete}>{numFieldsComplete} / {numFields}</div>

                      <div style={cell}>{usersOnDocument.length}</div>
                      <div style={cell}>{doc.currently_transcribing_count}</div>
                      <div style={cell}>{doc.currently_transcribing_count_by_timestamp}</div>
                      <div style={cell}>{String(doc.currently_transcribing_blocked ? doc.currently_transcribing_blocked : 'false')}</div>

            </div>);
        }
      } else {
        elms.push(<p key="none">Ingen tilgængelige dokumenter</p>);
      }

    }

    return (
        <div style={{backgroundColor:'#f6f6f6', height:'auto', minHeight:'100%', paddingTop:64}}>
          <Grid container direction="column" spacing={16} style={{ marginLeft:'auto', marginRight:'auto', width:600}}>
            <Grid item>
              <Typography variant="display1" gutterBottom style={{color:'#3a3f46'}} >Dokumenter</Typography>
              <Typography variant="subheading" gutterBottom style={{color:'#3a3f46'}} >Projekt: {project && project.title }</Typography>
              <Typography variant="subheading" gutterBottom style={{color:'#3a3f46'}} >Kasse: {collectionid }</Typography>
            </Grid>
            <div style={{display:'table'}}>
              {elms}
            </div>
          </Grid>
        </div>

    );
  }
}
