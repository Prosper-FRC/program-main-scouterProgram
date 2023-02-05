const socket = io.connect('http://localhost:5500')

let blueCanvas = document.getElementById("blue-canvas")
let redCanvas = document.getElementById("red-canvas")

let blueImage = new Image()
blueImage.src = "Assets/FRC_PlayingField_blue.png"
let redImage = new Image()
redImage.src = "Assets/FRC_PlayingField_red.png"

let blueField = new Field(blueImage, 800, 755)
blueField.setCanvas(blueCanvas)
let redField = new Field(redImage, 800, 755)
redField.setCanvas(redCanvas)

let blueGrid = new Grid(blueField.width, blueField.height, 47, 58)
blueGrid.setCanvas(blueCanvas)
let redGrid = new Grid(redField.width, redField.height, 47, 58)
redGrid.setCanvas(redCanvas)
//let scoreboard = new ScoreBoard()

window.onload = function() {
    blueCanvas.width = blueField.width
    blueCanvas.height = blueField.height
    redCanvas.width = redField.width
    redCanvas.height = redField.height

    blueField.draw()
    blueGrid.draw()
    redField.draw()
    redGrid.draw()
}

socket.on('connect', () => {
    socket.emit('newAdmin')
})

socket.on('placeMarker', (color, data) => {
    if (color == "blue") {
        blueGrid.placeMarker(data.x, data.y, data.markerColor)
    } else if (color == "red") {
        redGrid.placeMarker(data.x, data.y, data.markerColor)
    }
})

socket.on('redraw', (color, data) => {
    if (color == "blue") {
        blueField.clear()
        blueField.draw()
        blueGrid.draw()
        for (let property in data) {
            let marker = data[property]
            blueGrid.placeMarker(marker.x, marker.y, marker.markerColor)
        }
    } else if (color == "red") {
        redField.clear()
        redField.draw()
        redGrid.draw()
        for (let property in data) {
            let marker = data[property]
            redGrid.placeMarker(marker.x, marker.y, marker.markerColor)
        }
    }
})