import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ProjectList } from 'components/projects/ProjectList.js';
import { CollectionList } from 'components/projects/CollectionList.js';
import { DocumentList } from 'components/projects/DocumentList.js';
import Document from 'components/document/Document.js';

export default class Projects extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user:props.user,
      userData:props.userData
    };
  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){
    this.setState({user:nextProps.user, userData:nextProps.userData})
  }

  render() {
    const { user, userData } = this.state;

    return (
      [


          <Router key="router" />,
            <Switch key="proj-doc-collection">
              <Route path="/projects/:projectid/:collectionid/:documentid/:mode/:fieldid" render={(props) =>  <Document user={user} userData={userData} {...props} /> } />
              <Route path="/projects/:projectid/:collectionid/:documentid/:mode" render={(props) =>           <Document user={user} userData={userData} {...props} /> } />
              <Route path="/projects/:projectid/:collectionid/:documentid" render={(props) =>                 <Document user={user} userData={userData} {...props} /> } />
              <Route path="/projects/:projectid/:collectionid" render={(props) =>                             <DocumentList user={user} {...props} /> } />
              <Route path="/projects/:projectid" render={(props) => <CollectionList user={user} {...props} /> } />
              <Route path="/projects" render={(props) => <ProjectList {...props} /> } />

            </Switch>

        ]

    );
  }
}
