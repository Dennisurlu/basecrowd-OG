import React from 'react';
import * as CONSTANTS from '../constants.js';
import Typography from '@material-ui/core/Typography';

const section = {
  width: '108',
  borderRadius: '13px',
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 6,
  paddingBottom: 6,
  color: 'white',
  opacity: .5,
  marginLeft: 10,
  marginRight: 10,
  //float: 'left',
  fontWeight:600,
  fontSize:11,
  height:28,
  alignSelf:''
}

const sectionBg = Object.assign({}, section);
sectionBg.background = '#23272c';
sectionBg.color = 'white';
sectionBg.opacity = 1;


export class StateHeader extends React.Component {


   constructor(props) {
     super(props);
     this.state = {}
   }

   componentWillReceiveProps(nextProps){

   }

  render() {
    const {inputState} = this.props;
    return (
      <div style={{height:90, alignItems:'center', display:'flex', justifyContent:'center'}}>
        <Typography style={inputState === CONSTANTS.STATE_TRANSCRIBING || inputState === CONSTANTS.STATE_START ? sectionBg : section}>
          Indtastning
        </Typography>
        <Typography style={inputState === CONSTANTS.STATE_RESUME ? sectionBg : section}>
          Resumé
        </Typography>
      </div>


    );
  }
}
