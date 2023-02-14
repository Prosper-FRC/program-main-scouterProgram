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
image.blue.src = "../Assets/FRC_PlayingField_blue.png"
image.red.src = "../Assets/FRC_PlayingField_red.png"

let field = {
    "blue": new Field(image.blue, 800, 755),
    "red": new Field(image.red, 800, 755)
}
field.blue.setCanvas(canvas.blue)
field.red.setCanvas(canvas.red)

let grid = {
    "blue": new Grid(field.blue.width, field.blue.height, 47, 58),
    "red": new Grid(field.red.width, field.red.height, 47, 58)
}
grid.blue.setCanvas(canvas.blue)
grid.red.setCanvas(canvas.red)
//let scoreboard = new ScoreBoard()

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

/*socket.on('toggleGameMode', allianceColor => {
    //document.getElementById('gamestate').checked = ''
    if (allianceCOlor == 'blue') {
        document.getElementById('blueGameState').checked
    } else if (allianceColor == 'red') {
        document.getElementById('redGameState').checked
    }
})*/

/*function gameChange() {
    socket.emit('gameChange')
}*/

function blueGameChange() {
    socket.emit('gameChange', 'blue')
}

function redGameChange() {
    socket.emit('gameChange', 'red')
}