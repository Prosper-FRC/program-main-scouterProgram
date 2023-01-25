const io = require(socket); 
const ser = require(server);
var score = 0; 

function Marker(type, isOn, value)
{
    this.type = type;
    this.isOn = isOn;
    this.value = value;
}

const MarkerSetTop = [9];
for(x in MarkerSetTop)
{
    MarkerSetA(x) = new Marker("cube", false, 5);
}

io.on('drawMarker', (... args) => 
{
    console.log("Click");
    /*if(marker.x == 3)
    {
        if(marker.y > 4)
        {
            MarkerSetTop[marker.y - 4].isOn = true;
        }
        console.log(MarkerSetTop[marker.y]);
    }*/
});