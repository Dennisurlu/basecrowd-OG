import React, { Component } from 'react';
import { Regions } from './Regions.js';
import { Rectangle } from './Rectangle.js';
import { ZoomControls } from 'components/ui/ZoomControls.js';
import firebase from 'firebase/app';
import 'firebase/storage';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import panAndZoomHoc from 'react-pan-and-zoom-hoc';
import ReactResizeDetector from 'react-resize-detector';

const InteractiveDiv = panAndZoomHoc('div');


let selectedFocus = null;
const SCALE_MIN = 1;
const SCALE_MAX = 24;

export class ImageContainer extends Component {

  constructor(props) {
    super(props);
    const { regions } = this.props.document;
    let selectedRegion = null;
    if(regions.hasOwnProperty(props.fieldid)){
      selectedRegion = regions[props.fieldid];
    }


    //const xyScale = this.getXYScale(selectedRegion, props.document.shape.width, props.document.shape.height);

    this.state = {
      imageUrl:null,
      fileReference:props.fileReference,
      imageLoaded:false,
      hoverField:null,
      mode:props.mode,
      fieldid:props.fieldid,
      documentpath:props.documentpath,

      regions:regions,
      selectedRegion:selectedRegion,
      /*
      x: xyScale.x,
      y: xyScale.y,
      scale: xyScale.scale,
      */


      imageWidth:null,//this.props.document.shape.width,
      imageHeight:null,//this.props.document.shape.height,
      imageScale:1,
      viewWidth:400,
      viewHeight:400
    };

  }

  getXYScale = (selectedRegion, imageWidth, imageHeight) => {
    if(selectedRegion && imageWidth && imageHeight) {

      const fieldX = selectedRegion[0][0];
      const fieldY = selectedRegion[0][1];

      const fieldWidth = selectedRegion[2][0] - fieldX;
      const fieldHeight = selectedRegion[2][1] - fieldY;

      let rect = new Rectangle(fieldX, fieldY, fieldWidth, fieldHeight);
      //const padding = rect.width * .1;
      //rect.inflate(padding);
      const fieldScaleWidth = Math.min(SCALE_MAX, imageWidth / rect.width);
      const fieldScaleHeight = Math.min(SCALE_MAX, imageHeight / rect.height);

      const fieldScale = Math.min(fieldScaleWidth, fieldScaleHeight);


      const fieldCenterX = fieldX + (fieldWidth * .5 );
      const fieldCenterY = fieldY + (fieldHeight * .5 );

      //console.log("fieldScale", fieldScale);
      //console.warn("field width-factor i stedet for fieldScale????");
      return {x:fieldCenterX / imageWidth, y:fieldCenterY / imageHeight, scale:fieldScale};
    } else  {
      return {x:.5, y:.5, scale:1};
    }
  }


  onResize = (w, h) => {
    console.log("onResize", w ,h);

    this.setState({viewWidth:w, viewHeight:h});
  }

  handleImageLoaded = ({target:img}) => {
    console.log("handleImageLoaded");
    //const { offsetWidth, offsetHeight} = img;
    const imageWidth = img.offsetWidth;
    const imageHeight = img.offsetHeight;

    const xyScale = this.getXYScale(this.state.selectedRegion, imageWidth, imageHeight);

    this.setState({
      imageLoaded:true,
      imageWidth:imageWidth,
      imageHeight:imageHeight,
      x:xyScale.x,
      y:xyScale.y,
      scale:xyScale.scale,
    });
    //this.setState({hoverField:null, imageLoaded:true, imageWidth:offsetWidth, imageHeight:offsetHeight });
  }



  handleImageErrored = () => {
    this.setState({ imageStatus: 'failed to load' });
  }


