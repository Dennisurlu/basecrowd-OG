import React from 'react';

import { getFirstAvailDocumentInProject } from 'components/utils/FirebaseUtils.js';
import { createUserOnProject } from 'components/utils/FirebaseUtils.js';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';

export class NextDocumentDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open:false,
      title:"",
      text:"",
      error:false,
      documentpath:props.documentpath
    }
  }

  joinAndStartProject = (projectid, uid, userProjectComplete) => {
    //this.dialogRef.joinAndStartProject(projectid, uid, userProjectComplete )
    console.log("joinAndStartProject", projectid, uid, userProjectComplete);

    if(userProjectComplete === null){
      this.setState({open:true, title:"Opretter på projekt", text:"Vent venligst mens vi opretter dig på projektet</br>Dette kan tage flere minutter.</BR>Du må ikke lukke browseren."})
      return createUserOnProject(projectid, uid)
      .then(result => {
        console.log("USER CREATED ON PROJECT", result);
        //this.loadProjects();
        this.getFirstDoc(projectid, uid)
      }).catch(err => {
        console.error("der opstod en fejl");
      })
    } else {
      console.log("USER ALREADY EXISTS");
      this.getFirstDoc(projectid, uid)
    }

  }

  getFirstDoc(projectid, uid, currDocumentPath){
    console.log("getFirstDoc", projectid, uid, currDocumentPath);
    this.setState({open:true, title:"Henter først dokument", text:"Vent venligst mens vi henter næste ledige dokument."});
    setTimeout(() => {
       return getFirstAvailDocumentInProject(projectid, uid)
       .then(result => {
         console.log("result", result);
         this.setState({open:false});
         this.props.history.push(result);
         //window.location.href = result;

         return true;
       }).catch(error => {
         console.log("error", error);
          this.setState({open:true, title:"Hurra / hovsa", text:error, error:true});

       })
     }, 1000);

  }



  render() {
    const { open, title, text, error } = this.state;
    return (
      <Dialog open={open} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <DialogContent>
         <DialogContentText id="alert-dialog-description" dangerouslySetInnerHTML={{ __html: text }}>
         </DialogContentText>
         <br/>
         {!error ?
           <LinearProgress />
           :
           <Button variant="raised" color="primary"
             href="/"
             style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', height:34}} >Til forsiden</Button>

         }
       </DialogContent>
      </Dialog>
    )
  }
}
