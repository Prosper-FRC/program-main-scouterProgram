const socket = io.connect('http://localhost:5500');

let clientBalls = {};
let selfID;
var image = new Image();
image.src = '../Assets/FRC_PlayingField1.png';
var scoutData = {};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let canvasElem = document.querySelector("canvas");


window.onload = function() {
  //  let mycanvas = document.getElementById('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
//canvas.drawImage("FRC_PlayingField.png", 800,819);

//var img = document.img.drawImage() getElementById("playingField");
    ctx.drawImage(image, 0,0);
};
// putWallsAround(0, 0, canvas.clientWidth, canvas.clientHeight);

socket.on('connect', () => {
    selfID = socket.id;
    userClicks();
    socket.emit('newScouter');

})

socket.on('AssignRobot', data => {
    scoutData = data;
    console.log('markerColor: '+scoutData.markerColor.red);
})

socket.on('placeMarker', data => {
    console.log('data:'+data.markerColor.red);
    let mColor = data.markerColor;
    placeMarker(canvasElem, data.x, data.y, data.markerColor);
    //placeMarker(canvasElem, data.x, data.y, data.color );
})


socket.on('getRobot', robots => {
    //ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    /*playersFound = {};
    for(let id in players){
        if(clientBalls[id] === undefined && id !== socket.id){
            clientBalls[id] = new Capsule(players[id].x, players[id].y, players[id].x+40, players[id].y, 40, 5);
            clientBalls[id].maxSpeed = 5;
        }
        playersFound[id] = true;
    }
    for(let id in clientBalls){
        if(!playersFound[id]){
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }*/
})
/*
socket.on('updatePlayers', players => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    playersFound = {};
    for(let id in players){
        if(clientBalls[id] === undefined && id !== socket.id){
            clientBalls[id] = new Capsule(players[id].x, players[id].y, players[id].x+40, players[id].y, 40, 5);
            clientBalls[id].maxSpeed = 5;
        }
        playersFound[id] = true;
    }
    for(let id in clientBalls){
        if(!playersFound[id]){
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }
})*/
/*
socket.on('positionUpdate', playerPos => {
    for(let id in playerPos){
        if(clientBalls[id] !== undefined){
            clientBalls[id].setPosition(playerPos[id].x, playerPos[id].y, playerPos[id].angle);
        }
    }
})*/


function placeMarker(canvas, x, y, markerColor)
{
    var ctx = canvas.getContext("2d");
    var width = canvas.width/20;
    var height = canvas.height/16
    var posx = x*width ;
    var posy = y*height;
    ctx.fillStyle = 'rgba('+markerColor.red+','+markerColor.green+','+markerColor.blue+','+markerColor.alpha+')'; //markerColor;
    ctx.fillRect(posx+3,posy+3,width-2, height-2);

}


//requestAnimationFrame(renderOnly);






