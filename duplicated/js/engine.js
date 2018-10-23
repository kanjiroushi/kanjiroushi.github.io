let grav=0.5;

// game width
const bw = 800;
// game height
const bh = 592;

let frameNum = 0;

let plats=[];
let players = [];
let doors = [];
let gravityButtons = [];

let keysPressed = {
    l:false,
    r:false,
    u:false,
}


let replayStore = [];
let doReplay = false;

let youWinBoard = new Image();
youWinBoard.src = "sprites/youWinBoard.png";
let playerImage = new Image();
playerImage.src = "sprites/player.png";
let doorsImage = new Image();
doorsImage.src = "sprites/doors.png";
let tiles = new Image();
tiles.src = "sprites/tileset_grassAndDirt.png";
let gravityButtonsImage = new Image();
gravityButtonsImage.src = "sprites/gravity_button.png";

let youWin = false;

let mapData = {};
mapData['tiles'] = [];
mapData['platforms'] = [];
mapData['players'] = [];
mapData['doors'] = [];
mapData['gravityButtons'] = [];


loadDefaultLayout = function() {
    
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

    var promisesPending = [];

    ///////////////////////////////
    //Load map
    ///////////////////////////////
    if(data && data.length > 0) {
        let zip = new JSZip();
        let rawZip = Tools.decodeDataFromUrl(data);
        let promiseLoadMap = zip.loadAsync(rawZip).then(function (read) {
            return zip.file("data.json").async("string");
        }).then((data) => {
            mapData = JSON.parse(data);
            return Promise.resolve('mapLoaded');
        });
        promisesPending.push(promiseLoadMap);
    } else {
        //We load the default map
        let promiseLoadMap = new Promise((resolve, reject) => {
            $.getJSON( "layouts/twowindowshorizontal.json", function(data) {
                mapData = data;
                resolve('defaultMapLoaded');
            })
        });
        promisesPending.push(promiseLoadMap);
    }

    ///////////////////////////////
    //replay functionality
    ///////////////////////////////
    var replay = url.searchParams.get("replay");
    if(replay && replay.length > 0) {
        var zip2 = new JSZip();
        let replayData = Tools.decodeDataFromUrl(replay);
        var promiseReplayData = zip2.loadAsync(replayData).then(function (read) {
            return zip2.file("data.json").async("string");
        }).then((data) => {
            replayStore = JSON.parse(data);
            doReplay = true;
            return Promise.resolve('replayLoaded');
        });
        promisesPending.push(promiseReplayData);
    }


    //We load the promises to start the game
    Promise.all(promisesPending).then(function(values) {
      console.log(values);
      reloadMap();
    });

}

//gameLoop the page
function gameLoop() {
    if(!youWin) {
        
        if(doReplay) keysPressed = replayStore[frameNum];
        else replayStore.push(Object.assign({}, keysPressed));

        frameNum++;



        players.forEach(function(p) {
            p.update(keysPressed,plats,players); 
        });
        doors.forEach(function(d) {
            d.update(players); 
        });
        gravityButtons.forEach(function(g) {
            g.update(players,gravityButtons); 
        });
    } else {
        if(!doReplay) $('.viewReplay').css('display','inline-block');
    }
    render();


    let allDoorsActive = true;
    doors.forEach(function(d) {
        if(!d.active) allDoorsActive = false;
    });
    
    if(allDoorsActive) {
        youWin = true;
    }

    if(!youWin) {
        let milliSeconds = parseInt(frameNum*1000/60);
        let seconds = parseInt(milliSeconds/1000);
        let mill = milliSeconds - 1000*seconds;
        $('#scoreBoard .time').html(seconds+'.'+mill);
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


   

    //drawing doors
    doors.forEach(function(d) {
        d.render();
    });
    //drawing gravity buttons
    gravityButtons.forEach(function(g) {
        g.render();
    });
    //drawing players
    players.forEach(function(p) {
        p.render();
    });

     //You win board
    if(youWin) ctx.drawImage(youWinBoard,0,0,300,250,(800-300)/2,0,300,250);

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
        players.push(new Player({context:ctx,image:playerImage,playerNum:i,x:elem.x,y:elem.y,reverseCommand:elem.reverseCommand}));
    })
    doors = [];
    if(mapData.doors) mapData.doors.forEach((elem,i) => {
       doors.push(new Door({context:ctx,image:doorsImage,doorNum:i,x:elem.x,y:elem.y,reversed:elem.reversed}));
    })
    gravityButtons = [];
    if(mapData.gravityButtons) mapData.gravityButtons.forEach((elem,i) => {
       gravityButtons.push(new gravityButton({context:ctx,image:gravityButtonsImage,x:elem.x,y:elem.y,mode:elem.mode}));
    })
    gameLoop();
}



function viewReplay() {
    var zip = new JSZip();
    zip.file("data.json", JSON.stringify(replayStore));
    zip.generateAsync({
        type:"string",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    })
    .then(function(content) {
        var encodedReplay = Tools.encodeDataForURL(content);

        var url = new URL(window.location.href);
        var data = url.searchParams.get("data");

        window.open('index.html?replay='+encodedReplay+'&data='+data, '_blank');
    });
}


function keyDown(evt) {

    if(doReplay) return;

    switch(evt.keyCode) {
        //left
        case 37: //left arrow
        case 81: //Q
            keysPressed.l = true;
            break;
        //up
        case 38: //up arrow
        case 32: //spacebar
            keysPressed.u=true;
            break;
        //right
        case 39: //right arrow
        case 68: //D
            keysPressed.r = true;
            break;
    }
}
function keyUp(evt) {

    if(doReplay) return;


    switch(evt.keyCode) {
        case 37: //left arrow
        case 81: //Q
            keysPressed.l=false;
            break;
        case 38: //up arrow
        case 32: //spacebar
            keysPressed.u=false;
            break;
        case 39: //right arrow
        case 68: //D
            keysPressed.r=false;
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
