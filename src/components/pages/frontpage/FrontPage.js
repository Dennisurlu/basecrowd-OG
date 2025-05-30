import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FrontPageTop } from 'components/pages/frontpage/FrontPageTop';
import { FrontPageProjects } from 'components/pages/frontpage/FrontPageProjects';
import { Sponsors } from 'components/pages/frontpage/Sponsors';

import { loadNextAvailableDocument } from 'components/utils/FirebaseUtils.js';

//import Mailchimp from 'react-mailchimp-form'
import Mailchimp from 'components/ui/MailChimp'


export class FrontPage extends React.Component {

  componentDidMount(){

  }





  onGetNextAvailableDocument = () => {
    console.log("onIntroGetForstDokument");
    const userid = this.props.user.uid;

    console.log("userid", userid);
    return loadNextAvailableDocument(userid).then(result => {
      console.log("RESULT", result);
      //
      if(result === undefined){
        alert("Error. loadNextAvailableDocument(" + userid + "). Result er undefined")
      } else {
        window.location.href = result;
      }
    }).catch(err => {
      console.log("ERR", err);
      alert(err);
    });
  }


  render() {
    //console.log(this.props);
    //const url = "//xxxx.us13.list-manage.com/subscribe/post?u=zefzefzef&id=fnfgn";

    return (
      <Grid container justify="center" direction="column" >
        <Grid item style={{backgroundColor:'#3a3f46', marginLeft:'auto', marginRight:'auto', width:'100%'}}>


          <FrontPageTop />

          {/*!this.props.user &&

            <Grid item>
              <Button onClick={this.props.openLoginModal} variant='raised' color="primary"
              style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', height:34}} >
              Login/opret bruger</Button>
            </Grid>
            */

          }

          <FrontPageProjects openLoginModal={this.props.openLoginModal} user={this.props.user} history={this.props.history} />

{/*
            <Button onClick={this.onGetNextAvailableDocument} variant='raised' color="primary"
            style={{marginLeft:'15px', marginRight:'15px', fontSize:11, fontWeight:600, color:'white', height:34}} >
            HENT LEDIGT DOKUMENT (knap slettes)</Button>
            */}
        </Grid>

        <Grid item>
          <Grid container justify="center" style={{backgroundColor:'rgb(246, 246, 246)'}}>
            <Grid item>
              <Mailchimp
             action='https://denspanskesyge.us16.list-manage.com/subscribe/post?u=40245ec2567ba155d7d1c3d87&amp;id=0dc12229b6'


             fields={[
               {
                 name: 'FNAME',
                 placeholder: 'Navn',
                 type: 'text',
                 required: true
               },
               {
                 name: 'EMAIL',
                 placeholder: 'Email',
                 type: 'email',
                 required: true
               }
             ]}
             />
           </Grid>
         </Grid>
        </Grid>

        <Grid item style={{width:'100%', height:'auto', marginLeft:'auto', marginRight:'auto', backgroundColor:'rgb(255, 255, 255)'}}>
          <Sponsors />
        </Grid>

      </Grid>

    );
  }
}
