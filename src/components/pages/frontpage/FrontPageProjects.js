import React from 'react';
import firebase from 'firebase/app';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ProjectItem } from 'components/pages/frontpage/ProjectItem';

import { NextDocumentDialog } from 'components/ui/NextDocumentDialog.js';


export class FrontPageProjects extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user:props.user,
      projects:[],
      projectItems:[],
      projectImages:['/images/front/project_01.jpg', '/images/front/project_02.jpg', '/images/front/project_03.jpg' ]
    }

  }

  componentWillReceiveProps(nextProps){

    if(nextProps.user !== this.state.user){
      this.updateProjects(this.state.projects, nextProps.user)
    }
  }


  componentDidMount(){
    this.loadProjects();
  }

  joinAndStartProject = (projectid, userProjectComplete) => {
    const { uid } = this.state.user;
    this.dialogRef.joinAndStartProject(projectid, uid, userProjectComplete )
  }




  loadProjects = () =>  {
    const isProduction = process.env.NODE_ENV === "production";

    let ref = firebase.firestore().collection('projects')
    if(isProduction){
      ref = ref.where('enabled', '==', true)
    }
    ref = ref.orderBy('sortindex');

    const projects = [];

    ref.get()
    .then(querySnapshot => {
      const { user } = this.state;
      //let userid = user ? user.uid : null;
      querySnapshot.forEach(item => {
        //console.log(project.id, " => ", project.data());
        let project = item.data();
        project.key = item.id;
        projects.push(project);
      });
      this.updateProjects(projects, user)
    })
    .catch(function(error) {
        console.error("Error loading projects: ", error);
    });
  }

  updateProjects = (projects, user) =>{
    const { projectImages } = this.state;
    let userid = user ? user.uid : null;
    //console.log("updateProjects", user);
    const projectItems = [];
    for (var i = 0; i < projects.length; i++) {
      const imageUrl = projectImages[i%projectImages.length];
      projectItems.push(<ProjectItem imageUrl={imageUrl} joinAndStartProject={this.joinAndStartProject} openLoginModal={this.props.openLoginModal} key={projects[i].key} userid={userid} data={projects[i]} />);
    }
    this.setState({projectItems:projectItems, user:user, projects:projects})
  }

  render() {
    const { projectItems } = this.state;

    return (
      <div>
        <NextDocumentDialog history={this.props.history} ref={instance => { this.dialogRef = instance }} />


        <Grid container justify={"center"} style={{ backgroundColor:'#f6f6f6', paddingTop:64, paddingBottom:32}}>


          { projectItems.length === 0 &&
          <Grid item>
            <p style={{color:'#3a3f46'}}>Indlæser projekter ...</p>
            <CircularProgress />
          </Grid>
          }
          { projectItems }
        </Grid>
      </div>

    );
  }
}
