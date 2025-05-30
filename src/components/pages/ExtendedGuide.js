import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

export class ExtendedGuide extends Component {
  constructor(props){
    super(props);
    this.state =  {
      open:props.showExtendedGuide,
    };
  }



  render() {
    return (
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={true}
          onClose={this.props.handleClose}
        >
          <Paper style={{width:'80%', maxWidth:600, marginLeft:'auto', marginRight:'auto', marginTop:60, padding:40}}>
            <Typography gutterBottom variant="headline">
              Udvidet guide
            </Typography>

            <Typography variant="body1">
            Med "skriv hvad der står" menes:
            </Typography>
            <ul>
              <li>Bevar stavemåder, stavefejl og forkortelser i teksten, (inkl. person- og stednavne). Også selvom de forekommer forkerte.</li>
              <li>Bevar kommateringer som angivet i teksten. Også selvom de forekommer forkerte.</li>
              <li>Bevar linjeskift i teksten.</li>
              <li>Er der ét eller flere ord i teksten, som du ikke kan læse efterlades feltet helt tomt, og boksen ”det kan jeg ikke læses” markeres.</li>
              <li>Er tekstfeltet tomt markeres dette ved sætte kryds i ”Feltet er tomt”.</li>
              <li>Særligt for dødsattesterne; På nogle attester er der tilføjet nogle blå tal. Disse skal ikke indtastes.</li>
              <li>Vi opfordrer til at du indtaster hele dokumentet, men at dette ikke er slet ikke et krav. Vi er taknemlige for alle bidrag.</li>

            </ul>

          <Typography variant="body1" gutterBottom >
          Har du spørgsmål, er du selvfølge altid velkommen til at skrive til os på <a href="mailto:support@basecrowd.dk" target="_top">support@basecrowd.dk</a>. Eller ved at kontakte os via vores chat som du finder nederst i højre hjørne.
            </Typography>
            <Button style={{marginTop:20}} variant="contained" color="primary" onClick={this.props.handleClose}>Luk</Button>
          </Paper>
        </Modal>

    );
  }

}
