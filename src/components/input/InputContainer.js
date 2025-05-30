import React, { Component } from 'react';
import { DotsStepper } from 'components/ui/DotsStepper.js';
import { InputStart } from './InputStart.js';
//import { DocumentInfo } from './DocumentInfo.js';
//import { StateHeader } from './StateHeader.js';

import { UserInput } from './UserInput.js';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
//import * as CONSTANTS from '../constants.js';

const arrowButtonEnabled = {
  width:34,
  height:34,
  backgroundColor:'#21272d',
  minWidth:34,
  borderRadius:18,
  tabIndex:-1
}
const arrowButtonDisabled = {
  width:34,
  height:34,
  backgroundColor:'#21272d',
  minWidth:34,
  opacity:.25,
  borderRadius:18
}

const nextButtonDisabled = {
  width:34,
  height:34,
  backgroundColor:'#21272d',
  minWidth:34,
  opacity:.0,
  borderRadius:18
}

export class InputContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currTranscription:props.currTranscription,
      project:props.project,
      transcriptions:props.transcriptions,
      templatefields:props.templatefields,
      fieldid:props.fieldid,
      templatefield:{},
      dataChanged:false,
      errorMessage:"",
      firstFieldPath:props.firstFieldPath,
      collectionid:props.collectionid
    };

  }

  componentWillReceiveProps(nextProps) {
    const { fieldid } = nextProps;
    const { templatefields } = this.state;

    this.setState({currTranscription:nextProps.currTranscription,
                    fieldid:fieldid,
                    templatefield:templatefields[fieldid],
                    errorMessage:nextProps.errorMessage,
                    transcriptions:nextProps.transcriptions,
                    firstFieldPath:nextProps.firstFieldPath
                  });
  }



  onNext = () => {
    if(this.isInputValid()) {
      this.props.onNext();
    }
  }



  onPrev = () => {
    //if(this.isInputValid()) {
      this.props.onPrev();
    //}
  }


  onResume = () => {
    if(this.isInputValid()) {
      this.props.onResume();
    }
  }

  isInputValid = () => {
    const { currTranscription } = this.state;
    if(currTranscription.value !== "" || currTranscription.empty || currTranscription.unreadable){
      this.setState({errorMessage:""})
      return true;
    } else {
      this.setState({errorMessage:"Du skal udfylde teksten eller vælge 'Tomt felt' eller 'Det kan jeg ikke læse'"})
    }
  }

  getTranscriptionByFieldKey = (fieldid) => {
    const { transcriptions } = this.props;
    for (var key in transcriptions) {
      const t = transcriptions[key];
      if(t.fieldid === fieldid) {
        return t;
      }
    }
    return null;
  }

  render() {
    const { keysSorted } = this.props;
    const { currTranscription, fieldid, templatefields }  = this.state;

    const activeStep = keysSorted.indexOf(fieldid);

    const prevEnabled = activeStep > 0;
    const nextEnabled = activeStep < Object.keys(templatefields).length -1;
    const lastField = !nextEnabled;
    const field = templatefields[fieldid];


    const fieldsComplete = [];
    for (var i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      const transcription = this.getTranscriptionByFieldKey(key);
      if(transcription && transcription.complete){
        fieldsComplete.push(true);
      } else {
        fieldsComplete.push(false);
      }

    }

    /*
    console.log("activeStep", activeStep);
    console.log("field", field);
    console.log("fieldid", fieldid);
    console.log("collectionid", collectionid);
    */

    return (

      <Grid container direction="column" justify="center" style={{}} >
      {/*
      <div id="inputcontainer"
            style={{backgroundColor:'#3a3f46', display:'flex', alignItems:'center', flexDirection:'column'}}>
            */}

        { !currTranscription  ?
          <Grid item>
            <InputStart
              firstFieldPath={this.state.firstFieldPath}
              numFields={Object.keys(templatefields).length}
              title={this.state.project.title}
              collectionid={this.props.collectionid}
              description={this.state.project.description}
              //onStart={this.props.onStart}
               />
           </Grid>
        :

        <Grid item>

            {/*
              <StateHeader inputState={CONSTANTS.STATE_TRANSCRIBING} />
              <DocumentInfo id={this.props.document.image_id} collectionid={collectionid} />
            */}
            <Grid container justify="center" style={{}}>
              <Grid item>
                <DotsStepper fieldid={fieldid} keysSorted={keysSorted} transcriptions={this.state.transcriptions} />
              </Grid>
            </Grid>

            <UserInput
              title={field.title}
              transcription={currTranscription}
              helptext={this.state.templatefield.helptext}
              updateTranscription={this.props.updateTranscription}
              onTranscriptionChange={this.props.onTranscriptionChange}
              errorMessage={this.state.errorMessage}
              onKeyComboRight={lastField ? this.onResume : this.onNext}
              onKeyComboLeft={prevEnabled ? this.onPrev : null}

              />



              {/*
            <div style={{justifyContent:'center', display:'flex', flexDirection:'row', paddingTop:20}}>
            */}

            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item>
                <Button tabIndex={-1} onClick={this.onPrev} disabled={!prevEnabled} style={prevEnabled ? arrowButtonEnabled : arrowButtonDisabled}><KeyboardArrowLeft style={{color:'white'}} />
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={lastField ? this.onResume : this.onNext} variant='raised' color="primary"
                style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', width:'110px', height:34}} >{lastField ? "RESUMÉ" : "NÆSTE"}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={this.onNext} disabled={!nextEnabled} style={nextEnabled ? arrowButtonEnabled : nextButtonDisabled}><KeyboardArrowRight style={{color:'white'}}/>
                </Button>
              </Grid>
            </Grid>




            {/*
            <Grid item>
              <Button onClick={this.onSaveClicked()} style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', width:'110px', height:34}} raised >TEST GEM</Button>
            </Grid>
            <Grid item>
              <Button onClick={this.onFinishClicked()} style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', width:'110px', height:34}} raised >TEST AFSLUT</Button>
            </Grid>
            */}



        </Grid>

      }

      </Grid>

    );
  }
}
