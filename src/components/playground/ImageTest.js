import React from 'react';

export class ImageTest extends React.Component {

  /*
  constructor(props){
      super(props);
  }
  */


  componentDidMount(){

  }

  handleImageLoaded({target:img}) {
    //console.log("handleImageLoaded", img.offsetWidth, img.offsetHeight);
    /*
    const imageDimensions = {
      width:img.offsetWidth,
      height:img.offsetHeight
    }
    */
   //this.setState({hoverField:null, imageLoaded:true, imageDimensions:imageDimensions });
  }



 handleImageErrored() {
  this.setState({ imageStatus: 'failed to load' });
}

  radiansToDegrees = (radians) => {
    return radians * 180 / Math.PI;
  }

  randomColor = () => {
    var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
    var newColor = "#";

    for ( var i = 0; i < 6; i++ ) {
      var x = Math.round( Math.random() * 14 );
      var y = hexValues[x];
      newColor += y;
    }
    return newColor;
  }

  onOver = (id) => {
    console.log("onOver", id);
    //if(this.props.onFieldOver) this.props.onFieldOver(this.props.fieldKey);
  }

  render() {

    const img = "8011321491-0010.jpg";

    const containerScale = .25;

    const container = {
      transform: `scale(${containerScale})`,
      transformOrigin: 'top left',
    }

    const regions = {
      "name":[[1127.5179444682567,747.5827587212555],[1119.5202026323666,1038.4282102199888],[2903.6148952325666,1099.5946580442646],[2913.5840124193955,808.8167937806962]],
      "birth_date":[[1119.5202026323666,1038.4282102199888],[1113.5725259378514,1211.9092411026602],[2010.5483106152997,1242.6614331027104],[2016.4959873098148,1069.180402220039]],
      "death_cause":[[1078.2244019465847,2242.938549643991],[1072.3894516359728,2470.699989912662],[2854.5127688852335,2531.7988505017734],[2862.319094546784,2304.104997468267]],
      "birth_place":[[2016.4959873098148,1069.180402220039],[2010.5483106152997,1242.6614331027104],[2897.667218538051,1273.075688926936],[2903.6148952325666,1099.5946580442646]],
      "residence":[[1100.973179345167,1608.1894802590714],[1093.0654728308682,1838.840396318987],[2876.1744777555987,1899.9730505256803],[2884.082184269897,1669.3221344657647]],
      "death_signs":[[1064.3352251201884,2648.0561842620473],[1057.5259326652629,2933.0213033255454],[2838.663562239053,2994.0863702970737],[2848.4299177203884,2709.2226320863233]],
      "death_date":[[1093.0654728308682,1838.840396318987],[1087.0840025187706,2013.3071148771278],[2180.211634614694,2050.7842367760904],[2186.193104926792,1876.3175182179493]],
      "occupation":[[1113.5725259378514,1211.9092411026602],[1100.973179345167,1608.1894802590714],[2884.082184269897,1669.3221344657647],[2897.667218538051,1273.075688926936]],
      "disease_duration":[[1072.3894516359728,2470.699989912662],[1064.3352251201884,2648.0561842620473],[2848.4299177203884,2709.2226320863233],[2854.5127688852335,2531.7988505017734]],
      "death_age":[[2186.193104926792,1876.3175182179493],[2180.211634614694,2050.7842367760904],[2870.1930074435004,2074.4397690838214],[2876.1744777555987,1899.9730505256803]],
      "death_location":[[1087.0840025187706,2013.3071148771278],[1078.2244019465847,2242.938549643991],[2862.319094546784,2304.104997468267],[2870.1930074435004,2074.4397690838214]]
    }



    const elms = [];
    for (var region in regions) {
        let arr = regions[region];
        let points = arr.join( );
        elms.push(
            <g key={"svg_"+region} style={{position:'absolute'}}>
              <polygon points={points}
               style={{fill:'transparent',stroke:this.randomColor(), strokeWidth:10}} />
            </g>
        )

    }


    const scale = 1.2930449762489349;
    //const rotation = this.radiansToDegrees(0.0040348157175972565);
    let rotation = this.radiansToDegrees(0.012979953717094546);

    //rotation = -rotation;

    console.log("rotation", rotation);
    const translateX = 0;//163.43549318900364;
    const translateY = 0;//-31.525915986658358;


    /*
    0.9986501791803516
    -0.003352176386292064
    translation
    26.703347788608205
    70.46753880067857
    */

    const image = {
      transform: `scale(${scale}) rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
      transformOrigin: 'top left',
    }

    return (
      <div>
        <div>
          <svg style={{height:500, width:800, pointerEvents: 'visiblePainted'}}>
            <g>
              <path onMouseOver={(e) => this.onOver('1')} style={{stroke:'#000000', fill:'rgba(0,255,0,.5)', strokeWidth:0, fillRule:'evenodd'}}
                d="M 0,0 L 300,0 L 300,300 L 0,300 z  M 20,20 L 100,20 L 100,100 L 20,100 z"/>
            </g>
            <g>
              <path onMouseOver={(e) => this.onOver('2')}  d="M 20 220 L 220 220 L 220 420 L 20 420 L 20 220" fill="#ffff00" stroke="#FF0000" strokeWidth="5"></path>
            </g>

          </svg>
        </div>

        <div style={container} >
        <div id="rotate" style={image}>
          <div id="regions" style={{position:'absolute', zIndex:10}}>
            <svg width="4000" height="6000">
              {elms}
            </svg>
          </div>

          <img

            alt='meaningfull alt text :/'
            src={"/images/" + img}
            onLoad={this.handleImageLoaded.bind(this)}
             onError={this.handleImageErrored.bind(this)}
            />

            </div>
      </div>
      </div>

    );
  }
}
