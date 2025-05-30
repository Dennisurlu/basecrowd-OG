
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { loadUiMessages } from 'components/utils/FirebaseUtils.js';


let isIE = /*@cc_on!@*/false || !!document.documentMode;
//console.log("isIE", isIE);

export class UiMessages extends React.Component {

  constructor() {
    super();
    this.state = {
      messages:[],
      expandMessages:false
    };
  }

  componentDidMount(){
    loadUiMessages()
    .then(snapShot => {
      if(snapShot){
        const messages = [];
        snapShot.forEach((doc) => {
          messages.push(doc.data().message)
        });
        if(isIE) messages.push("- Vi anbefaler at du bruger Chrome eller Firefox!")
        if(messages.length > 0) this.setState({messages:messages, expandMessages:true})
      }

    })

  }

  hideMessages = () => {
    this.setState({expandMessages:false})
  }


  render (){
    const { messages, expandMessages } = this.state;
    return (
      <Collapse timeout={600} in={expandMessages} collapsedHeight={"0px"}>
      {messages.length > 0 &&
      <Grid container direction="column" style={{padding:16, backgroundColor:'#000'}}>
        <Grid item>
        <Typography component="h2" variant="headline" gutterBottom>
          Systemstatus!!!
          </Typography>

        </Grid>
        {

        messages.map((message) =>
          <Grid item key="a" dangerouslySetInnerHTML={{ __html: message }}></Grid>
        )
        }
        <Grid item style={{padding:16}}>
          <Button variant='raised' color="primary" onClick={this.hideMessages} >OK</Button>
        </Grid>

      </Grid>
      }
      </Collapse>

    )
  }
}
