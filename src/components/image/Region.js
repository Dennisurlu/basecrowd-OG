import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Region extends Component {

  onOver = (e) => {
    //console.log("onOver", this.props.fieldKey);
    if(this.props.onFieldOver) this.props.onFieldOver(this.props.fieldKey);
  }

  onOut = (e) => {
    //console.log("onOut", this.props.fieldKey);
    if(this.props.onFieldOut) this.props.onFieldOut(this.props.fieldKey);

  }

  onRegionClick = (e) => {
    //console.log("onRegionClick", this.props.fieldKey);
    //if(this.props.onFieldClick) this.props.onFieldClick(this.props.fieldKey);
  }


  render() {
    const {allowPointerEvents, scale, svgPath, fieldKey, color, over } = this.props;

    const style = {
      stroke:color,
      fill:color,
      fillOpacity: over ? .25 : 0,
      strokeWidth:1 / scale,
    }

    if(allowPointerEvents){
      style.pointerEvents = 'bounding-box';
    } else {
      style.pointerEvents = 'none';
    }

    const path = this.props.documentpath + "/" + this.props.fieldKey
    /*
    const textBg = {
      fill:color,
      stroke:'none'
    }
    */


    //const fontSize = 10 / scale;
    //const sx = topLeft.x + (6 / scale);
    //const sy = topLeft.y + (9 / scale);

    return (
      <Link to={path} >
      <g id={"svg_"+ fieldKey} key={"svg_"+ fieldKey}>
          <path id={"path_"+fieldKey} onClick={this.onRegionClick} onMouseOver={this.onOver} onMouseOut={this.onOut}
                style={style}
            d={svgPath} />
            {/*
            <rect x={topLeft.x} y={topLeft.y}  width={ 12 / scale } height={12 / scale } style={textBg}  />
              <text textAnchor='middle' x={sx} y={sy} style={{fontSize:fontSize, fontFamily:'Open Sans', fonWeight:'bold' }} fill="white">{(index+1)}</text>
              */}
        </g>
        </Link>
    );
  }
}
