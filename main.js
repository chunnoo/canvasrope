function resize(){
    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function getTouchPos(canvas, evt) {
    evt.preventDefault();
    return {
        x: evt.targetTouches[0].pageX - canvas.offsetLeft,
        y: evt.targetTouches[0].pageY - canvas.offsetTop
    };
}

function init(){

	canvas = document.getElementById("canvasOne");
	resize();
	ctx = canvas.getContext("2d");
    
	npts = 64;
	pts = [npts];
    length = 8;
    speed = 8;
    
    mouse = {
        x: 0,
        y: 0
    };
    
	for (var i=0; i<npts; i++){
		pts[i] = {
            x: 10 + length*i,
            y: 10
        };
	}
	
	draw();
    
}

function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
    var grd = ctx.createRadialGradient(
        pts[0].x,pts[0].y,0,
        pts[0].x,pts[0].y,length*npts
    );
    
    //ctx.fillStyle = "white";
	//ctx.fillRect(0,0,canvas.width, canvas.height);
    
    ctx.beginPath();
	ctx.moveTo(pts[0].x, pts[0].y);
    //lines
    /*for (var i=1; i<npts; i++){
		ctx.lineTo(pts[i].x, pts[i].y);
	}*/
    
    //quadratic curve
	for (var i=1; i<npts - 2; i++){
		ctx.quadraticCurveTo(
            pts[i].x,
            pts[i].y,
            (pts[i].x + pts[i+1].x)/2,
            (pts[i].y + pts[i+1].y)/2
        );
	}
    /*ctx.quadraticCurveTo(
        pts[i].x,
        pts[i].y,
        pts[i+1].x,
        pts[i+1].y
    );*/
    
    grd.addColorStop(0, "black");
    grd.addColorStop(0.5, "gray");
	ctx.lineWidth = 4;
    ctx.strokeStyle = grd;
	ctx.lineCap = "round";
    ctx.lineJoin = "round";
	ctx.stroke();
    
    canvas.addEventListener("mousemove", function(evt) {
        var mousePos = getMousePos(canvas, evt);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;
    }, false);
    
    canvas.addEventListener("touchmove", function(evt) {
        var touchPos = getTouchPos(canvas, evt);
        mouse.x = touchPos.x;
        mouse.y = touchPos.y;
    }, false);
	
    //fading stroke
	/*for (var i=npts-1; i>0; i--){
		pts[i].x = pts[i-1].x;
		pts[i].y = pts[i-1].y;
	}
    pts[0].x = mouse.x;
    pts[0].y = mouse.y;*/
    
    //rope
    var vec = {
        x: 0,
        y: 0,
        len: 0
    };
    //pts[0].x = mouse.x;
    //pts[0].y = mouse.y;
    vec.x = mouse.x - pts[0].x;
    vec.y = mouse.y - pts[0].y;
    vec.len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    if (vec.len > speed){
        vec.x = vec.x / vec.len;
        vec.y = vec.y / vec.len;
        pts[0].x = pts[0].x + vec.x * speed;
        pts[0].y = pts[0].y + vec.y * speed;
    }else{
        pts[0].x = mouse.x;
        pts[0].y = mouse.y;
    }
    for (var i=0; i<npts - 1; i++){
        vec.x = pts[i].x - pts[i+1].x;
        vec.y = pts[i].y - pts[i+1].y;
        vec.len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
        vec.x = vec.x / vec.len;
        vec.y = vec.y / vec.len;
        pts[i+1].x = pts[i].x - vec.x * length;
        pts[i+1].y = pts[i].y - vec.y * length;
    }
    
	
    window.addEventListener("resize", resize);
    
	setTimeout(draw, 1000/60);
    
}

window.addEventListener("load", init, false);




