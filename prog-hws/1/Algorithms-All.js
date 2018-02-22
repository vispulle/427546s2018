//Author: Viswanath Pulle, ID: 01690370
var canvas = document.getElementById("canvas");
var line = document.getElementById("line");
var circle = document.getElementById("circle");
var ellipse = document.getElementById("ellipse");
var rectangle = document.getElementById("rectangle");
var polyl = document.getElementById("polyl");
var polyg = document.getElementById("polyg");
var poly_input = document.getElementById("poly_input");
var clear = document.getElementById("clear");
var thickness = document.getElementById("selection");
var one =1 
var poly_vertices = 3;
var context = canvas.getContext("2d");
var test = "yellow"
var color = document.getElementById("color");
context.fillStyle = "black";



var clicks = 0;
var x_c0,y_c0, x_c1, y_c1;
var pointer = 0;
var polyg_startX,polyg_startY,polyg_endX,polyg_endY;

//Midpoint algorithm for line
function midLine(x0, y0, x1, y1) {
    var xi = 1;
    var yi = 1;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
  
    if(x0 > x1){
        xi = -xi;
    }
    
    if(y0 > y1){
        yi = -yi;
    }
    var d;
    if(dx > dy){
        d = dx / 2;
    }else {
        d = -dy / 2;
    }
    for(;;)
    {
        context.fillRect(x0, y0, 1, 1);
        if (xi > 0 && yi > 0 && x0 >= x1 && y0 >= y1) {
            break;
        } else if (xi > 0 && yi < 0 && x0 >= x1 && y0 <= y1) {
            break;
        } else if (xi < 0 && yi > 0 && x0 <= x1 && y0 >= y1) {
            break;
        } else if (xi < 0 && yi < 0 && x0 <= x1 && y0 <= y1) {
            break;
        }
        if (d > -dx) {
            d = d - dy;
            x0 = x0 + xi;
        }
        if (d < dy) {
            d = d + dx;
            y0 = y0 + yi;
        }
    }
}

//Midpoint algorithm for circle
function midCircle(x0, y0, r){
	var x=r;
	var y=0;
	var d = 1-r;
	
	while(x>=y)
	{	circleHelper(x,y,x0,y0);
		y++;
		if(d<0){
			d+=y*2+1;
		}else{
			d+=2*(y-x)+1;
			x--;
		}
		circleHelper(x,y,x0,y0);
	}
}

function circleHelper(x,y,x0,y0){
	context.fillRect(x+x0, y+y0, 1,1);
	context.fillRect(x0+y, x+y0, 1,1);
	context.fillRect(x0-x, y0+y, 1,1);
	context.fillRect(x0-y, y0+x, 1,1);
	context.fillRect(x0-x, y0-y, 1,1);
	context.fillRect(x0-y, y0-x, 1,1);
	context.fillRect(x0+x, y0-y, 1,1);
	context.fillRect(x0+y, y0-x, 1,1);
}

//Midpoint algorithm for ellipse
function drawEllipse(x0,y0,width,height)
{
	var x=0;
	var y=height;
	var wS = width*width;
	var hS = height*height;
	var i = 0;
	var j = 2*wS*y;
	ellipseHelper(x,y,x0,y0);
	
	var d = hS-(wS*height)+(0.25*wS);
	
	while(i<j){
		x++;
		i +=2*hS;
		if(d<0)
		{
			d +=hS +i;
		}else{
			y--;
			j -=2*wS;
			d +=hS+i-j;
		}
		ellipseHelper(x,y,x0,y0);
	}
	
	d =hS*((x+0.5)*(x+0.5)) + wS*((y-1)*(y-1)) - wS*hS;
	while(y>0){
		y--;
		j=j-2*wS;
		if(d>0){
			d +=wS-j;
		}else{
			x++;
			i+=2*hS;
			d = d+wS-j+i;
		}
		ellipseHelper(x,y,x0,y0);
	}
}

