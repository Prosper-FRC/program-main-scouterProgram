const socket = io.connect('http://localhost:5500')

let indicator = {
    "auton": 0.7,
    "teleop": 0.3
}

let canvas = {
    "blue": document.getElementById("blue-canvas"),
    "red": document.getElementById("red-canvas")
}

let image = {
    "blue": new Image(),
    "red": new Image()
}
//image.blue.src = "../Assets/FRC_PlayingField_blue.png"
//image.red.src = "../Assets/FRC_PlayingField_red.png"
image.blue.src = "../Assets/blueField.png"
image.red.src = "../Assets/redField.png"

let field = {
    //"blue": new Field(image.blue, 800, 755),
    //"red": new Field(image.red, 800, 755)
    "blue": new Field(image.blue, 775, 820),
    "red": new Field(image.red, 775, 820)
}
field.blue.setCanvas(canvas.blue)
field.red.setCanvas(canvas.red)

let grid = {
    //"blue": new Grid(field.blue.width, field.blue.height, 47, 58),
    //"red": new Grid(field.red.width, field.red.height, 47, 58)
    "blue": new Grid(field.blue.width, field.blue.height, 55, 68),
    "red": new Grid(field.red.width, field.red.height, 55, 68)
}
grid.blue.setCanvas(canvas.blue)
grid.red.setCanvas(canvas.red)

let blueAllianceScore = document.getElementById("B-point")
let redAllianceScore = document.getElementById("A-point")

let autonScore = {
    "blue": document.getElementById("auton-blue"),
    "red": document.getElementById("auton-red")
} 
let teleopScore = {
    "blue": document.getElementById("telop-blue"),
    "red": document.getElementById("teleop-red")
}
let totalScore = {
    "blue": document.getElementById("total-blue"),
    "red": document.getElementById("total-red")
}
let links = {
    "blue": document.getElementById("links-blue"),
    "red": document.getElementById("links-red")
}
let coopScore = {
    "blue": document.getElementById("co-op-blue"),
    "red": document.getElementById("co-op-red")
}
let rankingPoints = {
    "blue": document.getElementById("ranking-points-blue"),
    "red": document.getElementById("ranking-points-red")
}

let scoreboard = {
    "blue": new ScoreBoard(blueAllianceScore, autonScore.blue, teleopScore.blue, totalScore.blue, links.blue, coopScore.blue, rankingPoints.blue),
    "red": new ScoreBoard(redAllianceScore, autonScore.red, teleopScore.red, totalScore.red, links.red, coopScore.red, rankingPoints.red)
}

window.onload = function() {
    canvas.blue.width = field.blue.width
    canvas.blue.height = field.blue.height

    canvas.red.width = field.red.width
    canvas.red.height = field.red.height

    field.blue.draw()
    field.red.draw()

    grid.blue.draw()
    grid.red.draw()
}

function makeSelection(checkbox) {
    let checkboxes = document.getElementsByName("scout")

    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })

    if (checkbox.checked) {
        socket.emit('scoutChange', checkbox.value)
    } else {
        socket.emit('adminChange')
    }
}

canvas.blue.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'blue', grid.blue.getMousePosition(e))
})

canvas.red.addEventListener("mousedown", function(e) {
    socket.emit('drawMarker', 'red', grid.red.getMousePosition(e))
})

socket.on('connect', () => {
    socket.emit('newAdmin')
})

socket.on('placeMarker', (color, marker) => {
    grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
})

socket.on('redraw', (color, markers) => {
    field[color].clear()
    field[color].draw()
    grid[color].draw()
    for (let property in markers) {
        let marker = markers[property]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('clear', color => {
    field[color].clear()
    field[color].draw()
    grid[color].draw()
})

socket.on('draw', (color, markers) => {
    for (let index in markers) {
        let marker = markers[index]
        marker.markerColor.alpha = indicator[marker.gameState]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('scoreboard', (color, score) => {
    if (color == "blue") {
        scoreboard[color].drawAllianceScore(score.blueAllianceScore)
        scoreboard[color].drawTeleopScore(score.blueAllianceTelopScore)
    } else if (color == "red") {
        scoreboard[color].drawAllianceScore(score.redAllianceScore)
        scoreboard[color].drawTeleopScore(score.redAllianceTelopScore)
    }
})

/*socket.on('toggleGameMode', allianceColor => {
    //document.getElementById('gamestate').checked = ''
    if (allianceCOlor == 'blue') {
        document.getElementById('blueGameState').checked
    } else if (allianceColor == 'red') {
        document.getElementById('redGameState').checked
    }
})*/

document.getElementById("start").onclick = () => {
    socket.emit('start', document.getElementById("match").value)
}

function getGameState(value) {
    switch(value) {
        case "0":
            return "pregame"
        case "1":
            return "auton"
        case "2":
            return "teleop"
    }
}

function blueGameChange() {
    socket.emit('gameChange', 'blue')
}

function redGameChange() {
    socket.emit('gameChange', 'red')
}

function gameChange(slider) {
    socket.emit('gameChange', 'blue', slider.value)
    socket.emit('gameChange', 'red', slider.value)
}