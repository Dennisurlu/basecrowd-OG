import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export class DotsStepper extends React.Component {


   constructor(props) {
     super(props);
     this.state = {
       fieldid:props.fieldid
     };
   }

   componentWillReceiveProps(nextProps) {
     if(nextProps.fieldid !== this.state.fieldid){
       this.setState({fieldid:nextProps.fieldid})
     }
   }

   shouldComponentUpdate(nextProps, nextState) {
     return this.state.fieldid !== nextProps.fieldid
   }

  render() {


    const { keysSorted, transcriptions, fieldid } = this.props;
    if(keysSorted.length < 2){
      return (<div></div>)
    }


    const few = keysSorted.length < 15;
    const size = few ? 10 : 4;
    const margin = few ? 6 : 2;

    const checked = {
      width: size,
      height:size,
      borderRadius: size,
      background: '#222222',
      margin:margin,
      display: 'inline-block',
      position: 'relative'
    }

    let stepItems = [];

    let activeStep = keysSorted.indexOf(fieldid) + 1;





    // vis kun dots hvis færre end 30
    if(keysSorted.length < 30){

      for (var i = 0;i<keysSorted.length;i++) {
        const key = keysSorted[i];
        const transcription = transcriptions[key];
        let style =  Object.assign({}, checked);

        if(transcription){
          if(transcription.empty || transcription.unreadable || transcription.value.length > 0) {
              style.background = '#3CB371';
          } else {
            style.background = '#000000';
          }

        }

        if(key === fieldid){
          style.border = '1px solid #FFF';
        }
        stepItems.push ( <Grid key={key} style={style}></Grid> );

      }
    }
    stepItems.push ( <Typography key="qwerty" style={{fontSize:12, color:'#95a5a6', paddingTop:8, position:'relative', top:-4, left:6}}>
                        {activeStep}/{keysSorted.length}
                        </Typography> );

    return (
      <div style={{padding:5, paddingBottom:20}}>

          <Grid container alignItems='center' justify="center" spacing={8} direction='row' >
              { stepItems }
          </Grid>


        </div>


          );
  }
}
