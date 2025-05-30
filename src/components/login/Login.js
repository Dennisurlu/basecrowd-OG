import React from 'react';
import firebase from 'firebase/app';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class Login extends React.Component {

  state = {
    email:process.env.REACT_APP_LOGIN_USER,
    password:process.env.REACT_APP_LOGIN_PASS,
    error:"",
    tabindex:0,
    termsAccepted:false,
    termsOpened:false
  };

  onError = msg => {
   this.setState({ error: msg });
 };


  componentDidMount(){

  }
  // LOGIN
  // LOGIN
  // LOGIN
  handleLoginSubmit = event => {
    if(event) event.preventDefault();
    this.onError("");
    console.log("handleLoginSubmit", this.state.email, this.state.password);

    if(this.state.email === "") {
      this.onError("'Brugernavn' skal være udfyldt");
      return;
    } else if(this.state.password === "") {
        this.onError("'Password' skal være udfyldt");
        return;
    } else if (!this.state.termsAccepted) {
      this.onError("Du skal acceptere ejerskabforhold");
      return;
    }

    this.requestLogin();

  }

  resetPassword = () => {
    console.log("resetPassword");
    const { email } = this.state;
    this.onError("");
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Email sent.
      alert("en email med et nyt password er afsendt")
    }).catch(error => {
      // An error happened.
      this.onError(error.message)
    });

  }
  handleCreateUser = () => {
    const { email } = this.state;
    const { password } = this.state;
    console.log("handleCreateUser", email, password);
    this.onError("");

    if (!this.state.termsAccepted) {
     this.onError("Du skal acceptere ejerskabforhold");
     return;
   }

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((authData) => {
      console.log("User created successfully with payload-", authData);
      //Write code to use authData to add to Users
      this.handleLoginSubmit();
    }).catch(error => {
      console.log("Login Failed!", error);
      this.onError(error.message);
    })

  }

   requestLogin = () => {
     const {email} = this.state;
     const {password} = this.state;

     console.log("requestLogin", email, password);
     const promise = firebase.auth().signInWithEmailAndPassword(email, password);
     promise.catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        let errorMessage = error.message;
        if(errorCode === "auth/user-not-found"){
          errorMessage = "Der findes ingen bruger med den angivne email.";
        } else if(errorCode === "auth/wrong-password"){
          errorMessage = "Passwordet er ugyldigt eller brugeren har intet password.";
        }
        //var errorMessage = error.message;
        console.log("errorCode", errorCode);

        this.onError(errorMessage);
      });
   }

  handleChange = name => event => {
    //console.log("handleChange", name, event.target.value);
   this.setState({ [name]: event.target.value });
  };

  handleAcceptChange = () => {
    console.log("handleAcceptChange");
    this.setState({ termsAccepted:!this.state.termsAccepted});
  }
  handleTabChange = (event, tabindex) => {
    this.setState({ tabindex });
  };

  toggleTerms = () => {
    this.setState({termsOpened:!this.state.termsOpened})
  }

  render(){

    const { tabindex } = this.state;

    return (
      <Grid container justify={"center"} style={{padding:20}}>

        <Paper style={{justify:"center", width:400, padding:0, backgroundColor:'rgb(35, 39, 44)'}}>
            <AppBar position="static">
              <Tabs fullWidth
                value={tabindex} onChange={this.handleTabChange}>
                <Tab label="Log ind" />
                <Tab label="Opret bruger" />
              </Tabs>
            </AppBar>



            <Grid item xs={12} style={{padding:20}}>
            {tabindex === 0 ? "Log ind" : "Opret bruger" }


              <form>

                 <Grid item>
                    <TextField
                              style={{
                                width:300
                              }}
                              id="name"
                              label="Brugernavn (email)"
                              value={this.state.email}
                              onChange={this.handleChange('email')}
                              margin="normal"
                            />
                            </Grid>
                    <Grid item>
                    <TextField
                              id="pass"
                              label="Password"
                              type="password"
                              autoComplete="current-password"

                              style={{
                                width:300}}
                              value={this.state.password}
                              onChange={this.handleChange('password')}
                              margin="normal"
                            />
                      </Grid>
                      <Grid item>
                      <FormControlLabel
                                control={
                                  <Checkbox id="acceptterms"
                                    checked={this.state.termsAccepted}
                                    onChange={this.handleAcceptChange}
                                    value="termsAccepted"
                                  />
                                }
                                label={(
                                    <label htmlFor={"acceptterms"}>
                                    Acceptér ejerskabforhold på data
                                    </label>
                                    )}

                              />
                              {!this.state.termsOpened &&
                                <span style={{size:12, zIndex:3, cursor:'pointer'}} onClick={this.toggleTerms}><u>(læs vilkår)</u></span>
                              }
                              { this.state.termsOpened &&
                                <div>
                                  <ul>
                                    <li>Alle indtastninger stilles frit og gratis til rådighed, så alle kan bruge dem. </li>
                                    <li>Basecrowd fører ikke kontrol med til hvilke formål data bruges. Vi opfordre dog til at lave kildehenvisninger.</li>
                                    <li>Basecrowd forbeholder sig ret til at foretage ændringer i indtastningerne i forbindelse med kvalitetssikring af indtastningerne.</li>
                                    <li>Du kan altid stoppe med at bidrage til projektet, men du kan ikke forlange at få de data, du har tilføjet slettet.</li>

                                  </ul>
                                  <p style={{zIndex:3, cursor:'pointer'}} onClick={this.toggleTerms}><u>Skjul vilkår</u></p>
                                </div>
                              }


                      </Grid>

                      {!this.props.user ?

                        <Grid item>
                          {tabindex === 0 ?
                          <Button variant='raised' color="primary"  onClick={this.handleLoginSubmit} label="login">Log ind</Button>
                          :
                          <Button variant='raised' color="primary"  onClick={this.handleCreateUser} label="login">Opret bruger</Button>
                          }
                        </Grid>
                        :
                        <Grid item>
                          <Button variant='raised' color="primary" onClick={this.logOut} label="Log ud">
                            Log ud
                          </Button>
                        </Grid>
                      }


                      {this.state.error !== "" &&
                      <Grid item>
                      <p style={{borderBottom:'1px solid red'}}>{this.state.error}</p>
                      {/*
                        <TextField style={{width:320}}
                                value={this.state.error}
                                className="error"
                                rowsMax="8"
                                error
                                disabled
                                multiline
                                margin="normal"
                                />
                                */}
                      </Grid>
                      }
                      <Grid item>
                        <p onClick={this.resetPassword} style={{textDecoration:'underline', color:'rgb(29, 142, 84)', cursor:'pointer' }} >
                          Glemt password?
                        </p>
                      </Grid>

                        </form>
                    </Grid>


            </Paper>
        </Grid>


    )
  }
}
