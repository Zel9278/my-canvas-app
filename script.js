var canvas = document.getElementById("draw"),
    ctx = canvas.getContext("2d");

function canvas_size() {
  var element = document.getElementById("box");
  var csw = document.getElementById("canvas_width").value;
  var csh = document.getElementById("canvas_height").value;
  element.style.width = csw + 'px';
  element.style.height = csh + 'px';
  
  ctx.canvas.width = $("#box").width();
  ctx.canvas.height = $("#box").height();
}

ctx.canvas.width = 512;
ctx.canvas.height = 512;

var pen = document.getElementById('pencil');
var era = document.getElementById('eraser');
function tool(btnNum){
  if (btnNum == 1){
    ctx.globalCompositeOperation = 'source-over';
  }
  else if (btnNum == 2){
    ctx.globalCompositeOperation = 'lighter';
  }
  else if (btnNum == 3){
    ctx.globalCompositeOperation = 'destination-over';
  }
  else if (btnNum == 4){
    ctx.globalCompositeOperation = 'destination-out';
  }
}

var mouse = {x:0,y:0,x1:0,y1:0,color: 'white'};
var draw = false;

canvas.addEventListener("mousemove",function(e) {
  var rect = e.target.getBoundingClientRect();
  ctx.lineWidth = document.getElementById("lineWidth").value;
  ctx.globalAlpha = document.getElementById("alpha").value/100;

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  
  var color = document.getElementById("hex").value;
  if(draw === true) {
    ctx.beginPath();
    ctx.moveTo(mouseX1,mouseY1);
    ctx.lineTo(mouseX,mouseY);
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.stroke();
    mouseX1 = mouseX;
    mouseY1 = mouseY;
  }
});

canvas.addEventListener("mousedown",function(e) {
  draw = true;
  mouseX1 = mouseX;
  mouseY1 = mouseY;
  undoImage = ctx.getImageData(0, 0,canvas.width,canvas.height);
});

canvas.addEventListener("mouseup", function(e){
  draw = false;
});

/*ーーーーーーーーーーー*/

lineWidth.addEventListener("mousemove", function(){
  var lineNum = document.getElementById("lineWidth").value;
  document.getElementById("lineNum").innerHTML = lineNum;
});

alpha.addEventListener("mousemove", function(){
  var alphaNum = document.getElementById("alpha").value;
  document.getElementById("alphaNum").innerHTML = alphaNum;
});

function delete_canvas(){
  var ret = confirm('clear canvas');
  if (ret == true){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function save() {
  var link = document.createElement("a");
  var base64 = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var blob = Base64toBlob(base64);
  var fileName = document.getElementById("filename").value + ".png";
  
  if(window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(Base64toBlob(base64), fileName);
  } else {
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

$("#upload").change(function(e) {
  var img = new Image;
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
  }
});


/*ーーーーーーーーーーー*/

var finger=new Array;
for(var i=0;i<10;i++){
  finger[i] = {
    x:0,y:0,x1:0,y1:0,
    color:"rgb("
    +Math.floor(Math.random()*16)*15+","
    +Math.floor(Math.random()*16)*15+","
    +Math.floor(Math.random()*16)*15
    +")"
  };
}

canvas.addEventListener("touchstart",function(e){
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  ctx.lineWidth = document.getElementById("lineWidth").value;
  ctx.globalAlpha = document.getElementById("alpha").value/100;
  for(var i=0;i<finger.length;i++){
    finger[i].x1 = e.touches[i].clientX-rect.left;
    finger[i].y1 = e.touches[i].clientY-rect.top;
  }
});

canvas.addEventListener("touchmove",function(e){
  e.preventDefault();
  var rect = e.target.getBoundingClientRect();
  var color = document.getElementById("hex").value;
  for(var i=0;i<finger.length;i++){
    finger[i].x = e.touches[i].clientX-rect.left;
    finger[i].y = e.touches[i].clientY-rect.top;
    ctx.beginPath();
    ctx.moveTo(finger[i].x1,finger[i].y1);
    ctx.lineTo(finger[i].x,finger[i].y);
    ctx.lineCap="round";
    ctx.strokeStyle = color;
    ctx.stroke();
    finger[i].x1=finger[i].x;
    finger[i].y1=finger[i].y;
  }
});

lineWidth.addEventListener("touchmove", function(){
  var lineNum = document.getElementById("lineWidth").value;
  document.getElementById("lineNum").innerHTML = lineNum;
});

alpha.addEventListener("touchmove", function(){
  var alphaNum = document.getElementById("alpha").value;
  document.getElementById("alphaNum").innerHTML = alphaNum;
});

function Base64toBlob(base64) {
  var tmp = base64.split(',');
  var data = atob(tmp[1]);
  var mime = tmp[0].split(':')[1].split(';')[0];
  var buf = new Uint8Array(data.length);
  for (var i = 0; i < data.length; i++) {
    buf[i] = data.charCodeAt(i);
  }
  var blob = new Blob([buf], { type: mime });
  return blob;
}

var recorder;
var animate;

function recstart(){
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  var stream = canvas.captureStream();
  recorder = new MediaRecorder(stream);
  recorder.start();
}

function save_rec(){
  recorder.stop();
  recorder.ondataavailable = function(e) {
    var anchor = document.getElementById('downloadlink');
    var videoBlob = new Blob([e.data], { type: e.data.type });
    var blobUrl = window.URL.createObjectURL(videoBlob);
    anchor.download = 'canvas-video.webm';
    anchor.href = blobUrl;
    anchor.style.display = 'block';
  }
}