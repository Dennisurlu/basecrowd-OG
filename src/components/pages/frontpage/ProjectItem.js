import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';

export class ProjectItem extends React.Component {

  constructor(props){
    super(props);

    this.state = this.getStateObject(props);

  }

  componentWillReceiveProps(nextProps){
    this.setState(this.getStateObject(nextProps));
  }

  getStateObject(props){
    const { data, userid} = props;

    let projectUserComplete = false;
    let userProjectStatus = null;
    if(userid && data.userComplete){
      if(data.userComplete[userid] === true) projectUserComplete = true;
      if(data.userComplete.hasOwnProperty(userid)) userProjectStatus = data.userComplete[userid];
    }

    const obj = {
      userid:userid,
      data:data,
      userProjectStatus:userProjectStatus,
      projectUserComplete:projectUserComplete
    }
    return obj;
  }

  joinAndStartProject = () => {
    this.props.joinAndStartProject(this.state.data.key, this.state.userProjectStatus)

  }

  render() {
    const { data, userid, userProjectStatus, projectUserComplete } = this.state;

    const percentDocumentsComplete = Math.min(100, Math.round(data.complete_count / data.document_count * 100));

    const projectComplete = data.complete;

    const userComplete = projectComplete || projectUserComplete;

    const isProduction = process.env.NODE_ENV === "production";

    const debug = !isProduction && true;

    const debugStyle = {
      color:'#1e2139'
    }

    const paperBg = {
      padding:37,
      paddingTop:170,
      width:350,
      minHeight:300,
      boxShadow:'0 0 14px 1px rgba(9, 30, 66, 0.08)',
      backgroundColor:'#ffffff',
      border:'solid 1px #ebebed',
      background:'url(' + this.props.imageUrl + ')',
      backgroundSize:'100% 150px',
      backgroundRepeat:'no-repeat'

    }

    return (
      <Grid item style={{padding: 32}}>
        <Paper style={paperBg}>
          <Grid container spacing={16}>
          {/* TEKST*/}
            <Grid item>
              <Typography gutterBottom variant="headline" style={{color:'#3a3f46'}}>{data.title}</Typography>
              {data.description &&
              <Typography gutterBottom variant="subheading" style={{color:'#3a3f46'}}>{data.description}</Typography>
              }
              <Typography variant="body1" style={{color:'#3a3f46'}}>Dokumenter i alt: {data.document_count}.</Typography>
              <Typography gutterBottom variant="body1" style={{color:'#3a3f46'}}>Færdige dokumenter: {data.complete_count}.</Typography>

            </Grid>

            {/* PROGRESS */}
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={10}>
                  <LinearProgress style={{top:10}} variant="determinate" value={percentDocumentsComplete} />
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2" style={{color:'#3a3f46', size:12, fontWeight:'bold'}}>{percentDocumentsComplete}%</Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* DEBUG*/}
            {debug &&
            <Grid item>
              <ul>
                <li><code style={debugStyle}>.complete: {String(projectComplete)}</code></li>
                <li><code style={debugStyle}>.enabled: {String(data.enabled)}</code></li>
                <li><code style={debugStyle}>.sortindex: {data.sortindex}</code></li>
                <li><code style={debugStyle}>.complete_count: {data.complete_count}</code></li>
                <li><code style={debugStyle}>.userComplete[uid]: {String(userProjectStatus)}</code></li>
              </ul>
            </Grid>
            }


            {!userid && !projectComplete &&
            <Grid item>
              <Button variant='raised' color="primary" style={{color:'#ffffff'}}  onClick={this.props.openLoginModal} label="login">
                Log ind for at bidrage
              </Button>
            </Grid>
            }

            { projectUserComplete &&
            <Grid item>
              <p key="sdf" style={{color:'#000'}}>Du er færdig med dette projekt :)</p>
            </Grid>
            }

            {userid && userComplete &&
            <Grid item>
              <Button disabled={true} variant='raised' style={{color:'#ffffff'}} color="primary" onClick={null} label="Ikke flere opgaver">
                Ikke flere opgaver
              </Button>
            </Grid>
            }

            {userid && !isProduction &&

            <Grid item key="a">
              <Link to={'/projects/' + data.key}>
                <Button  variant='raised' style={{color:'#ffffff'}} color="primary" onClick={null} label="Se kasser (dev)">
                  Se kasser
                </Button>
              </Link>
            </Grid>
            }

            {userid &&
            <Grid item key="b">
              <Button  variant='raised' style={{color:'#ffffff'}} color="primary" onClick={this.joinAndStartProject} label="Første ledige document">
                Første ledige dokument
              </Button>
            </Grid>
            }

          </Grid>


        </Paper>
      </Grid>


    );
  }
}
