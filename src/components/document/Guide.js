import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from '@material-ui/core/Typography';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import { setUserProperty } from 'components/utils/FirebaseUtils.js';

export default class Guide extends Component {

  constructor(props) {
    super(props);

    this.state = {
                showGuide:props.showGuide,
                activeStep:0,
                user:props.user,
                userData:props.userData
              }
  }

  componentWillReceiveProps(nextProps){
    this.setState({user:nextProps.user, userData:nextProps.userData })
  }

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleModalClose = (dontShowAgain) => {
    console.log("handleModalClose, dontShowAgain:", dontShowAgain);
    const { user, userData } = this.state;
    if(dontShowAgain && user) {
      console.log("userData", userData);
      userData.showGuide = false;
      setUserProperty(user.uid, {showGuide:false});
      console.log("userData", userData);

    }

    this.setState({ showGuide: false });
  }

  getSteps = () => {
    return ['Tast det der står', 'Ulæseligt tekst', 'Tomt felt'];
  }

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return <div>
                  <img src="/images/guide_step1.png" alt="step1" />
                  <Typography>
                    Skriv teksten præcis som den står. Hvis du ikke kan læse hele teksten, skal du ikke skrive noget.
                  </Typography>
                </div>
      case 1:
        return <div>
                  <img src="/images/guide_step2.png" alt="step2"/>
                  <Typography>
                    Hvis teksten er ulæselig, så sæt kryds i boxen 'Det kan jeg ikke læse'
                  </Typography>
                </div>
      case 2:
        return <div>
                  <img src="/images/guide_step3.png" alt="step3"/>
                  <Typography>
                    Hvis feltet er tomt, så sæt kryds i boxen 'Tomt felt'
                  </Typography>
                </div>
      default:
        return 'Unknown step';
    }
  }

  setStep = (index) => {
    console.log("setStep", index);
    this.setState({activeStep:index})
  }

  render() {
    const showGuide = this.state.showGuide;
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <Dialog style={{minWidth:600}}
                open={showGuide}
                //onClose={this.handleModalClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">GUIDE</DialogTitle>
                <DialogContent>


                <Stepper activeStep={activeStep} orientation="vertical">
                          {steps.map((label, index) => {
                            return (
                              <Step key={label}>
                                <StepLabel onClick={(e) => this.setStep(index, e)}><div >
                                            {label}
                                            </div>
                                  </StepLabel>
                                <StepContent >
                                  {this.getStepContent(index)}
                                  <div >
                                    <div>
                                      <br/>
                                      {activeStep === steps.length - 1 ?
                                        [<Button key="buttonCloseFalse"
                                        variant="raised"
                                          onClick={(e) => this.handleModalClose(false, e)}
                                          color="primary"
                                          style={{marginRight:40}}
                                          >
                                          LUK
                                        </Button>,
                                        <Button key="buttonCloseTrue" onClick={(e) => this.handleModalClose(true, e)} color="primary" variant="raised" autoFocus>
                                          LUK OG VIS IKKE IGEN
                                        </Button>]
                                        :
                                        <Button key="buttonNext"
                                          variant="raised"
                                          color="primary"
                                          onClick={this.handleNext}

                                        >
                                          Næste
                                        </Button>
                                      }


                                    </div>
                                  </div>
                                </StepContent>
                              </Step>
                            );
                          })}
                        </Stepper>


                </DialogContent>

              </Dialog>

    );
  }

}
