// game width
const bw = 800;
// game height
const bh = 592;




let tiles = new Image();
tiles.src = "sprites/tileset_grassAndDirt.png";

let playerImage = new Image();
playerImage.src = "sprites/player.png";

let doorsImage = new Image();
doorsImage.src = "sprites/doors.png";

var isDragging = false;


let mapData = {};
mapData['tiles'] = [];
mapData['platforms'] = [];
mapData['players'] = [];
mapData['doors'] = [];


//which mode currently in
// tile: drawing tiles on the map
// newPlatform: drawing new platform on the map
// playerPosition: set where player appears
// doorPosition: set where door appears
let mode = ''; 

//tile mode
let tileX = -1;
let tileY = -1;

//newPlatform mode
let newPlatformIndex = -1;

//playerPosition mode
let playerIndex = -1;


//doorPosition mode
let doorIndex = -1;

window.onload = function() {
    canv=document.getElementById("gc");
    ctx=canv.getContext("2d");
    ctx.fillStyle="#67B0CF";
	ctx.fillRect(0,0,bw,bh);


//grid
/*
	for (var x = 0; x <= bw; x += 16) {
	    ctx.moveTo(x-0.5, 0);
	    ctx.lineTo(x-0.5, bh);
	}


	for (var x = 0; x <= bh; x += 16) {
	    ctx.moveTo(0, x-0.5);
	    ctx.lineTo(bw, x-0.5);
	}

	ctx.strokeStyle = "black";
	ctx.stroke();
*/
//end grid

	$('.tile').on('click',function() {
		$('#instruction').html('click or click drag on canvas. right click to delete');
		if($(this).hasClass('selected')) {
			$('#instruction').html('');
			$('.tile').removeClass('selected');
			tileX = -1;
			tileY = -1;
			mode = '';
			$('#mode').html(mode);
			return;
		}
		mode = 'tile';
		$('#mode').html(mode);
		$('.tile').removeClass('selected');
		$(this).addClass('selected');
		tileX = parseInt($(this).attr('x'));
		tileY = parseInt($(this).attr('y'));
	})

	$('#gc').mousedown(function(evt) {

		let posX = Math.floor(evt.offsetX/16);
		let posY = Math.floor(evt.offsetY/16);


		switch (evt.which) {
	        case 1:
	        	//left button
	            isDragging = true;
	            break;
	        case 2:
	            //middle button
	            break;
	        case 3:
	            //right button
	            break;
	        default:
	            //strange mouse
	    }
	    if(mode == 'newPlatform') {
	    	mapData['platforms'][newPlatformIndex] = {x:posX*16,y:posY*16,w:16,h:16};
	    	reloadMap();
	    }
	})
	.mousemove(function(evt) {

		//We want the tiles to be aligned to 16 * 16 grid
		let posX = Math.floor(evt.offsetX/16);
		let posY = Math.floor(evt.offsetY/16);
		let tilePositionX = posX * 16;
		let tilePositionY = posY* 16;

		//We display the position to precisely display positions 
		$('#canvasX').html(evt.offsetX);
		$('#canvasY').html(evt.offsetY);
		$('#posX').html(posX);
		$('#posY').html(posY);

		if(mode === 'tile') {
		    if(!isDragging) return;
		    if(tileX < 0 || tileY < 0) return;

			//We save the tile in the data
			var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
			let payload = {'posX':posX,'posY':posY,'tileX':tileX,'tileY':tileY};
			if(index >= 0) mapData['tiles'][index] = payload;
			else mapData['tiles'].push(payload);

			//we redraw
			reloadMap();
		}
		if(mode == 'newPlatform') {
			if(!isDragging) return;

			let pixelX = posX*16 + 16;
			let pixelY = posY*16 + 16;
			let width = pixelX - mapData['platforms'][newPlatformIndex].x;
			let height = pixelY - mapData['platforms'][newPlatformIndex].y;

			mapData['platforms'][newPlatformIndex].w = width;
			mapData['platforms'][newPlatformIndex].h = height;
			reloadMap();
		}
		if(mode == 'playerPosition') {
			reloadMap();
			ctx.drawImage(
			    playerImage,
			    6* 24,
			    playerIndex*24,
			    24,
			    24,
			    evt.offsetX-24/2,
			    evt.offsetY-24,
			    24,
			    24
		    );
		}

		if(mode == 'doorPosition') {
			reloadMap();
			ctx.drawImage(
			    doorsImage,
			    0,
			    doorIndex*48,
			    48,
			    48,
			    tilePositionX-48/2,
			    tilePositionY-48,
			    48,
			    48
		    );
		}
	 })
	.mouseup(function(evt) {
	    isDragging = false;

	    let posX = Math.floor(evt.offsetX/16);
		let posY = Math.floor(evt.offsetY/16);
		let tilePositionX = posX * 16;
		let tilePositionY = posY* 16;

	    if(mode === 'tile') {

	    	//left click, we draw
	    	if(evt.which == 1) {
			    if(tileX < 0 || tileY < 0) return;

				//We save the tile in the data
				var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
				let payload = {'posX':posX,'posY':posY,'tileX':tileX,'tileY':tileY};
				if(index >= 0) mapData['tiles'][index] = payload;
				else mapData['tiles'].push(payload);		
			}
			//right click, we delete
			if(evt.which == 3) {
				ctx.fillStyle="#67B0CF";
				
				ctx.fillRect(tilePositionX,tilePositionY,16,16);

				var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
				if(index >= 0) mapData['tiles'].splice(index, 1);
			}
		}
		if(mode == 'newPlatform') {
			mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			newPlatformIndex = -1;
		}
		if(mode == 'playerPosition') {
			mapData.players[playerIndex].x = evt.offsetX;
			mapData.players[playerIndex].y= evt.offsetY;
			mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			playerIndex = -1;
		}
		if(mode == 'doorPosition') {
			mapData.doors[doorIndex].x = tilePositionX;
			mapData.doors[doorIndex].y= tilePositionY;
			mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			doorIndex = -1;
		}
		reloadMap();
	});


	$('body').mouseup(function() {
	    isDragging = false;
	})

	

	//right click, we return, false to prevent display
	$( "#gc" ).contextmenu(function(evt) {
		return false;
	});

}

