const socket = io.connect('http://localhost:5500');

let clientBalls = {}
let scoutData = {}

let canvas = document.getElementById("canvas")

let image = new Image();
let field
let grid

let blueAllianceScore = document.getElementById("B-point")
let redAllianceScore = document.getElementById("A-point")

let autonScore = document.getElementById("auton")
let teleopScore = document.getElementById("telop")
let totalScore = document.getElementById("total")
let linksScore = document.getElementById("links")
let coopScore = document.getElementById("co-op")
let rankingPoints = document.getElementById("ranking-points")
let teleopParking = document.getElementById("telopParking") 
let autonParking = document.getElementById("autonParking")

function gameChange() {
    socket.emit('gameChange')
}

socket.on('connect', () => {
    socket.emit('newScouter')
})

socket.on('AssignRobot', (team) => {
    if(!Object.keys(scoutData).length)
    {
        scoutData = team;
    }
    document.getElementById("number-display").style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
    document.getElementById("team-number").textContent = team.teamNumber
})

socket.on('drawfield', (gameField, gameGrid) => 
{
    image.src = gameField.bg

    field = new Field(canvas, image, gameField.width, gameField.height)
    grid = new Grid(canvas, gameGrid.width, gameGrid.height, gameGrid.boxWidth, gameGrid.boxHeight)

    canvas.width = field.width
    canvas.height = field.height

    image.onload = () => 
    {
        field.draw()
        grid.draw()
    }
})

socket.on('placeMarker', marker => {
    grid.placeMarker(marker.x, marker.y, marker.markerColor, marker.gameState)
})

socket.on('rotate', (rotation) => 
{
    canvas.style.transform = rotation
})

socket.on('clear', () => {
    field.clear()
    field.draw()
    grid.draw()
})

socket.on('draw', markers => {
    for (let index in markers) {
        let marker = markers[index]
        grid.placeMarker(marker.x, marker.y, marker.markerColor, marker.gameState)
    }
})

socket.on('gameOver', () => {
    document.getElementById("session-handler").submit()
})

socket.on('getRobot', robots => {})