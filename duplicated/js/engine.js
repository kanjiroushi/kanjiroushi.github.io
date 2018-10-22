let grav=0.5;

// game width
const bw = 800;
// game height
const bh = 592;


let plats=[];
let players = [];
let doors = [];

let keysPressed = {
    left:false,
    right:false,
    up:false,
}


let youWinBoard = new Image();
youWinBoard.src = "sprites/youWinBoard.png";
let playerImage = new Image();
playerImage.src = "sprites/player.png";
let doorsImage = new Image();
doorsImage.src = "sprites/doors.png";
let tiles = new Image();
tiles.src = "sprites/tileset_grassAndDirt.png";


let youWin = false;

let mapData = {};
mapData['tiles'] = [];
mapData['platforms'] = [];
mapData['players'] = [];
mapData['doors'] = [];



loadDefaultLayout = function() {
    $.getJSON( "layouts/twowindowshorizontal.json", function(data) {
        mapData = data;
        reloadMap();
    })
}


window.onload=function() {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
    
    
    //some listener on key press and keey release
    document.addEventListener("keydown",keyDown);
    document.addEventListener("keyup",keyUp);


    //test transfer data via url
    var url = new URL(window.location.href);
    var data = url.searchParams.get("data");

    if(data && data.length > 0) {
        var zip = new JSZip();

        let rawZip = Tools.decodeDataFromUrl(data);
        zip.loadAsync(rawZip).then(function (read) {
            zip.file("data.json").async("string").then((data) => {
                mapData = JSON.parse(data);
                reloadMap();
            })
        });
    } else loadDefaultLayout();


    
}

//gameLoop the page
function gameLoop() {
    

    if(!youWin) {
        players.forEach(function(p) {
            p.update(keysPressed,plats,players); 
        });
        doors.forEach(function(d) {
            d.update(players); 
        });
    }
    render();


    let allDoorsActive = true;
    doors.forEach(function(d) {
        if(!d.active) allDoorsActive = false;
    });
    
    if(allDoorsActive) {
        youWin = true;
    }
    //We request the next animation already
    window.requestAnimationFrame(gameLoop);

}




function render() {

    //We draw the tiles
    ctx.clearRect(0, 0, bw, bh);
    ctx.fillStyle="#67B0CF";
    ctx.fillRect(0,0,bw,bh);
    if(mapData && mapData.tiles) {
        mapData.tiles.forEach(elem => {
            ctx.drawImage(tiles,elem.tileX*16,elem.tileY*16,16,16,elem.posX*16,elem.posY*16,16,16);
        });
    }


    //You win board
    if(youWin) ctx.drawImage(youWinBoard,0,0,300,250,(800-300)/2,0,300,250);

    //drawing doors
    doors.forEach(function(d) {
        d.render();
    });
    //drawing players
    players.forEach(function(p) {
        p.render();
    });

}







reloadMap = function() {
    
    plats = [];
    if(mapData.platforms) mapData.platforms.forEach(elem => {
        plats.push(
            {
            id:'test',
            type:'bg',
            x:elem.x,
            y:elem.y,
            w:elem.w,
            h:elem.h
            }
        );
    })

    players = [];
    if(mapData.players) mapData.players.forEach((elem,i) => {
        console.log(elem);
        players.push(new Player({context:ctx,image:playerImage,playerNum:i,x:elem.x,y:elem.y,reverseCommand:elem.reverseCommand}));
    })
    doors = [];
    if(mapData.doors) mapData.doors.forEach((elem,i) => {
       doors.push(new Door({context:ctx,image:doorsImage,doorNum:i,x:elem.x,y:elem.y}));
    })
    gameLoop();
}






function keyDown(evt) {
    switch(evt.keyCode) {
        //left
        case 37:
            keysPressed.left = true;
            break;
        //up
        case 38:
            keysPressed.up=true;
            break;
        //right
        case 39:
            keysPressed.right = true;
            break;
    }
}
function keyUp(evt) {
    switch(evt.keyCode) {
        case 37:
            keysPressed.left=false;
            break;
        case 38:
            keysPressed.up=false;
            break;
        case 39:
            keysPressed.right=false;
            break;
    }
}


function simulateKey(action,key) {
    let keyNum = 0;
    switch(key) {
        case "left":
            keyNum = 37;
            break;
        case "up":
            keyNum = 38;
            break;
        case "right":
            keyNum = 39;
            break;
    }
    let evt = {};
    evt.keyCode = keyNum;
    if(action == "down") keyDown(evt);
    else keyUp(evt);
}
