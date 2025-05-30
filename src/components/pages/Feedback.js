import React from 'react';
import Typography from '@material-ui/core/Typography';

export class Feedback extends React.Component {

  /*
  constructor(props){
      super(props);
  }
  */


  componentDidMount(){

  }

  render() {

    return (
      <div style={{padding:26, paddingTop:60}}>
        <Typography variant="title">Hjælp / Kontakt</Typography>
        <p>Hvis du oplever fejl, problemer, har spørgsmål eller forslag så send meget gerne en mail til:
          <br/>
          <a href="mailto:support@basecrowd.dk" target="_top">support@basecrowd.dk</a>
        </p>
        <p>Det vil være en stor hjælp hvis du:</p>
        <ul>
          <li>Tydeligt beskriver fejlen</li>
          <li>Sender browseradressen på den side hvor du oplever fejlen</li>
        </ul>
      </div>

    );
  }
}
