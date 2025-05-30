import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

export class ResumeField extends React.Component {


   constructor(props) {
     super(props);
     this.state = {
       fieldid:props.fieldid,
       path:props.path
     }
   }

   componentWillReceiveProps(nextProps){
     if(this.state.hover !== nextProps.hover){
       this.setState({hover:nextProps.hover})
     }
   }

   onOver = (e, key) => {
     this.props.fieldOver(this.props.fieldid);
     this.setState({hover:true});
   }

   onOut = (e, key) => {
     this.props.fieldOut(this.props.fieldid);
     this.setState({hover:false});
   }




  render() {

    const { hover } = this.state;


    const bg = {
      width: 381,
      marginBottom:0,
      float:'left',
      clear:'left'
    }
    if (hover) {
      bg.backgroundColor = '#23272c'
    }

    const div = {
      fontSize:10,
      width:120,
      float:'left',
      marginTop:4,
      paddingTop:4,
    }

    const valueStyle = Object.assign({}, div);
    valueStyle.width = 260;
    valueStyle.whiteSpace = 'pre-line';


    const divGrey = {
      fontSize:10,
      opacity:.31,
      width:120,
      float:'left',
      marginTop:4,
      paddingTop:4,
    }

  const path = this.state.path;

    return (
      <Link to={path} style={{color:'#ffffff'}} >
        <div style={bg}  onMouseOver={this.onOver} onMouseOut={this.onOut} >
            <div style={{backgroundColor:'white', height:1, opacity:.1}}/>
              <div style={hover ? div : divGrey}>
                <Typography style={{fontSize:10, color:'#ffffff', textDecoration: 'none' }}>
                  {this.props.title}
                </Typography>

              </div>
              <p style={valueStyle}>{this.props.value}</p>
              <br/>
            </div>
            </Link>
    );
  }
}
