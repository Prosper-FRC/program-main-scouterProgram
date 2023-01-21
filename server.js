const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];



//************************* END OF PHYSICS ENGINE ***/

//*** GET NEW Robot to scout */
class Markers{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.color = '';
        this.isSelected = false;
        this.gameState = '';
    }
}

//Parent class of the bodies (Ball, Capsule, Box, Star, Wall)
class AllianceColor{
    constuctor(red, green, blue){
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
}

class Scout{
    constructor(name, team, allianceColor, markerColor){
        this.markers = [];
        this.name = name;
        this.team = team;
        this.allianceColor = allianceColor;
        this.markerColor = markerColor;
        //SCOUTERS.push(this);
    }

}


const express = require('express')
const app = express()
const io = require('socket.io')(5500)

express.static('public');

app.get('/', (req, res) => res.send('Hello World!'))

let playerPos = {};
let serverBalls = {};
let scouts = {};
//putWallsAround(0, 0, 640, 480);

io.on('connection', connected);
//setInterval(serverLoop, 1000/60);

function connected(socket){
    socket.on('newScouter', data => {
        console.log("New client connected, with id (yeah): "+socket.id);
        //let markerCol = new markerColor();
        let scoutData = new Scout('Scott', '1411', 'Red', 'rgba(201,255,173,0.5)');
        //let markerColor = new markerColor(255,91,206);
        //scoutData.markerColor = markerColor;

        io.emit('AssignRobot', scoutData);
    })
    socket.on('drawMarker', data => {
       /* console.log("coordinate X: "+data.x);
        console.log("coordinate Y: "+data.y);
        console.log("coordinate Z: "+data.markerColor);*/
        io.emit('placeMarker', data);
    })
    /*socket.on('newPlayer', data => {
        console.log("New client connected, with id: "+socket.id);
        serverBalls[socket.id] = new Capsule(data.x, data.y, data.x+40, data.y, 40, 5);
        serverBalls[socket.id].maxSpeed = 5;
        playerPos[socket.id] = data;
        console.log("Starting position: "+playerPos[socket.id].x+" - "+playerPos[socket.id].y);
        console.log("Current number of players: "+Object.keys(playerPos).length);
        console.log("players dictionary: ", playerPos);
        io.emit('updatePlayers', playerPos);
    })*/
    socket.on('disconnect', function(){
       // serverBalls[socket.id].remove();
       // delete serverBalls[socket.id];
       // delete playerPos[socket.id];
        console.log("Goodbye client with id "+socket.id);
        console.log("Current number of players: "+Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })
    /*socket.on('userCommands', data => {
        serverBalls[socket.id].left = data.left;
        serverBalls[socket.id].up = data.up;
        serverBalls[socket.id].right = data.right;
        serverBalls[socket.id].down = data.down;
        serverBalls[socket.id].action = data.action;
    })*/
}
/*
function serverLoop(){
    userInteraction();
    physicsLoop();
    for (let id in serverBalls){
        playerPos[id].x = serverBalls[id].pos.x;
        playerPos[id].y = serverBalls[id].pos.y;
        playerPos[id].angle = serverBalls[id].angle;
    }
    //console.log(playerPos);
    io.emit('positionUpdate', playerPos);
}*/