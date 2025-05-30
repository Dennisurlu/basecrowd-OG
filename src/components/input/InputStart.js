import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

export class InputStart extends React.Component {


   constructor(props) {
     super(props);
     console.log("PROPS");
     console.log(props);
     this.state = {}
   }

  render() {

    return (
      <Grid container direction={'column'} alignItems={'center'} justify={'center'} spacing={0}>
        {/*
        <Grid item>
          <Typography style={{fonstSize:12, color:'#95a5a6'}}>
            {this.props.numFields} felter til indtastning
          </Typography>
        </Grid>
        */}
        <Grid item>
          <Typography align="center" style={{fontSize:35, paddingTop:24, paddingBottom:24, paddingLeft:54, paddingRight:54, fontWeight:300}}>
            Dødsattester
            </Typography>
            {/*this.props.title*/}
        </Grid>
        {/*
        <Grid item>
          <Typography align="center" style={{fontSize:14, paddingLeft:54, paddingRight:54, fontWeight:300}}>
            <i>{this.props.collectionid}</i>
          </Typography>
        </Grid>
        */}

        <Grid item>
          <Typography align="left" variant="body2" style={{paddingLeft:54, paddingRight:54}}>
            {/*this.props.description*/}
            De århusianske dødsattester fra 1916 til 1921 er vigtige af flere grunde. For det første for at fastslå præcis hvor mange århusianere der døde af Spanske Syge. Og for det andet i forhold til at kunne kortlægge pandemiens geografiske og sociale rute samt sociale profil. I dødsattesterne oplyses nemlig ikke blot afdødes navn og dødsårsagen. Men også afdødes adresse, alder, antal sygedage m.v. Hvormed dødsattesterne, da kun fåtal af byens borgere blev indlagt, er blandt de vigtigste indgangskilder til flertallet af dødsofrene for pandemien.
            <br/><br/>
            Sammenlagt er der, fra perioden 1916 til 1921, bevaret 5.830 dødsattester. Attesterne er blevet affotograferet af Jørgen Kristensen og hans team frivillige fra Rigsarkivet. Vi er jer meget taknemmelige.
            <br/><br/>
            Når projektet er færdigt, overføres samtlige indtastninger til Aarhus Stadsarkiv til publiceringen på aarhusarkivet.
            <br/><br/>
            Igen; har du spørgsmål, ris, ros, forslag til forbedringer i arbejdsprocessen eller kommentar, opfordrer vi til, at du kontakter os på <a href="mailto:skp@basecrowd.dk">skp@basecrowd.dk</a>.
          </Typography>

        </Grid>
        <Grid item style={{padding:40}}>
          <Link to={this.props.firstFieldPath}>
            <Button  variant='raised' color="primary"
              style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', width:'110px', height:34}} >START</Button>
            </Link>
          </Grid>
      </Grid>
    );
  }
}
//onClick={this.props.onStart}
