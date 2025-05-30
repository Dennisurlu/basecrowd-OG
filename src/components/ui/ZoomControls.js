import React from 'react';
import Grid from '@material-ui/core/Grid';
//import Tooltip from '@material-ui/core/Tooltip';
//import SearchPlus from 'mui-icons/fontawesome/search-plus';
//import SearchMinus from 'mui-icons/fontawesome/search-minus';
//import Expand from 'mui-icons/fontawesome/expand';

import { ZoomIn, ZoomOut, CropFree } from '@material-ui/icons';

export class ZoomControls extends React.Component {


   constructor(props) {
     super(props);
     //console.log("DotsStepper.CONSTRUCTOR");
     //console.log(props.activeStep, props.numSteps);

     this.state = {}

   }

   componentWillReceiveProps(nextProps) {
     //console.log(nextProps);
     //this.setState({showfield:nextProps.showfield});
   }

  render() {

    const container = {
      position: 'relative',
    }

    const bg = {
      width: 37,
      height: 37,
      opacity: 0.4,
      borderRadius: 2,
      backgroundColor: '#000000',
      margin: '0px 0px 0px 5px',
    }

    const icon = {
      color: '#ffffff',
      left: 11.5,
      top: 7,
      zIndex:1,
      position:'absolute',
      fontSize:32
    }

    //<SearchMinus style={icon} />
    //<SearchPlus style={icon} />
    //<Expand style={icon} />

    return (
          <Grid container spacing={8} justify='flex-start' alignItems='center'
            style={{paddingLeft:10}} >

            <Grid item style={container} onClick={this.props.onZoomOut}>
              <ZoomOut style={icon} />
              <div style={bg} ></div>
            </Grid>

            <Grid item style={container} onClick={this.props.onZoomIn}>
              <ZoomIn style={icon} />
              <div style={bg} ></div>
            </Grid>

            <Grid item style={container} onClick={this.props.onZoomReset}>
              <CropFree style={icon} />
              <div style={bg} ></div>
            </Grid>

          </Grid>
    );
  }
}
