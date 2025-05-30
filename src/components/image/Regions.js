import React, { Component } from 'react';
import { Region } from './Region.js';

export class Regions extends Component {

  componentDidMount(){


  }

  rotateAroundCenter = ((x, y, angle) => {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * x) + (sin * (y)),
        ny = (cos * y) - (sin * (x));
    return {x:nx, y:ny};
  });

  /*
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", nextProps);
  }
  */


  render() {
    const { templatefields, imageScale, scale, regions, fieldid, hoverField } = this.props;
    const { imageWidth, imageHeight } = this.props;
    //imageTransform
    //const imageWidth = imageDimensions.width;
    //const imageHeight = imageDimensions.height;

    let keysSorted = Object.keys(templatefields).sort(function(a,b){return templatefields[a].index-templatefields[b].index})


    let selectedFieldIndex = -1;
    if(fieldid){
      selectedFieldIndex = keysSorted.indexOf(fieldid);
      keysSorted = [fieldid];
    }

    let strPoints = "";
    const arrPoints = [];
    const topLeft = [];

    let i;
    for (i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      const region = regions[key];

      const regionPoints = [];

      for (var pointIndex in region) {

        let strP = pointIndex === "0" ? " M " : " L "
        const x = region[pointIndex][0];
        const y = region[pointIndex][1];

        //const rotated = this.rotateAroundCenter(x,y,-imageRotation)
        const rotated = this.rotateAroundCenter(x,y,0)
        if(pointIndex === "0") topLeft.push({x:rotated.x*imageScale, y:rotated.y*imageScale})
        regionPoints.push(strP + (rotated.x*imageScale) + " " + (rotated.y * imageScale));
      }
      arrPoints.push(regionPoints);
    }
    strPoints = arrPoints.join(" z ");

    let dots = "M 0,0 L " + imageWidth * imageScale + ",0 L "+ imageWidth  * imageScale +","+ imageHeight * imageScale +" L 0,"+ imageHeight * imageScale + strPoints;

    const bg = <g key="svg_bg" style={{height:imageHeight*imageScale, width:imageWidth*imageScale, pointerEvents:'none'}}>
        <path style={{stroke:'none', fill:'rgba(0,0,0,.25)', fillRule:'evenodd'}}
          d={dots} />
          </g>

    const elms = [];

    if(fieldid ){
      elms.push(bg)
    }

    console.log("fieldid", fieldid);
    console.log(this.props);

    for (i = 0; i < arrPoints.length; i++) {
        const fieldKey = keysSorted[i];
        const ps = arrPoints[i].join("") + " z";
        const tl = topLeft[i];
        const doHover = hoverField === fieldKey;

        const color = this.props.mode === "r" ? '#42c37c' : '#f37021';
        const allowPointerEvents = fieldid === undefined && this.props.mode === "r" && !(selectedFieldIndex === i);
        elms.push(
          <Region documentpath={this.props.documentpath} over={doHover} allowPointerEvents={allowPointerEvents} key={"svg_"+ fieldKey} fieldKey={fieldKey}
              onFieldOver={this.props.onFieldOver} onFieldOut={this.props.onFieldOut} onFieldClick={this.props.onFieldClick}
                color={color}
                  index={selectedFieldIndex > -1 ? selectedFieldIndex : i} scale={scale} topLeft={tl} svgPath={ps}
                  />
        )
    }



    return (
      <div id="regions" style={{transformOrigin: '0 0'}}>
        <svg style={{width:imageWidth, height:imageHeight, position:'absolute', pointerEvents:'none'}}>
          {elms}
        </svg>





      </div>
    );
  }
}
