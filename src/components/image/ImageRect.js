import React, { Component } from 'react';




export class ImageRect extends Component {

  constructor(props){
      super(props);
      this.state = {color:this.props.color, showBg:false};
  }


  componentDidMount(){

  }

  onOver = (e) => {
    if(this.props.onFieldOver) this.props.onFieldOver(this.props.fieldKey);
  }

  onOut = (e) => {
    if(this.props.onFieldOut) this.props.onFieldOut(this.props.fieldKey);
  }

  onFieldClick = (e) => {
    if(this.props.onFieldClick) this.props.onFieldClick(this.props.fieldKey);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.color !== this.state.color || nextProps.showBg !== this.state.showBg){
      this.setState({color:nextProps.color, showBg:nextProps.showBg});
    }

  }

  render() {

    const {region } = this.props;

    const imageWidth = this.props.imageDimensions.width;
    const imageHeight = this.props.imageDimensions.height;

    const { color } = this.state;

    const points = [];
    for (var index in region) {
      const p = region[index].join(" ");
      points.push(p)
    }

    const strPoints = points.join(" ")
    let strokeColor = color;

    const svg = <svg height="6000" width="4000" style={{zIndex:10, position:'absolute'}}>
                  <polygon points={strPoints}
                    style={{fill:'transparent',stroke:strokeColor, strokeWidth:10}} />
                </svg>;

    const title = {
      position: 'inherit',
      left: 100,
      top: 100,
      width:20,
      height:20,
      color:'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color,
    };

    const holder = {
      position: 'absolute',
    };

    return (
      <div onClick={this.onFieldClick} onMouseOver={this.onOver} onMouseOut={this.onOut} style={holder}>
        {svg}
        <div style={title}>{this.props.index}</div>


      </div>

    );
  }
}
