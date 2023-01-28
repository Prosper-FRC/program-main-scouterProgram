const BODIES = [];
const COLLISIONS = [];
const SCOUTERS = [];

//************************* END OF PHYSICS ENGINE ***/

/*class MarkerColor {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}*/

const express = require('express')
const fs = require('fs')
const bodyParser = require("body-parser")
const app = express()
//const io = require('socket.io')(5500)
const gp = require('./Server/gamePieces')
const fw = require('./Server/fileWriter')
const ref = require('./Server/referee') 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//import { MarkerColor } from './gamePieces'
//MarkerColor = require('./gamePieces')

const http = require("http")
const socketio = require("socket.io")
const path = require("path")
const httpserver = http.Server(app)
const io = socketio(httpserver)

express.static('public');
app.use(express.static(__dirname + "/Rooms"))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, 'Rooms/index.html'))
})

app.get('*', function(req, res) {
    res.redirect('/game')
})

let playerPos = {}
let scouts = []
let scoutData
let gamemarkers = {}
let gamePlay = {}
let score = 0

initGame();
io.on('connection', connected);
//setInterval(serverLoop, 1000/60);

function connected(socket){
    socket.on('newScouter', data => {
        console.log("New client connected, with id (yeah): " + socket.id)
        /*for (let scout in scouts) {
            if (scouts[scout].id == '') {
                scouts[scout].id = socket.id
                break
            }
        }*/
        //let scout = scouts.find(item => item.id === socket.id)
        //io.emit('AssignRobot', scoutData);
        io.emit('AssignRobot', scouts[0].data)
        //io.emit('AssignRobot', scout)
    })

    socket.on('drawMarker', data => {
        let scout = scouts.find(item => item.id === socket.id)
        let drawMarker = {
            x: data.x,
            y: data.y,
            //markerColor: scoutData.markerColor

            markerColor: scouts[0].data.markerColor
            //markerColor: scout.data.markerColor
        }
        let markerId = "x" + drawMarker.x + "y" + drawMarker.y;
        if(!(markerId in gamemarkers))
        {
            addMarker(drawMarker, markerId);
            

            // scoring compoentents here 
            score = score + ref.TileScores(drawMarker.x, drawMarker.y);
            
            console.log(score);
            
            /*console.log("coordinate X: "+data.x);
            console.log("coordinate Y: "+data.y);*/
            //console.log("coordinate Red: "+drawMarker.markerColor.red);
            io.emit('placeMarker', drawMarker);
        } else {
            deleteMarker(markerId)
            io.emit('redraw', gamemarkers)
        }
    })

    socket.on('disconnect', function(){
        //let scout = scouts.find(item => item.id === socket.id)
        //scout.id = ''
        //console.log(scouts)
        console.log("Goodbye client with id " + socket.id);
        console.log("Current number of players: " + Object.keys(playerPos).length);
        //io.emit('updatePlayers', playerPos);
    })

}

function initGame()
{
    let markerColor = new gp.MarkerColor(235,255,137,0.5);
    gamePlay = new gp.GamePlay();
    scoutData = new gp.Team('Scott', '5411', 'Red', markerColor);
    const content = fs.readFileSync('./data/scouters.json', {encoding:'utf8', flag:'r'})
    const data = JSON.parse(content)
    for (let scout in data.blue) {
        scouts.push(new gp.User(
            '', 
            new gp.Team(
                data.blue[scout].name,
                '',
                'Blue',
                new gp.MarkerColor(
                    Number(data.blue[scout].color.red),
                    Number(data.blue[scout].color.green),
                    Number(data.blue[scout].color.blue),
                    0.5
                )
            )
        ))
    }
    //fw.addScout(scoutData.name, scoutData);
    fw.addNewGame('match1');
}

function addMarker(gameMarker,markerid)
{
    let newMarker = new gp.Markers(gameMarker.x, gameMarker.y);
    newMarker.markerColor = gameMarker.markerColor;
    gamemarkers[markerid] = newMarker;
    console.log(gamemarkers);
}

function deleteMarker(markerid) {
    delete gamemarkers[markerid]
    console.log(gamemarkers)
}

httpserver.listen(5500)