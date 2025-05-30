import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

export class ProjectList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.loadProjects();
  }

  //  this.state = {imgSrc:"http://via.placeholder.com/350x150"};
  loadProjects = () =>  {
    //console.log("loadProjects");
    //.where('released_for_transcription', '==', true)
    const isProduction = process.env.NODE_ENV === "production";

    const projects = [];
    let ref = firebase.firestore().collection('projects');
    if(isProduction) ref = ref.where('released_for_transcription', '==', true);
    ref.get()
    .then(querySnapshot => {
        querySnapshot.forEach(project => {
          var key = project.id;
          projects[key] = project.data();
        });
        this.setState({projects:projects});
    })
    .catch(function(error) {
        console.error("Error getting templates: ", error);
    });
  }


  render() {
    const { projects } = this.state;

    const style = {
      color:'#3a3f46'
    }
    var elms = [];
    if (projects) {
      for(var key in projects){
        var path = "/projects/" + key;
        elms.push(<Grid item key={key}>
                    <Link to={path} >{projects[key].title}</Link>
                    <br/><span style={style}>Afsluttet: {projects[key].complete ? "Ja" : "Nej"}</span>
                    <br/><span style={style}>Afsluttet for brugeren: ?????</span>
                    <br/><span style={style}>Antal dokumenter: {projects[key].document_count}</span>
                    <br/><span style={style}>Færdige dokumenter: {projects[key].complete_count}</span>
                  </Grid>);
      }
    }

    return (
      <div style={{backgroundColor:'#f6f6f6', height:'100%', paddingTop:64}}>
        <Grid container spacing={16} direction="column" style={{ marginLeft:'auto', marginRight:'auto', width:600}}>
          <Grid item>
            <Typography variant="display1" gutterBottom style={{color:'#3a3f46'}} >Projekter</Typography>
            <Typography variant="body1" gutterBottom style={{color:'#3a3f46'}} >Klik på et projekt</Typography>
          </Grid>
          {!projects &&
            <div>
              <Typography variant="body1" style={{color:'#3a3f46'}} >Indlæser projekter</Typography>
              <CircularProgress />
            </div>
          }
          <Grid item>


          {projects ?
            <Grid container spacing={8} direction="column">
              {elms}
            </Grid>
             :
            <p>loading</p>
           }
         </Grid>
       </Grid>
    </div>

    );
  }
}
