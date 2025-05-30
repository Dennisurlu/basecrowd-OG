import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// MATERIAL UI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import cookie from 'react-cookies'

import { Link } from 'react-router-dom';
import * as CONSTANTS from './../constants.js';

import { ExtendedGuide } from 'components/pages/ExtendedGuide'



const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class TopMenuBar extends Component {
  constructor() {
      super();
      this.state = {user:null,
                    anchorElUser: null,
                    anchorElMenu: null,
                    //showExtendedGuide:true

                  };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({user:nextProps.user, anchorElUser: null, anchorElMenu: null})
  }


  handleUserMenu = event => {
    console.log("handleUserMenu");
    this.setState({ anchorElUser: event.currentTarget });
  };

  handleMenu = event => {
    console.log("handleMenu");
    this.setState({ anchorElMenu: event.currentTarget });
 };

  handleClose = () => {
    console.log('handleClose');
    this.setState({ anchorElUser:null, anchorElMenu:null  });
 };

 logOut = () => {
   console.log("logOut");
   this.props.logOut();
 }

 handleClickAway = () => {
   this.setState({ anchorElUser:null, anchorElMenu:null  });

 };


 clearCookies = () => {
   console.log("clearCookies");
   cookie.save(CONSTANTS.COOKIE_SHOW_GUIDE, true, { path: '/' });
   cookie.save(CONSTANTS.COOKIE_SHOW_START_TEXT, true, { path: '/' });
   window.location.reload();
 }

openExtendedGuide = () => {
  console.log("openExtendedGuide");
  this.setState({anchorElUser:null, anchorElMenu:null,  showExtendedGuide:true})
}

handleClose = () => {
  this.setState({showExtendedGuide:false})
}

  render() {

    const { classes } = this.props;
    const { anchorElMenu, anchorElUser, showExtendedGuide } = this.state;
    const openUserMenu = Boolean(anchorElUser);
    const openMenu = Boolean(anchorElMenu);

    const links = [];


      links.push(<MenuItem key="home"><Link to="/">Forside</Link></MenuItem>);
      //links.push(<MenuItem key="metodik"><Link to="/methodology">Forklaring af metodik</Link></MenuItem>);
      links.push(<MenuItem key="feedback"><Link to="/feedback">Hjælp / kontakt</Link></MenuItem>);

    if(this.state.user){
      //console.log("this.state.user", this.state.user);
      //console.log("this.state.user", this.state.user.uid);
      const { uid } = this.state.user.uid
      if(uid === "BpVRg2K9yQbi4X9zdbKUOlFTl9o1" || uid === "bCG8rH9YcEXO4AQeklfTRokw2512" || uid === "uaiWpOQgaheCQzLs3I9bsEQrkvQ2"   || process.env.NODE_ENV !== 'production'){
        links.push(<MenuItem key="xyz"><Link to="/projects/doedsattester-aarhus-b">Projekt: doedsattester-aarhus-b</Link></MenuItem>);
        links.push(<MenuItem key="useractivity"><Link to="/useractivity">useractivity</Link></MenuItem>);
      }

      if (process.env.NODE_ENV !== 'production'){
        links.push(<MenuItem key="c"><Link to="/playground">functions playground</Link></MenuItem>);
        links.push(<MenuItem key="d"><Link to="/projects/doedsattester-aarhus-b/Aarhus_kasse1_omegn/8011321491-0002">/projects/doedsattester-aarhus-b/Aarhus_kasse1_omegn/8011321491-0002</Link></MenuItem>);
        links.push(<MenuItem key="e"><Link to="/projects/doedsattester-aarhus-b/Aarhus_kasse1_omegn/8011321491-0003">/projects/doedsattester-aarhus-b/Aarhus_kasse1_omegn/8011321491-0003</Link></MenuItem>);
        links.push(<MenuItem key="f"><Link to="/imagetest">imageTest</Link></MenuItem>);
        links.push(<MenuItem key="h"><Link to="/users">Brugere</Link></MenuItem>);
      }
    }

    return (

        <AppBar position="static">
        { showExtendedGuide &&
          <ExtendedGuide handleClose={this.handleClose} />
        }
        <ClickAwayListener onClickAway={this.handleClickAway}>
          <Toolbar style={{backgroundColor:'#23272c'}}>

            <IconButton className={classes.menuButton} aria-label="Menu"
              aria-owns={openMenu ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={this.handleMenu} >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(openMenu)}
              onClose={this.handleClose}
            >
              {links}

            </Menu>
            <Typography variant="title" style={{fontSize:12, fontWeight:'bold'}} className={classes.flex}>
              <Link to="/" style={{color:'#FFFFFF', textDecoration:'none'}}>Basecrowd</Link>

            </Typography>

                  {this.state.user &&
                         <div>
                           <IconButton
                             aria-owns={openUserMenu ? 'user-menu-appbar' : null}
                             aria-haspopup="true"
                             onClick={this.handleUserMenu}

                           >
                            <AccountCircle />
                           </IconButton>


                           <Menu
                             id="user-menu-appbar"
                             anchorEl={anchorElUser}
                             anchorOrigin={{
                               vertical: 'top',
                               horizontal: 'right',
                             }}
                             transformOrigin={{
                               vertical: 'top',
                               horizontal: 'right',
                             }}
                             open={Boolean(openUserMenu)}
                             onClose={this.handleClose}
                           >
                           {this.state.user &&
                             [
                              <MenuItem key="email" disabled={true}>{this.state.user.email}</MenuItem>,
                              <MenuItem key="log-out" onClick={this.logOut}>Log ud</MenuItem>,
                              <MenuItem key="clear-cookies" onClick={this.clearCookies}>Slet cookies</MenuItem>,
                              <MenuItem key="ext-guide" onClick={this.openExtendedGuide}>Udvidet guide</MenuItem>
                            ]
                           }

                           </Menu>
                         </div>
                         }


                       <Typography variant="caption" gutterBottom align="right">
                             {CONSTANTS.TIME_STAMP}
                           </Typography>
          </Toolbar>
          </ClickAwayListener>

         </AppBar>


    )
  }
}


TopMenuBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TopMenuBar);