function ellipseHelper(x,y,x0,y0){
	context.fillRect(x0+x, y0+y, 1,1);
	context.fillRect(x0-x, y0+y, 1,1);
	context.fillRect(x0+x, y0-y, 1,1);
	context.fillRect(x0-x, y0-y, 1,1);
}


//Listerners for the buttons to get the clicks and using those to calculate the button
line.addEventListener("click", function(){
	if (poly_vertices== null){
		alert("please select number of vertice first");}
	pointer = 0;
	clicks = 0;
	context.fillStyle= document.getElementById("color").value;
	
},false);

circle.addEventListener("click", function(){
	pointer = 2;
	clicks = 0;
	context.fillStyle= document.getElementById("color").value;
}, false);

ellipse.addEventListener("click", function(){
	pointer = 3;
	clicks = 0;
	context.fillStyle= document.getElementById("color").value;
},false);


rectangle.addEventListener("click", function(){
	pointer = 4;
	clicks = 0;
	context.fillStyle= document.getElementById("color").value;
}, false);

polyl.addEventListener("click", function(){
	clicks = 0;
	pointer = 1;
	context.fillStyle= document.getElementById("color").value;
}, false);

polyg.addEventListener("click", function(){
	setVertice();
	clicks = 0;
	pointer = 5;
	context.fillStyle= document.getElementById("color").value;
},false);

clear.addEventListener("click", function(){
	clearCanvas();
	clicks = 0;
},false);


canvas.addEventListener("mousedown", function(e){
	clicks++;
	var rect = canvas.getBoundingClientRect();
	if(clicks == 1){
		x_c0 = parseInt(e.clientX - rect.left);
		y_c0 = parseInt(e.clientY - rect.top);
		polyg_startX = x_c0;
		polyg_startY = y_c0;
	}else if(clicks == 2){
		x_c1 = parseInt(e.clientX - rect.left);
		y_c1 = parseInt(e.clientY - rect.top);
	}
	
	if((pointer == 0 || pointer == 2 || pointer ==3 || pointer == 4)&& clicks == 2){
		if(pointer == 0){
			midLine(x_c0, y_c0, x_c1, y_c1);
		}else if(pointer == 2){
			var d1 = Math.abs(x_c1-x_c0);
			var d2 = Math.abs(y_c1-y_c0);
			var r = Math.sqrt(d1*d1+d2*d2);
			midCircle(x_c0, y_c0,r);
		}else if(pointer == 3){
			var d1 = Math.abs(x_c1-x_c0);
			var d2 = Math.abs(y_c1-y_c0);
			var r = Math.sqrt(d1*d1+d2*d2);
			if(d1 > d2){
				drawEllipse(x_c0, y_c0, r,r/2 );
			}else{
				drawEllipse(x_c0, y_c0, r/2, r );
			}
			
		}else if(pointer == 4){
			midLine(x_c0, y_c0, x_c1, y_c0);
			midLine(x_c0, y_c0, x_c0, y_c1);
			midLine(x_c0, y_c1, x_c1, y_c1);
			midLine(x_c1, y_c1, x_c1, y_c0);
		}
		clicks = 0;
	}else if((pointer == 1 || pointer == 5) && clicks >=2){
		
		if(clicks == 2){
			midLine(x_c0, y_c0, x_c1, y_c1);
		}else if(clicks > 2){
			x_c0 = x_c1;
			y_c0 = y_c1;
			x_c1 = parseInt(e.clientX - rect.left);
			y_c1 = parseInt(e.clientY - rect.top);
			midLine(x_c0, y_c0, x_c1, y_c1);
			polyg_endX = x_c1;
			polyg_endY = y_c1;			
			
		}
		
		if(pointer == 5 && clicks == poly_vertices)
		{
			midLine(polyg_startX, polyg_startY, polyg_endX, polyg_endY);
			clicks = 0;
		}	
	}
});

function clearCanvas(){
	context.clearRect(0,0, canvas.width, canvas.height);
}

function setVertice(){
	if (poly_vertices== null){
		alert("please select number of vertice first");}
	else{
		poly_vertices = document.getElementById("poly_input").value}
	
}



