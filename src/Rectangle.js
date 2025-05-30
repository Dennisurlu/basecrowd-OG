export class Rectangle {

  constructor(x, y, width, height ) {
    //console.log("Rectangle", x,y,width,height);
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }



  inflate(value) {
    //console.log("inflate");
    this.x = this.x - value;
    this.y = this.y - value;
    this.width += value * 2;
    this.height += value * 2;
	};

}
