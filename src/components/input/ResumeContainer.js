import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { DotsStepper } from 'components/ui/DotsStepper.js';
import { ResumeFieldList } from './ResumeFieldList.js';
import { UserInput } from './UserInput.js';
import PropTypes from 'prop-types';

 //import { loadNextAvailableDocument } from 'components/utils/loadNextAvailableDocument';

const info = {
  fontSize:14,
  fontWeight:300,
  textAlign:'center',
  paddingTop:20,
  paddingBottom:20,

}


const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },

  buttonSuccess: {
    backgroundColor: '#2acc79',
    '&:hover': {
      backgroundColor: '#2acc00',
    },
  },

  buttonProgress: {
    color: '#999999',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class ResumeContainer extends React.Component {

  state = {
    loading: false,
  };

   constructor(props) {
     super(props);

     this.state= {
       currTranscription:props.currTranscription,
       errorMessage:"",
      collectionid:props.collectionid

     }

   }

   componentWillReceiveProps(nextProps){
     this.setState({currTranscription:nextProps.currTranscription, errorMessage:nextProps.errorMessage})
   }

   onResumeFinishClicked = () => {

     this.setState({loading:true})
     console.log("onResumeFinishClicked");
     this.props.onResumeFinishClicked();

   }

   onEditFieldSave = () => {
     console.log("onEditFieldSave");
     if(this.isInputValid()){
      this.props.onEditFieldSave();
    }
   }

   isInputValid = () => {
     const { currTranscription } = this.state;
     if(currTranscription.value !== "" || currTranscription.empty || currTranscription.unreadable){
       return true;
     } else {
         alert("Du skal udfylde feltet eller vælge 'Tomt felt' eller 'Det kan jeg ikke læse'")
     }
   }

   onResumeBack = () => {
     console.log("onResumeBack");
     this.props.onResumeBack();
   }

   onCancelEdit = () => {
     this.props.onCancelEdit();
   }

  render() {

    const { fieldid } = this.props;
    const { loading, currTranscription } = this.state;

    //const numFields = Object.keys(this.props.keysSorted).length;
    //const field = this.template.fields[currFieldKey];

    //const activeStep = this.props.keysSorted.indexOf(fieldid);


    //const { classes } = this.props;



    return (

      <Grid container direction="column" justify="center" style={{backgroundColor:'#3a3f46'}} >
        <Grid item>
          <Grid container justify="center" style={{}}>
            <Grid item>
              <Typography variant="title" gutterBottom style={{textAlign:'center', paddingBottom:30 }} >Resume</Typography>

              {!fieldid ?
              [
              <ResumeFieldList key='a'
                documentpath={this.props.documentpath}
                keysSorted={this.props.keysSorted}
                hoverField={this.props.hoverField}
                onFieldOver={this.props.onFieldOver}
                onFieldOut={this.props.onFieldOut}
                onFieldClick={this.props.onFieldClick}
                userId={this.props.userid}
                transcriptions={this.props.transcriptions}
                templateFields={this.props.template.fields}

              />,


              <Typography key="info" style={info}>
                Klik på et felt for at redigere.<br/>Vælg 'Godkend og næste' hvis alt er korrekt.
              </Typography>
              ,

              <div key="button" style={{textAlign:'center'}} >
                <Button variant="raised" color="primary"
                  onClick={this.onResumeFinishClicked}
                  disabled={loading}
                  style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', height:34}} >GODKEND OG NÆSTE</Button>
              </div>

              ]
              :
              [
              <div key="d">
                <DotsStepper currFieldKey={fieldid} keysSorted={this.props.keysSorted} transcriptions={this.props.transcriptions} />
              </div>,

              <div key="e">
              <UserInput
                title={this.props.template.fields[fieldid].title}
                transcription={currTranscription}
                helptext={ this.props.template.fields[fieldid].helptext}
                updateTranscription={this.props.updateTranscription}
                onTranscriptionChange={this.props.onTranscriptionChange}
                errorMessage={this.state.errorMessage}
                onKeyComboRight={null}
                onKeyComboLeft={null}
              /></div>,


              <Grid container justify="center" key="f" >
                <Grid item>
                  <Link to={this.props.documentpath} style={{ textDecoration: 'none' }}>
                    <Button onClick={this.onCancelEdit} variant="raised" color="secondary" style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', width:'110px', height:34}} >
                      ANNULLÉR
                    </Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button onClick={this.onEditFieldSave} variant="raised" color="primary"
                    style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', height:34}}>GEM</Button>
                </Grid>
              </Grid>
              ]

            }

              </Grid>
            </Grid>
          </Grid>
      </Grid>
    );
  }
}


ResumeContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(ResumeContainer);
