import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

export class CollectionList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.loadCollections();
  }

  //  this.state = {imgSrc:"http://via.placeholder.com/350x150"};
  loadCollections = () =>  {
    const {projectid} = this.props.match.params;

    let collections = [];
    let project;

    const projectRef = firebase.firestore().collection('projects').doc(projectid);
    projectRef.get()
    .then(doc => {
      project = doc.data();
      return project
    }).then(project => {
      let collectionsRef = firebase.firestore().collection('projects').doc(projectid).collection('collections');
      collectionsRef.get()
      .then(querySnapshot => {
          querySnapshot.forEach(collection => {
              //console.log(project.id, " => ", project.data());
              var key = collection.id;
              collections[key] = collection.data();
          });
          return true;
      }).then(result => {
          this.setState({collections:collections, project:project});
      })
    })

  }

  render() {
    const { projectid } = this.props.match.params;
    const { collections, project } = this.state;
    const userid = this.props.user ? this.props.user.uid : null;
    const cell = {
      display:'table-cell',
      paddingLeft:10,
      color:'#3a3f46'
    }

    var elms = [];

    if (!collections) {
      elms.push(<p key="a" style={{color:'#3a3f46'}}>Indlæser dokument-kasser ...</p>);
      elms.push(<CircularProgress key="b" />);
    } else {
      if(Object.keys(collections).length > 0){

        elms.push(<div style={{display:'table-row'}} key="header">
                    <div style={cell}></div>
                    <div style={cell}>Antal</div>
                    <div style={cell}>Færdige</div>
                    <div style={cell}>Afsluttet</div>
                    <div style={cell}>Du er færdig</div>
                    <div style={cell}>Bruger oprettet</div>
                    {/*
                      <div style={cell}>Released</div>
                    */}
                  </div>);


        for(var key in collections){
          var path = "/projects/" + projectid + "/" + key;
          const collection = collections[key];

          let userColletionStatus = "undefined"
          let userComplete = false;
          if(userid && collection.userComplete){
            if(collection.userComplete[userid] === true) userComplete = true;

            if(collection.userComplete.hasOwnProperty(userid)){
              console.log("collection.userComplete[userid]", collection.userComplete[userid]);
              console.log(collection.userComplete);
              userColletionStatus = String(collection.userComplete[userid])
            }

          }
          //console.log(key, collections[key]);
          //elms.push(<div key={key}><p >Samling: <Link to={path} >{key} - {collections[key].complete_count} af {collections[key].document_count}</Link></p></div>);

            elms.push(<div style={{display:'table-row'}} key={key}>
                        <div style={cell}><Link to={path} >{key}</Link></div>
                        <div style={cell}>{collection.document_count}</div>
                        <div style={cell}>{collection.complete_count}</div>
                        <div style={cell}>{String(collection.complete ? collection.complete : 'false' )}</div>
                        <div style={cell}>{String(userComplete ? userComplete : 'false' )}</div>
                        <div style={cell}>{userColletionStatus}</div>
                        {/*
                        <div style={cell}>{String(collection.released_for_transcription ? collection.released_for_transcription : 'false' )}</div>
                        */}


              </div>);


        }
      } else {
        elms.push(<p>Ingen tilgængelige collections for denne bruger i dette projekt</p>);
      }

    }


    return (
      <div style={{backgroundColor:'#f6f6f6', height:'auto', minHeight:'100%', paddingTop:64}}>
        <Grid container direction="column" style={{ marginLeft:'auto', marginRight:'auto', width:600}}>
          {project &&
          <Grid item>
            <Typography variant="subheading" style={{color:'#3a3f46'}}>Dokument-kasser</Typography>
            <Typography variant="display1" gutterBottom style={{color:'#3a3f46'}} >{this.state.project.title}</Typography>
            <Typography variant="body1" gutterBottom style={{color:'#3a3f46'}} >Klik på en kasse</Typography>

          </Grid>
          }
          <Grid item>
            <div style={{display:'table'}}>
              {elms}
            </div>
          </Grid>

        </Grid>
      </div>

    );
  }
}
