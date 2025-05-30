import React from 'react';
//import { mouseWheelZoom } from 'mouse-wheel-zoom';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';

const InteractiveDiv = panAndZoomHoc('div');

export class MouseWheelZoom extends React.Component {

  constructor() {
    super();
    this.state = {
      x: 0.5,
      y: 0.5,
      scale: 1,
      imageWidth:null,
      imageHeight:null,
      imageScale:1,
      viewWidth:555,
      viewHeight:800
    };
  }


  handlePanAndZoom = (x, y, scale, e) => {
    //if(scale === 1) x = y = .5;
    this.setState({x, y, scale});
    e.preventDefault();
 }

   handlePanMove = (x, y) => {
       this.setState({x, y});
   }


    handleImageLoaded({target:img}) {
      console.log("handleImageLoaded", img.offsetWidth, img.offsetHeight);
      const { offsetWidth, offsetHeight} = img;
      const imageDimensions = {
        width:offsetWidth,
        height:offsetHeight
      }
      const scaleX = this.state.viewWidth / offsetWidth;
      const scaleY = this.state.viewHeight / offsetHeight;

      const imageScale = Math.min(scaleX, scaleY);

     this.setState({hoverField:null, imageLoaded:true, imageDimensions:imageDimensions,
                    imageScale:imageScale,
                    imageWidth:offsetWidth,
                    imageHeight:offsetHeight,
                   });
    }

   handleImageErrored() {
    this.setState({ imageStatus: 'failed to load' });
  }

  radiansToDegrees = (radians) => {
    return radians * 180 / Math.PI;
  }

    render() {
        const {x, y, scale, imageWidth, imageHeight, imageScale, viewWidth, viewHeight} = this.state;

        const imgWidth = imageWidth * imageScale;
        const imgHeight = imageHeight * imageScale;

        console.log("imgWidth", imgWidth);


        const imageRotation = -this.radiansToDegrees(0.008063416886288897);
        const translateX = 0;//document.transform.translation[0];//163.43549318900364;
        const translateY = 0;//document.transform.translation[1];//-31.525915986658358;

        const imageTransform = {
          pointerEvents:'none',
          transform: `rotate(${imageRotation}deg) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: 'top left',
        }


        return <div>
                <code>x:{x}</code>
                <code>y:{y}</code>
                <code>scale:{scale}</code>
                  <InteractiveDiv
                        x={x}
                        y={y}
                        scale={scale}
                        scaleFactor={2}
                        minScale={1}
                        maxScale={16}
                        onPanAndZoom={this.handlePanAndZoom}
                        onPanMove={this.handlePanMove}
                        style={{overflow:'hidden', width: viewWidth, height: viewHeight, border: '1px solid black', position: 'relative'}}
                    >
                    <div style={{transform: `scale(${scale}) translate(${(0.5 - x) * viewWidth}px, ${(0.5 - y) * viewHeight}px`}} >
                      <div style={{backgroundColor:'#ff00ff', width:viewWidth, height:viewHeight}}>
                      { imageWidth ?
                        <img style={imageTransform}
                            onLoad={this.handleImageLoaded.bind(this)}
                            onError={this.handleImageErrored.bind(this)}
                            width={imgWidth}
                            height={imgHeight}
                            //src="/images/800x800.jpg"
                            src="/images/8011321491-0010.jpg"
                            draggable="false" alt=''/>
                            :
                            <img
                                onLoad={this.handleImageLoaded.bind(this)}
                                onError={this.handleImageErrored.bind(this)}
                                //src="/images/800x800.jpg"
                                src="/images/8011321491-0010.jpg"
                                draggable="false" alt=''/>
                      }

                          </ div>
                    </div>

                  </InteractiveDiv>
                </div>
    }

}
