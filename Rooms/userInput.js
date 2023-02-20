class Field {
    constructor(bg, width, height) {
        this.bg = bg
        this.width = width
        this.height = height
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.drawImage(this.bg, 0, 0, this.width, this.height)
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
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
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.beginPath()
        for (let x = 1; x < this.gridWidth; x++) {
            this.ctx.moveTo(x * this.boxWidth, 0)
            this.ctx.lineTo(x * this.boxWidth, this.height)
        }
        for (let y = 1; y < this.gridHeight; y++) {
            this.ctx.moveTo(0, y * this.boxHeight)
            this.ctx.lineTo(this.width, y * this.boxHeight)
        }
        this.ctx.stroke()
    }
    getMousePosition(event) {
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor) {
        this.ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        //this.ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
        this.ctx.beginPath()
        this.ctx.arc(x * this.boxWidth + this.boxWidth/2, y * this.boxHeight + this.boxHeight/2, 20,0, 2*Math.PI )
        this.ctx.fill()
    }
    drawLink(x, y) {
        this.ctx.strokeRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight * 3)
    }
}
/*class ScoreBoard {
    constructor() {
        this.redAllianceScore = 0;
        this.blueAllianceScore = 10;
        this.redAllianceLinks = 0;
        this.blueAllianceLinks = 0;
        this.redAllianceAutonScore = 0;
        this.blueAllianceAutonScore = 0;
        this.redAllianceTelopScore = 0;
        this.blueAllianceTelopScore = 0;
        this.redCoopScore = 0;
        this.blueCoopScore = 0;
    }
    //functions to update the scoreboard table
    //if the table is being changed, remember to update the ID's of the tables and cells appropriately
    displayRedScore() {
        document.getElementById("redTotalScore").rows[0].cells.namedItem("redScore").innerHTML = this.redAllianceScore
    }
    displayBlueScore() {
        document.getElementById("blueTotalScore").rows[0].cells.namedItem("blueScore").innerHTML = this.blueAllianceScore
    }
    displayRedLinks() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redLinks").innerHTML = this.redAllianceLinks
    }
    displayBlueLinks() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueLinks").innerHTML = this.blueAllianceLinks
    }
    displayRedAuton() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redAuton").innerHTML = this.redAllianceAutonScore
    }
    displayBlueAuton() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueAuton").innerHTML = this.blueAllianceAutonScore
    }
    displayRedTelop() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redTeleop").innerHTML = this.redAllianceTelopScore
    }
    displayBlueTelop() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueTeleop").innerHTML = this.blueAllianceTelopScore
    }
    displayRedCoop() {
        document.getElementById("redAllianceScore").rows[1].cells.namedItem("redCoop").innerHTML = this.redCoopScore
    }
    displayBlueCoop() {
        document.getElementById("blueAllianceScore").rows[1].cells.namedItem("blueCoop").innerHTML = this.blueCoopScore
    }
}*/

class ScoreBoard {
    constructor(allianceScoreEl, allianceLinksEl, autonScoreEl, teleopScoreEl, coopScoreEl, rankingPointsEl, telopParkingEl) {
        this.allianceScoreEl = allianceScoreEl
        this.allianceLinksEl = allianceLinksEl
        this.autonScoreEl = autonScoreEl
        this.teleopScoreEl = teleopScoreEl
        this.coopScoreEl = coopScoreEl
        this.rankingPointsEl = rankingPointsEl
        this.telopParkingEl = telopParkingEl
        this.allianceScore = 0
        this.allianceLinks = 0
        this.autonScore = 0
        this.telopScore = 0
        this.telopParkingScore = 0
        this.autonParkingScore = 0
        this.coopScore = 0
        this.rankingPoints = 0
    }
    drawAllianceScore(allianceScore) {
        this.allianceScore = allianceScore
        this.allianceScoreEl.innerHTML = this.allianceScore
    }
    drawAllianceLinks(allianceLinks) {
        this.allianceLinks = allianceLinks
        this.allianceLinksEl.innerHTML = this.allianceLinks
    }
    drawAutonScore(autonScore) {
        this.autonScore = autonScore
        this.autonScoreEl.innerHTML = this.autonScore
    }
    drawTeleopScore(telopScore) {
        this.telopScore = telopScore
        this.teleopScoreEl.innerHTML = this.telopScore
    }
    drawTeleopParkingScore(parkingScore) {
        this.telopParkingScore = parkingScore
        this.telopParkingEl.innerHTML = this.telopParkingScore
    }
    drawCoopScore(coopScore) {
        this.coopScore = coopScore
        this.coopScoreEl.innerHTML = this.coopScore
    }
    drawRankingPoints(rankingPoints) {
        this.rankingPoints = rankingPoints
        this.rankingPointsEl.innerHTML = this.rankingPoints
    }
}