  componentWillReceiveProps(nextProps) {
    let {x, y, scale, regions} = this.state;
    //let { regions } = this.state;

    let selectedRegion;
    if(regions.hasOwnProperty(nextProps.fieldid)){
      selectedRegion = regions[nextProps.fieldid];
    }

    //if(!selectedRegion || (selectedRegion !== this.state.selectedRegion) || selectedRegion !== this.state.selectedRegion){
      const xyScale = this.getXYScale(selectedRegion, this.state.imageWidth, this.state.imageHeight);
      //if(nextProps.mode !== "r"){
        x = xyScale.x;
        y = xyScale.y;
        scale = xyScale.scale;
      //}
    //}

    if(nextProps.fieldid !== this.state.fieldid || nextProps.hoverField !== this.state.hoverField){
      this.setState({
        mode:nextProps.mode,
        hoverField:nextProps.hoverField,
        fieldid:nextProps.fieldid,
        documentpath:nextProps.documentpath,
        selectedRegion:selectedRegion,

        x:x,
        y:y,
        scale:scale,

      });
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log("shouldComponentUpdate", nextState.imageUrl, nextState.fieldid, nextProps.fieldid);
    return nextState.imageUrl !== null
  }

  componentDidMount() {

    if(!this.props.fileReference) return;

    var storage = firebase.storage();
    var storageRef = storage.ref();
    const pathReference = storageRef.child(this.props.fileReference);
    pathReference.getDownloadURL().then((url) => {
      // Insert url into an <img> tag to "download"
      this.setState({imageUrl:url});
    }).catch((error) => { // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object_not_found':
        case 'storage/unauthorized':
        case 'storage/canceled':
        case 'storage/unknown':
          console.error("getDownloadURL.error", error.code);
          break;
        default:
          console.error("getDownloadURL.Error.default");
      }
    });
  }

  onFieldClick = (key) => {
    this.setState({hoverField:key})

  }


  onChangeValue = name => value => {
    console.log('onChangeValue', name, value);
    this.setState({[name]:value})
    //event.preventDefault();
  };


  getInputFocus(){
    var selectedTextArea = document.activeElement;
    if(selectedTextArea && selectedTextArea.id === "input") selectedFocus = selectedTextArea;
  }

  setInputFocus(){
    if(selectedFocus && selectedFocus.id === "input") selectedFocus.focus();
  }

  onZoomIn = () => {
    console.log("onZoomIn");
    this.setState({scale:this.state.scale*1.1});
    setTimeout( ()=> { this.setInputFocus(); }, 200);
  }
  onZoomOut = () => {
    console.log("onZoomOut");
    this.setState({scale:this.state.scale/1.1});
    setTimeout( ()=> { this.setInputFocus(); }, 200);
  }
  onZoomReset = () => {
    console.log("onZoomReset");
    const xyScale = this.getXYScale(this.state.selectedRegion, this.state.imageWidth, this.state.imageHeight);
    this.setState({x:xyScale.x, y:xyScale.y, scale:xyScale.scale});
    setTimeout( ()=> { this.setInputFocus(); }, 200);
  }

  radiansToDegrees = (radians) => {
    return radians * 180 / Math.PI;
  }

