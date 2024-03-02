const rgb = (red, green, blue) => 
{
    return "rgb(" + red + "," + green + "," + blue + ")"
}

const parseTable = (table) => 
{
    let data = {}
    for (let row = 1; row < table.rows.length; row++)
    {
        data[row] = []
        let record = table.rows[(row - 1)]
        for (let cell = 1; cell < record.cells.length; cell++)
        {
            data[row].push(record.cells[cell].getElementsByTagName('input')[0].value)
        }
    }
    return data
}
class Field 
{
    constructor(canvas, bg, width, height) {
        this.canvas = canvas
        this.bg = bg
        this.width = width
        this.height = height
        this.ctx = this.canvas.getContext('2d')
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        //this.ctx.drawImage(this.bg, 0, 0, this.width, this.height)
        
        this.ctx.drawImage(this.bg, 0,0)


        
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}
class Grid 
{
    constructor(canvas, width, height, boxWidth, boxHeight) {
        this.canvas = canvas
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.gridWidth = (width / boxWidth)
        this.gridHeight = (height / boxHeight)
        this.ctx = this.canvas.getContext('2d')
        this.gameImages = [];
        this.isAmplified = false
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
        this.ctx.shadowBlur = 0;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = `rgb(192,192,192)`;
        this.ctx.stroke()
    }
    getMousePosition(event) {
        //alert('offsetX: ' + Math.floor(event.offsetX / this.boxWidth) + ' offsetY: ' + Math.floor(event.offsetY / this.boxHeight));
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor, gameState) {
        //alert("hello")
        this.ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        if (gameState == "auton") 
        {
            this.ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
            
        } 
        else if (gameState == "teleop")
        {
            this.ctx.beginPath()
            this.ctx.arc(x * this.boxWidth + this.boxWidth / 2, y * this.boxHeight + this.boxHeight / 2, 10, 0, 2 * Math.PI)
        }
        this.ctx.fill()
    }
    placeIndicator(x, y, allianceColor) {
        
        this.ctx.fillStyle = allianceColor
        this.ctx.beginPath()
        this.ctx.arc(x * this.boxWidth + this.boxWidth/2, y * this.boxHeight + this.boxHeight / 2, 2, 0, 2 * Math.PI)
        this.ctx.fill()
    }
    drawFlash(marker) {
        
    }
    turnOnAmplify(){
        this.isAmplified = true;
    }
    turnOffAmplify(){
        this.isAmplified = false;
    }
    drawAmplify() {
        //alert("amplify: " + this.isAmplified)
        if (this.isAmplified == true)
        {
            
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = "yellow";
            this.ctx.shadowBlur = 40;
            this.ctx.shadowColor = "#FFD800";

            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
    drawImage(marker) {
        //alert(JSON.stringify(marker))
       // this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.canvas.width/2,this.canvas.height/2);
        //this.ctx.rotate(60*Math.PI/180);
        this.ctx.rotate(marker.markerRotation*Math.PI/180);
        this.ctx.fillStyle = 'rgba(' + marker.markerColor.red + ',' + marker.markerColor.green + ',' + marker.markerColor.blue + ',' + marker.markerColor.alpha +')'
        if(marker.markerType == "Spotlight")
        {
            this.ctx.beginPath()
            //this.ctx.arc(160, -11, 10, 0, 2 * Math.PI)
            this.ctx.arc(marker.markerLocationCoordinates.x, marker.markerLocationCoordinates.y, 10, 0, 2 * Math.PI)
            this.ctx.fill();
        }
        else
        {
           // this.ctx.fillRect(-marker.markerLocationCoordinates.x/2, -marker.markerLocationCoordinates.y/2, 20, 40)
            //this.ctx.fillRect(-44,-240, 8, 75)
            this.ctx.fillRect(marker.markerLocationCoordinates.x, marker.markerLocationCoordinates.y, marker.markerLocationCoordinates.w, marker.markerLocationCoordinates.h)

        }
        this.ctx.restore();
        //this.ctx.fillRect(marker.x * this.boxWidth, marker.y * this.boxHeight, 50, 100)
       // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
       /* let markerImage = new Image();
        markerImage.onload = function () {
            // Done loading, now we can use the image
            this.ctx.drawImage(trap1, marker.markerLocationCoordinates.x,marker.markerLocationCoordinates.y);
        };
        
        markerImage.src =  "../Assets/trap1.png";//marker.markerImage;*/
        //alert(marker.markerLocationCoordinates.x)
        //this.ctx.drawImage(this.gameImages[marker.markerLocationType], marker.markerLocationCoordinates.x,marker.markerLocationCoordinates.y);
        //let c = this.canvas.getContext("2d");
        //this.ctx.drawImage(markerImage, 450,289);
    }
}

class ScoreCard {
    constructor(
        autonAmp,
        teleopAmp,
        autonSpeaker,
        teleopSpeaker,
        teleopAmplified
        
    ) {
        this.autonAmp = autonAmp
        this.teleopAmp = teleopAmp
        this.autonSpeaker = autonSpeaker
        this.teleopSpeaker = teleopSpeaker
        this.teleopAmplified = teleopAmplified
    }

    renderAutonAmp(score) {
        this.autonAmp.innerHTML = score
    }

    renderTeleopAmp(score){
        this.teleopAmp.innerHTML = score
    }

    renderTeleopAmp(score) {
        // alert("score: " + score)
        this.teleopAmp.innerHTML = score
    }

    renderAutonSpeaker(score) {
        this.autonSpeaker.innerHTML = score
    }

    renderTeleopSpeaker(score) {
        this.teleopSpeaker.innerHTML = score
    }

    renderTeleopAmplified(score) {
        this.teleopAmplified.innerHTML = score
    }

    clearScores() {
        /* this.autonScore.innerHTML = "0"
        this.teleopScore.innerHTML = "0"
        this.autonParkingScore.innerHTML = "0"
        this.teleopParkingScore.innerHTML = "0"*/
    }
}

class ScoreBoard {
    constructor( scoreItems
    ) {
        this.scoreItems = scoreItems;
    }

    renderTotalScore(score){

    }

    renderAutonAmpCount(score) {
        this.scoreItems.autonAmpCount.innerHTML = score
    }
    renderAutonAmpScore(score) {
        this.scoreItems.autonAmpScore.innerHTML = score
    }

    renderAutonSpeakerCount(score) {
        this.scoreItems.autonSpeakerCount.innerHTML = score
    }
    renderAutonSpeakerScore(score) {
        this.scoreItems.autonSpeakerScore.innerHTML = score
    }

    renderAutonTrapCount(score) {
        this.scoreItems.autonTrapCount.innerHTML = score
    }
    renderAutonTrapScore(score) {
        this.scoreItems.autonTrapScore.innerHTML = score
    }

    renderAutonMobileScore(score) {
        this.scoreItems.autonMobileScore.innerHTML = score
    }
    
    renderTeleopAmpCount(score) {
        this.scoreItems.teleopAmpCount.innerHTML = score
    }
    renderTeleopAmpScore(score) {
        this.scoreItems.teleopAmpScore.innerHTML = score
    }

    renderTeleopSpeakerCount(score) {
        this.scoreItems.teleopSpeakerCount.innerHTML = score
    }
    renderTeleopSpeakerScore(score) {
        this.scoreItems.teleopSpeakerScore.innerHTML = score
    }

    renderTeleopTrapCount(score) {
        this.scoreItems.teleopTrapCount.innerHTML = score
    }
    renderTeleopTrapScore(score) {
        this.scoreItems.teleopTrapScore.innerHTML = score
    }
    
    renderScore(score) {
       this.scoreItems.TotalScore.innerHTML = score
    }

    renderAutonScore(score) {
        this.scoreItems.AutonScore.innerHTML = score
    }

    renderTeleopScore(score) {
        this.scoreItems.TeleopScore.innerHTML = score
    }

    renderHarmonyScore(score) {
        this.scoreItems.HarmonyScore.innerHTML = score
    }

    renderTotalScoreBlue(score){
        this.scoreItems.blueTotalScore.innerHTML = score
    }
    
    renderTotalScoreRed(score){
        this.scoreItems.redTotalScore.innerHTML = score
    }

    clearScores() {
        this.scoreItems.allianceScore.innerHTML = "0"
        this.scoreItems.opposingScore.innerHTML = "0"
        this.scoreItems.totalScore.innerHTML = "0"
        this.scoreItems.linksScore.innerHTML = "0"
        this.scoreItems.coopScore.innerHTML = "0"
        this.scoreItems.rankingPoints.innerHTML = "0"
    }
}