var width  = 1200;
var height = 560;
var body = d3.select("body");
var numberOfTriangles = 30;
var seno = Math.pow(3,1/2)/2;
var trianglesArray = [];
var group = [];
var isMouseMoving = false;

var svg = body.append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid black")
  .on("mousemove", function() {
        mouse = d3.mouse(this);
        isMouseMoving=true;
   });

function initialize(number) {
  for (var i=0; i<number; i++) {
    group[i] = svg.append("g");
    trianglesArray[i]=drawTriangle(i);
    initPosition(i);
  }
}

function drawTriangle(i){
    var x_temp = Math.floor(Math.random() * width/256 + width/512);
    var y_temp = Math.floor(Math.random() * height/256 + height/512);
    var k = Math.floor(Math.random() * 80 + 10);
    var v_up = (y_temp*k-k);
    var v_down = (y_temp*k + k*0.5);
    var centerY = (v_up + 2*v_down)/3;
    var centerX = x_temp*k;
    var radius = centerY - (y_temp*k-k);
    return group[i].append("svg:polygon")
      .attr("points", function(){
        return (x_temp*k)+','+(y_temp*k-k)+' '+(x_temp*k-k*seno)+','+(y_temp*k + k*0.5)+' '+(x_temp*k+k*seno)+','+(y_temp*k+k*0.5)})
      .attr("center", "-"+centerX+",-"+centerY)
      .attr("radius", radius)
      .attr("fill", "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")")
      .attr("opacity", 1)
      .attr("stroke", "black")
      .attr("transform","translate(-"+centerX+",-"+centerY+")");
}

function initPosition(i) {
  var radius = trianglesArray[i][0][0].attributes[2].nodeValue;
  var w_border = Math.floor(Math.random() * (width - 2*radius) + 2*radius);
  var h_border = Math.floor(Math.random() * (height - 2*radius) + 2*radius);
  var new_w = w_border - radius;
  var new_h = h_border - radius;
  var centerXStr = new_w.toString();
  var centerYStr = new_h.toString();
  var new_center = "-" + centerXStr + ",-" + centerYStr;
  trianglesArray[i][0][0].attributes[1].nodeValue = new_center;
  group[i].transition().attr("transform","translate("+new_w+","+new_h+")");
}

function moveTriangles(number) {
  if(isMouseMoving){
    for(var i=0; i < number; i++){
      var center = trianglesArray[i][0][0].attributes[1].nodeValue;
      var c_temp = center.split("-")[1];
      var centerX = parseInt(c_temp.split(",")[0]);
      var centerY = parseInt(center.split(",-")[1]);
      var radius = trianglesArray[i][0][0].attributes[2].nodeValue;
      var deltaX = centerX-mouse[0];
      var deltaY = centerY-mouse[1];
      var dx = (deltaX/(Math.abs(deltaX)+ Math.abs(deltaY))) * 3;
      var dy = (deltaY/(Math.abs(deltaX)+ Math.abs(deltaY))) * 3;
      var new_centerX = centerX+dx;
      var new_centerY = centerY+dy;
      if (new_centerX > (width - radius))
            new_centerX = width - radius;
      if (new_centerX < radius)
            new_centerX = radius;
      if (new_centerY > (height - radius))
            new_centerY = height - radius;
      if (new_centerY < radius)
            new_centerY = radius;
      group[i].transition()
          .duration(500)
          .ease("linear")
          .attr("transform","translate("+new_centerX+","+new_centerY+")");
      var centerXStr = new_centerX.toString();
      var centerYStr = new_centerY.toString();
      var new_center = "-"+centerXStr+",-"+centerYStr;
      trianglesArray[i][0][0].attributes[1].nodeValue = new_center;
    }
  }
}

initialize(numberOfTriangles);
d3.timer(function(){moveTriangles(numberOfTriangles)});