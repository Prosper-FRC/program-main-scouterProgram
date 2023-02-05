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