loadLayout = function() {
	if($('#layoutLoader').val().length == 0) return;
	$.getJSON( "layouts/"+$('#layoutLoader').val()+".json", function(data) {
	  mapData = data;
	  reloadMap();

	})
}
reloadMap = function() {
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
	ctx.clearRect(0, 0, canv.width, canv.height);
	ctx.fillStyle="#67B0CF";
	ctx.fillRect(0,0,bw,bh);
	mapData.tiles.forEach(elem => {
		ctx.drawImage(tiles,elem.tileX*16,elem.tileY*16,16,16,elem.posX*16,elem.posY*16,16,16);
	})
	ctx.strokeStyle = "black";
	if(mapData.platforms) mapData.platforms.forEach(elem => {
		ctx.beginPath();
		ctx.rect(elem.x,elem.y,elem.w,elem.h);
		ctx.stroke();
	})

	if(mapData.players) mapData.players.forEach((elem,i) => {

		if(mode == 'playerPosition' && i == playerIndex) return;
		ctx.drawImage(
		    playerImage,
		    6* 24,
		    i*24,
		    24,
		    24,
		    elem.x-24/2,
		    elem.y-24,
		    24,
		    24
	    );
	})
	if(mapData.doors) mapData.doors.forEach((elem,i) => {

		if(mode == 'doorPosition' && i == doorIndex) return;
		ctx.drawImage(
		    doorsImage,
		    0,
		    i*48,
		    48,
		    48,
		    elem.x-48/2,
		    elem.y-48,
		    48,
		    48
	    );
	})

	reloadTools();
}

reloadTools = function() {
	$('#platformsList').html('');
	if(mapData.platforms) mapData.platforms.forEach((elem,i) => {
		$('#platformsList').append('<li>x:'+elem.x+' y:'+elem.y+'<br />w:'+elem.w+' h:'+elem.h+'<button onclick="deletePlatform('+i+')">-</button></li>');
	})

	$('#playersList').html('');
	if(mapData.players) mapData.players.forEach((elem,i) => {
		let checked="";
		if(elem.reverseCommand) checked = ' checked';

		let selected="";
		if(playerIndex == i) selected = ' selected';
		$('#playersList').append('<li class="player'+i+selected+'"><span class="image" onclick="selectPlayer('+i+')"></span><span class="data">x:'+elem.x+' y:'+elem.y+'<br />rev commands:<input type="checkbox" '+checked+'></input><button onclick="deletePlayer('+i+')">-</button></span></li>');
	})

	$('#doorsList').html('');
	if(mapData.doors) mapData.doors.forEach((elem,i) => {
		let selected="";
		if(doorIndex == i) selected = ' selected';
		$('#doorsList').append('<li class="door'+i+selected+'"><span class="image" onclick="selectDoor('+i+')"></span><span class="data">x:'+elem.x+' y:'+elem.y+'</span></li>');
	})
}


addPlatform = function() {
	mode = 'newPlatform';
	$('#mode').html(mode);
	$('#instruction').html('click and drag on the map to draw the platform');
	mapData['platforms'].push({x:0,y:0,w:0,h:0});
	newPlatformIndex = mapData['platforms'].length - 1;
}

deletePlatform = function(index) {
	mapData.platforms.splice(index,1);
	reloadMap();
}

deletePlayer = function(index) {
	mapData.platforms.splice(index,1);
	reloadMap();
}

addPlayer = function() {
	if(!mapData.players) mapData.players = [];
	if(!mapData.doors) mapData.doors = [];
	if(mapData.players.length ==4) return;

	mapData.players.push({x:-100,y:-100,reverseCommand:false});
	mapData.doors.push({x:-100,y:-100});

	mode = 'playerPosition';
	$('#mode').html(mode);
	$('#instruction').html('click on the map to select where player spawn');
	playerIndex = mapData.players.length - 1;
	reloadMap();
}
selectPlayer = function(index) {
	mode = 'playerPosition';
	$('#mode').html(mode);
	$('#instruction').html('click on the map to select where player spawn');
	playerIndex = index;
	reloadMap();
}
deletePlayer = function(index) {
	mapData.players.splice(index,1);
	if(mapData.doors) mapData.doors.splice(index,1);
	reloadMap();
}

selectDoor = function(index) {
	mode = 'doorPosition';
	$('#mode').html(mode);
	$('#instruction').html('click on the map to select where door appears');
	doorIndex = index;
	reloadMap();
}
