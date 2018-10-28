//namespace
let duplicated = {};

duplicated.grav=0.5;

// game width
duplicated.bw = 800;
// game height
duplicated.bh = 592;

duplicated.frameNum = 0;

duplicated.plats=[];
duplicated.players = [];
duplicated.doors = [];
duplicated.gravityButtons = [];

duplicated.keysPressed = {
    l:false,
    r:false,
    u:false,
}

//replay
duplicated.replayStore = [];
duplicated.doReplay = false;


//assets 
duplicated.assets = {};
duplicated.assets.youWinBoard = new Image();
duplicated.assets.youWinBoard.src = "sprites/youWinBoard.png";
duplicated.assets.playerImage = new Image();
duplicated.assets.playerImage.src = "sprites/player.png";
duplicated.assets.doorsImage = new Image();
duplicated.assets.doorsImage.src = "sprites/doors.png";
duplicated.assets.tiles = new Image();
duplicated.assets.tiles.src = "sprites/tileset_grassAndDirt.png";
duplicated.assets.gravityButtonsImage = new Image();
duplicated.assets.gravityButtonsImage.src = "sprites/gravity_button.png";

duplicated.youWin = false;

duplicated.mapData = {};
duplicated.mapData['tiles'] = [];
duplicated.mapData['platforms'] = [];
duplicated.mapData['players'] = [];
duplicated.mapData['doors'] = [];
duplicated.mapData['gravityButtons'] = [];


window.onload=function() {
    canv = document.getElementById("gc");
    duplicated.ctx = canv.getContext("2d");
    
    
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
            duplicated.mapData = JSON.parse(data);
            return Promise.resolve('mapLoaded');
        });
        promisesPending.push(promiseLoadMap);
    } else {
        //We load the default map
        let promiseLoadMap = new Promise((resolve, reject) => {
            $.getJSON( "layouts/twowindowshorizontal.json", function(data) {
                duplicated.mapData = data;
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
            duplicated.replayStore = JSON.parse(data);
            duplicated.doReplay = true;
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
    if(!duplicated.youWin) {
        
        
        if(duplicated.doReplay) {
            //if we are replaying, we set the keys to the store ones
            duplicated.keysPressed = duplicated.replayStore[duplicated.frameNum];
        } else {
            //else we store the keys pressed in the replay store object
            duplicated.replayStore.push(Object.assign({}, duplicated.keysPressed));
        }
        duplicated.frameNum++;



        duplicated.players.forEach(function(p) {
            p.update(duplicated.keysPressed,duplicated.plats,duplicated.players); 
        });
        duplicated.doors.forEach(function(d) {
            d.update(duplicated.players); 
        });
        duplicated.gravityButtons.forEach(function(g) {
            g.update(duplicated.players,duplicated.gravityButtons); 
        });
    } else {
        if(!duplicated.doReplay) $('.viewReplay').css('display','inline-block');
    }
    render();


    let allDoorsActive = true;
    duplicated.doors.forEach(function(d) {
        if(!d.active) allDoorsActive = false;
    });
    
    if(allDoorsActive) {
        duplicated.youWin = true;
    }

    if(!duplicated.youWin) {
        let milliSeconds = parseInt(duplicated.frameNum*1000/60);
        let seconds = parseInt(milliSeconds/1000);
        let mill = milliSeconds - 1000*seconds;
        $('#scoreBoard .time').html(seconds+'.'+mill);
    }
    

    //We request the next animation already
    window.requestAnimationFrame(gameLoop);
    

}




function render() {

    //We draw the tiles
    duplicated.ctx.clearRect(0, 0, duplicated.bw, duplicated.bh);
    duplicated.ctx.fillStyle="#67B0CF";
    duplicated.ctx.fillRect(0,0,duplicated.bw,duplicated.bh);
    if(duplicated.mapData && duplicated.mapData.tiles) {
        duplicated.mapData.tiles.forEach(elem => {
            duplicated.ctx.drawImage(duplicated.assets.tiles,elem.tileX*16,elem.tileY*16,16,16,elem.posX*16,elem.posY*16,16,16);
        });
    }


   

    //drawing doors
    duplicated.doors.forEach(function(d) {
        d.render();
    });
    //drawing gravity buttons
    duplicated.gravityButtons.forEach(function(g) {
        g.render();
    });
    //drawing players
    duplicated.players.forEach(function(p) {
        p.render();
    });

     //You win board
    if(duplicated.youWin) duplicated.ctx.drawImage(duplicated.assets.youWinBoard,0,0,300,250,(800-300)/2,0,300,250);

}







reloadMap = function() {
    
    duplicated.plats = [];
    if(duplicated.mapData.platforms) duplicated.mapData.platforms.forEach(elem => {
        duplicated.plats.push(
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

    duplicated.players = [];
    if(duplicated.mapData.players) duplicated.mapData.players.forEach((elem,i) => {
        duplicated.players.push(new Player({context:duplicated.ctx,image:duplicated.assets.playerImage,playerNum:i,x:elem.x,y:elem.y,reverseCommand:elem.reverseCommand}));
    })
    duplicated.doors = [];
    if(duplicated.mapData.doors) duplicated.mapData.doors.forEach((elem,i) => {
       duplicated.doors.push(new Door({context:duplicated.ctx,image:duplicated.assets.doorsImage,doorNum:i,x:elem.x,y:elem.y,reversed:elem.reversed}));
    })
    duplicated.gravityButtons = [];
    if(duplicated.mapData.gravityButtons) duplicated.mapData.gravityButtons.forEach((elem,i) => {
       duplicated.gravityButtons.push(new gravityButton({context:duplicated.ctx,image:duplicated.assets.gravityButtonsImage,x:elem.x,y:elem.y,mode:elem.mode}));
    })
    gameLoop();
}



function viewReplay() {
    var zip = new JSZip();
    zip.file("data.json", JSON.stringify(duplicated.replayStore));
    zip.generateAsync({
        type:"string",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    })
    .then(function(content) {
        var encodedReplay = Tools.encodeDataForURL(content);

        const url = new URL(window.location.href);
        var data = url.searchParams.get("data");
        let urlToRedirectTo = 'index.html?replay='+encodedReplay;
        if(data != null && data.length > 0) urlToRedirectTo += '&data='+data;
        window.open(urlToRedirectTo, '_blank');
    });
}


function keyDown(evt) {

    if(duplicated.doReplay) return;

    switch(evt.keyCode) {
        //left
        case 37: //left arrow
        case 81: //Q
            duplicated.keysPressed.l = true;
            break;
        //up
        case 38: //up arrow
        case 32: //spacebar
            duplicated.keysPressed.u=true;
            break;
        //right
        case 39: //right arrow
        case 68: //D
            duplicated.keysPressed.r = true;
            break;
    }
}
function keyUp(evt) {

    if(duplicated.doReplay) return;


    switch(evt.keyCode) {
        case 37: //left arrow
        case 81: //Q
            duplicated.keysPressed.l=false;
            break;
        case 38: //up arrow
        case 32: //spacebar
            duplicated.keysPressed.u=false;
            break;
        case 39: //right arrow
        case 68: //D
            duplicated.keysPressed.r=false;
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
