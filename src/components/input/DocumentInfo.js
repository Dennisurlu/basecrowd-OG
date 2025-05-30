import React from 'react';
import Typography from '@material-ui/core/Typography';

export class DocumentInfo extends React.Component {

   constructor(props) {
     super(props);
     this.state = {}
   }

  render() {
    const {id, collectionid} = this.props;
    return (
      <div style={{padding:20}}>
      {
        /*
        <Typography style={{marginTop:0, fontSize:18, fontWeight:300, textAlign:'center', padding:0}}>
          Dødsattest
        </Typography>
        */
      }

        <Typography style={{color:'#ffffff', marginBottom:10, fontSize:10, fontWeight:'bold', textAlign:'center', width:200}}>
          ID:&nbsp;{collectionid} / {id}
        </Typography>

      </div>
    );
  }
}
