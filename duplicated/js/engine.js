let grav=0.5;


let plat=[];
let players = [];
let doors = [];

let keysPressed = {
    left:false,
    right:false,
    up:false,
}

let background = new Image();
background.src = "testbg.png";

let youWinBoard = new Image();
youWinBoard.src = "sprites/youWinBoard.png";

let youWin = false;


window.onload=function() {
    canv=document.getElementById("gc");
    ctx=canv.getContext("2d");
    

    playerImage = new Image();

    players.push(new Player({context:ctx,image:playerImage,playerNum:0,x:100,y:450}));
    players.push(new Player({context:ctx,image:playerImage,playerNum:1,x:700,y:450}));
    //players.push(new Player({context:ctx,image:playerImage,playerNum:2,x:300,y:100}));
    //players.push(new Player({context:ctx,image:playerImage,playerNum:3,x:500,y:100}));

    playerImage.addEventListener("load", gameLoop);
    playerImage.src = "sprites/player.png";


    doorsImage = new Image();
    
    doors.push(new Door({context:ctx,image:doorsImage,doorNum:0,x:403,y:canv.height-128}));
    doors.push(new Door({context:ctx,image:doorsImage,doorNum:1,x:600,y:canv.height-32}));
    //doors.push(new Door({context:ctx,image:doorsImage,doorNum:2,x:403,y:268}));
    //doors.push(new Door({context:ctx,image:doorsImage,doorNum:3,x:600,y:268}));
    doorsImage.src = "sprites/doors.png";



    //some listener on key press and keey release
    document.addEventListener("keydown",keyDown);
    document.addEventListener("keyup",keyUp);

//    window.addEventListener("mousemove",mouseMove)
    //time to draw the background
    //le sol
    plat.push(
        {
        id:'solBas',
        type:'bg',
        x:0,
        y:canv.height-32,
        w:canv.width,
        h:32
        }
    );
    //deuxième sol
    plat.push(
        {
        id:'solHaut',
        type:'bg',
        x:0,
        y:300-32,
        w:canv.width,
        h:64
        }
    );
    plat.push(
        {
        id:'plafond',
        type:'bg',
        x:0,
        y:0,
        w:canv.width,
        h:32
        }
    );
    //mur gauche
    plat.push(
        {
        id:'murGauche',
        type:'bg',
        x:0,
        y:0,
        w:32,
        h:canv.height
        }
    );
    //mur droit
    plat.push(
        {
        id:'murDroit',
        type:'bg',
        x:canv.width - 32,
        y:0,
        w:32,
        h:canv.height
        }
    );
    plat.push(
        {
        id:'testBlock',
        type:'platform',
        x:64*4,
        y:canv.height-64,
        w:64,
        h:32
        }
    );


    plat.push(
        {
        id:'testBlock',
        type:'platform',
        x:64*6,
        y:canv.height-64*2,
        w:64*3,
        h:32
        }
    );


    plat.push(
        {
        id:'testBlock',
        type:'platform',
        x:64*7,
        y:268-32,
        w:64,
        h:32
        }
    );

}

//gameLoop the page
function gameLoop() {
    

    if(!youWin) {
        players.forEach(function(p) {
            p.update(keysPressed,plat,players); 
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
    //drawing background
    ctx.drawImage(background,0,0);

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

    

    //dessine les plateformes
    ctx.fillStyle="black";
    for(i=0;i<plat.length;i++) {
        if(plat[i].type == 'bg') continue;
        ctx.fillRect(plat[i].x,plat[i].y,plat[i].w,plat[i].h);
    }

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
