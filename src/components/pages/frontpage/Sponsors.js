import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export class Sponsors extends React.Component {

  state = {
    sponsors:[
      {image:'/images/sponsors/arhusstads.png', id:'aarhusstads', url:'https://stadsarkiv.aarhus.dk/'},
      {image:'/images/sponsors/auh.png', id:'auh', url:'http://www.auh.dk/'},
      {image:'/images/sponsors/augustinus_fonden_logoet.png', id:'augustinusfonden', url:'https://augustinusfonden.dk/'},
      {image:'/images/sponsors/byhistoriskefond.png', id:'byhistoriskefond', url:'http://www.byhistorisk.dk/'},
      {image:'/images/sponsors/MicaFonden.png', id:'MicaFonden' }

    ]
  }

  componentDidMount(){
  }

  render() {

    return (
      <div style={{padding:24}}>

        <Typography variant="caption" gutterBottom align="center" style={{color:'#000'}}>
          Sponsorer
          </Typography>
        <Grid container justify="center" spacing={40} style={{padding:24}}>
          {this.state.sponsors.map(sponsor => (
            <Sponsor key={sponsor.id} sponsor={sponsor} />

         ))}
        </Grid>
      </div>

    );
  }
}

class Sponsor extends React.Component {

  render() {
    const { sponsor }  = this.props;
    return (
      <Grid key={sponsor.id} item>

          <a href={sponsor.url} target='_blank' >
            <div style={{width:'auto', height:'auto'}}>
              <img border="0" style={{ maxHeight:100, maxWidth:300 }} src={sponsor.image} alt={sponsor.id} />
            </div>
          </a>
            {/* <Paper style={{padding:10}}></Paper> */}
      </Grid>
    )
  }
}
