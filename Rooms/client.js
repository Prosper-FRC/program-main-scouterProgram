const socket = io.connect('http://localhost:5500');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
class Field {
    constructor(bg, width, height) {
        this.bg = bg
        this.width = width
        this.height = height
    }
    draw() {
        ctx.drawImage(this.bg, 0, 0, this.width, this.height)
    }
}
class Grid {
    constructor(width, height, boxWidth, boxHeight) {
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.gridWidth = (width / boxWidth)
        this.gridHeight = (height / boxHeight)
    }
    draw() {
        ctx.beginPath()
        for (let x = 1; x < this.gridWidth; x++) {
            ctx.moveTo(x * this.boxWidth, 0)
            ctx.lineTo(x * this.boxWidth, this.height)
        }
        for (let y = 1; y < this.gridHeight; y++) {
            ctx.moveTo(0, y * this.boxHeight)
            ctx.lineTo(this.width, y * this.boxHeight)
        }
        ctx.stroke()
    }
    placeMarker(x, y, markerColor) {
        ctx.fillStyle = 'rgba('+ markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha+')'
        ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
    }
}

let clientBalls = {};
let selfID;
let image = new Image();
image.src = "Assets/FRC_PlayingField_blue.png";
let scoutData = {};

let field = new Field(image, 800, 755)
const grid = new Grid(field.width, field.height, 47, 58)

let canvasElem = document.querySelector("canvas");

window.onload = function() {
    canvas.width = field.width;
    canvas.height = field.height;
    field.draw()
    grid.draw()
}

socket.on('connect', () => {
    selfID = socket.id;
    userClicks();
    socket.emit('newScouter');
})

socket.on('AssignRobot', (data, scoreData) => {
    scoutData = data;
    //document.getElementById("robot1").style.backgroundColor = "rgb(" + data.markerColor.red + "," + data.markerColor.green + "," + data.markerColor.blue + ")"
    console.log('markerColor: ' + scoutData.markerColor.red);
    for (let property in scoreData["telop"]) {
        let marker = scoreData["telop"][property]
        grid.placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('placeMarker', data => {
    console.log('data:' + data.markerColor.red);
    let mColor = data.markerColor;
    //placeMarker(canvasElem, data.x, data.y, data.markerColor);
    //placeMarker(canvasElem, data.x, data.y, data.color );
    grid.placeMarker(data.x, data.y, data.markerColor)
})

socket.on('redraw', data => {
    ctx.clearRect(0, 0, field.width, field.height)
    field.draw()
    grid.draw()
    for (let property in data) {
        let marker = data[property]
        grid.placeMarker(marker.x, marker.y, marker.markerColor)
    }
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


/*function placeMarker(canvas, x, y, markerColor)
{
    var width = grid.boxWidth //canvas.width/gridWidth;
    var height = grid.boxHeight //canvas.height/gridHeight
    var posx = x*width;
    var posy = y*height;
    ctx.fillStyle = 'rgba('+markerColor.red+','+markerColor.green+','+markerColor.blue+','+markerColor.alpha+')'; //markerColor;
    ctx.fillRect(posx+3,posy+3,width-2, height-2);
}*/


//requestAnimationFrame(renderOnly);