  rotateAroundCenter = (x, y, angle) => {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * x) + (sin * (y)),
        ny = (cos * y) - (sin * (x));
    return {x:nx, y:ny};
  };

  handlePanAndZoom = (x, y, scale, e) => {
    //if(scale === 1) x = y = .5;
    this.setState({x, y, scale});
    e.preventDefault();
  }

   handlePanMove = (x, y) => {
       this.setState({x, y});
   }

   getImageRotation = (document) => {
     let imageRotation = -this.radiansToDegrees(document.transform.rotation);  // FINDES TRANSFORM ROTATION PÅ DOKUMENTET?
     if(isNaN(imageRotation)){
       imageRotation = 0;
       // HVIS IKKE MEN inverse_transform OG inverse_transform.matrix findes brug disse
       if(document.hasOwnProperty("inverse_transform") && document.inverse_transform.hasOwnProperty("matrix")){
           const { matrix } = document.inverse_transform;
           //var a = matrix[0][0];
           //var b = matrix[0][1];
           var c = matrix[1][0];
           var d = matrix[1][1];

           const halfPi = 180/Math.PI;
           var rads0 = Math.atan(c/d);
           //var rads1 = Math.atan(-b/a);
           imageRotation = rads0 * halfPi;
       }
     }

     return imageRotation;
   }

  render() {

    setTimeout( ()=> { this.getInputFocus(); }, 200);

    const { document, templatefields } = this.props;
    const { regions } = document;

    const { mode, imageLoaded, imageUrl, imageWidth, imageHeight, viewWidth, viewHeight} = this.state;

    let { x, y, scale} = this.state;
    //x = 0.5;
    //y = 0.5;
    //scale = 1;






    const viewRatio = viewWidth / viewHeight;
    const imageRatio = imageWidth / imageHeight;
    console.log("viewRatio/imageRatio", viewRatio, imageRatio, viewRatio > imageRatio);

    let scaleX = this.state.viewWidth / imageWidth;
    let scaleY = this.state.viewHeight / imageHeight;
    let imageScale = Math.min(scaleX, scaleY);

    if(viewRatio < imageRatio){
      imageScale = Math.max(scaleX, scaleY);
    }
    console.log("imageScale", imageScale);

    const imgWidth = imageWidth * imageScale;
    const imgHeight = imageHeight * imageScale;

    const maxViewWidth = Math.min(viewWidth, 700);
    const bonusScale = (maxViewWidth - 40)  / imgWidth;
    console.log("SCALE", imageScale, scale);
    console.log("bonusScale",bonusScale);

    const imageCenterShiftX = 0.5 * viewWidth;//(viewWidth - (imgWidth)) * .5;
    const imageCenterShiftY = 0.5 * viewHeight;

    const regionPointTranslateX = x * imgWidth;
    const regionPointTranslateY = y * imgHeight;
    console.log("regionPointTranslateX", regionPointTranslateX);
    console.log("regionPointTranslateY", regionPointTranslateY);

    const tx = (imageCenterShiftX - regionPointTranslateX);
    const ty = (imageCenterShiftY - regionPointTranslateY);


    const imageRotation = this.getImageRotation(document);
    const imageAndRegions = {
      transform:`rotate(${imageRotation}deg) scale(${scale * bonusScale}) translate(${tx}px, ${ty}px`,
      userSelect:'none',
    }

    return (
      <div style={{position:'relative', width:'100%', height:'100%', minWidth:200}}>

        <div style={{opacity:0, position:'absolute', width:'100%', height:'100%'}} >
          <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        </div>

        <div style={{position:'absolute', pointerEvents:'none', width:'100%', height:'100%', boxShadow: 'inset -23px 0px 23px -13px rgba(0,0,0,0.3)', zIndex:100}}>
        </div>


        <div style={{position:'absolute', width:viewWidth, height:viewHeight}}>
        {!imageLoaded &&
          <div style={{padding:40, position:'absolute', width:240}}>
            <code>Indlæser billede ...</code>

            <p></p>
            <CircularProgress />
            <img
                onLoad={this.handleImageLoaded}
                onError={this.handleImageErrored}
                src={imageUrl}
                draggable="false" alt=''/>
          </div>

        }

        {/* ZOOM CONTROLS & FILE INFO */}

            <div style={{paddingRight:10, position: 'fixed', bottom:0, left:0, paddingBottom: 14, zIndex:999, width:viewWidth}}>
              <div style={{float:'left'}}>
                <ZoomControls onZoomIn={this.onZoomIn} onZoomOut={this.onZoomOut} onZoomReset={this.onZoomReset} />
              </div>

              <div style={{float:'right', opacity:0.4, borderRadius:2, backgroundColor:'rgb(0, 0, 0)' }}>
                <Typography
                  style={{fontSize:10, color:'#ffffff', height:36, paddingTop:10, paddingLeft:10, paddingRight:10,  pointerEvents:'none'}} >
                  ID: {this.props.document.image_id} | {this.props.document.index+1} af {this.props.collectionDocumentCount}
                </Typography>
              </div>

            </div>


            {/* INTERACTIVE DIV (DRAGGABLE) */}

            <InteractiveDiv
                  x={x}
                  y={y}
                  scale={scale}
                  scaleFactor={1.2}
                  minScale={SCALE_MIN}
                  maxScale={SCALE_MAX}
                  onPanAndZoom={this.handlePanAndZoom}
                  onPanMove={this.handlePanMove}
                  style={{
                    overflow:'hidden',
                    height:'100%',
                    //position: 'relative'
                  }}
              >

              {imageLoaded &&
              <div id="image-and-regions-holder" style={imageAndRegions} >
                <Regions
                    onFieldOver={this.props.onFieldOver}
                    onFieldOut={this.props.onFieldOut}
                    onFieldClick={this.props.onFieldClick}
                    documentpath={this.state.documentpath}
                    imageRotation={imageRotation}
                    templatefields={templatefields}
                    regions={regions}
                    fieldid={this.state.fieldid}
                    mode={mode}
                    //imageDimensions={{width:imageWidth, height:imageHeight}}
                    viewWidth={viewWidth}
                    viewHeight={viewHeight}
                    scale={scale}
                    hoverField={this.state.hoverField}
                    imageScale={imageScale}
                    imageWidth={imageWidth}
                    imageHeight={imageHeight}
                   />

                 <img
                     width={imgWidth}
                     height={imgHeight}
                     src={imageUrl}
                     draggable="false" alt=''/>
              </div>
            }

            </InteractiveDiv>

        </div>
      </div>
    )

  }
}
