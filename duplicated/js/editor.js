//namespace
let duplicated = {};

// game width
duplicated.bw = 800;
// game height
duplicated.bh = 592;




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

duplicated.isDragging = false;


duplicated.mapData = {};
duplicated.mapData['tiles'] = [];
duplicated.mapData['platforms'] = [];
duplicated.mapData['players'] = [];
duplicated.mapData['doors'] = [];
duplicated.mapData['gravityButtons'] = [];


//which mode currently in
// tile: drawing tiles on the map
// newPlatform: drawing new platform on the map
// playerPosition: set where player appears
// doorPosition: set where door appears
// gravityButtonPosition: set where gravity button displayed
duplicated.mode = ''; 

//tile mode
duplicated.tileX = -1;
duplicated.tileY = -1;
//newPlatform mode
duplicated.newPlatformIndex = -1;
//playerPosition mode
duplicated.playerIndex = -1;
//doorPosition mode
duplicated.doorIndex = -1;
//gravityButtonPosition
duplicated.gravityButtonIndex = -1;

window.onload = function() {
    canv=document.getElementById("gc");
    duplicated.ctx = canv.getContext("2d");
    duplicated.ctx.fillStyle="#67B0CF";
	duplicated.ctx.fillRect(0,0,duplicated.bw,duplicated.bh);


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
			duplicated.tileX = -1;
			duplicated.tileY = -1;
			duplicated.mode = '';
			$('#mode').html(duplicated.mode);
			return;
		}
		duplicated.mode = 'tile';
		$('#mode').html(duplicated.mode);
		$('.tile').removeClass('selected');
		$(this).addClass('selected');
		duplicated.tileX = parseInt($(this).attr('x'));
		duplicated.tileY = parseInt($(this).attr('y'));
	})

	$('#gc').mousedown(function(evt) {

		let posX = Math.floor(evt.offsetX/16);
		let posY = Math.floor(evt.offsetY/16);


		switch (evt.which) {
	        case 1:
	        	//left button
	            duplicated.isDragging = true;
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
	    if(duplicated.mode == 'newPlatform') {
	    	duplicated.mapData['platforms'][duplicated.newPlatformIndex] = {x:posX*16,y:posY*16,w:16,h:16};
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

		if(duplicated.mode === 'tile') {
		    if(!duplicated.isDragging) return;
		    if(duplicated.tileX < 0 || duplicated.tileY < 0) return;

			//We save the tile in the data
			var index = duplicated.mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
			let payload = {'posX':posX,'posY':posY,'tileX':duplicated.tileX,'tileY':duplicated.tileY};
			if(index >= 0) duplicated.mapData['tiles'][index] = payload;
			else duplicated.mapData['tiles'].push(payload);

			//we redraw
			reloadMap();
		}
		if(duplicated.mode == 'newPlatform') {
			if(!duplicated.isDragging) return;

			let pixelX = posX*16 + 16;
			let pixelY = posY*16 + 16;
			let width = pixelX - duplicated.mapData['platforms'][duplicated.newPlatformIndex].x;
			let height = pixelY - duplicated.mapData['platforms'][duplicated.newPlatformIndex].y;

			if(width <= 0) {
				duplicated.mapData['platforms'][duplicated.newPlatformIndex].x = posX*16;
				width = 16;
			}
			if(height <= 0) {
				duplicated.mapData['platforms'][duplicated.newPlatformIndex].y = posY*16;
				width = 16;
			}
			duplicated.mapData['platforms'][duplicated.newPlatformIndex].w = width;
			duplicated.mapData['platforms'][duplicated.newPlatformIndex].h = height;
			reloadMap();
		}
		if(duplicated.mode == 'playerPosition') {
			reloadMap();
			duplicated.ctx.drawImage(
			    duplicated.assets.playerImage,
			    6* 24,
			    duplicated.playerIndex*24,
			    24,
			    24,
			    tilePositionX-24/2,
			    tilePositionY-24,
			    24,
			    24
		    );
		}

		if(duplicated.mode == 'doorPosition') {
			reloadMap();
			let door = duplicated.mapData.doors[duplicated.doorIndex];

			let doorSpriteY = duplicated.doorIndex*48;
			if(door.reversed) doorSpriteY += 4*48;

			duplicated.ctx.drawImage(
			    duplicated.assets.doorsImage,
			    0,
			    doorSpriteY,
			    48,
			    48,
			    tilePositionX-48/2,
			    tilePositionY-48,
			    48,
			    48
		    );
		}
		if(duplicated.mode == 'gravityButtonPosition') {
			reloadMap();
			let gravityButton = duplicated.mapData.gravityButtons[duplicated.gravityButtonIndex];

			let gravityButtonSpriteY = 0;
			if(gravityButton.mode == 'down') gravityButtonSpriteY += 32;

			duplicated.ctx.drawImage(
			    duplicated.assets.gravityButtonsImage,
			    0,
			    gravityButtonSpriteY,
			    32,
			    32,
			    tilePositionX-32/2,
			    tilePositionY-32,
			    32,
			    32
		    );
		}
	 })
	.mouseup(function(evt) {
	    duplicated.isDragging = false;

	    let posX = Math.floor(evt.offsetX/16);
		let posY = Math.floor(evt.offsetY/16);
		let tilePositionX = posX * 16;
		let tilePositionY = posY* 16;

	    if(duplicated.mode === 'tile') {

	    	//left click, we draw
	    	if(evt.which == 1) {
			    if(duplicated.tileX < 0 || duplicated.tileY < 0) return;

				//We save the tile in the data
				var index = duplicated.mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
				let payload = {'posX':posX,'posY':posY,'tileX':duplicated.tileX,'tileY':duplicated.tileY};
				if(index >= 0) duplicated.mapData['tiles'][index] = payload;
				else duplicated.mapData['tiles'].push(payload);		
			}
			//right click, we delete
			if(evt.which == 3) {
				duplicated.ctx.fillStyle="#67B0CF";
				
				duplicated.ctx.fillRect(tilePositionX,tilePositionY,16,16);

				var index = duplicated.mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
				if(index >= 0) duplicated.mapData['tiles'].splice(index, 1);
			}
		}
		if(duplicated.mode == 'newPlatform') {
			duplicated.mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			duplicated.newPlatformIndex = -1;
		}
		if(duplicated.mode == 'playerPosition') {
			duplicated.mapData.players[duplicated.playerIndex].x = tilePositionX;
			duplicated.mapData.players[duplicated.playerIndex].y= tilePositionY;
			mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			duplicated.playerIndex = -1;
		}
		if(duplicated.mode == 'doorPosition') {
			duplicated.mapData.doors[duplicated.doorIndex].x = tilePositionX;
			duplicated.mapData.doors[duplicated.doorIndex].y= tilePositionY;
			duplicated.mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			duplicated.doorIndex = -1;
		}
		if(duplicated.mode == 'gravityButtonPosition') {
			duplicated.mapData.gravityButtons[duplicated.gravityButtonIndex].x = tilePositionX;
			duplicated.mapData.gravityButtons[duplicated.gravityButtonIndex].y= tilePositionY;
			duplicated.mode = '';
			$('#mode').html('');
			$('#instruction').html('');
			duplicated.gravityButtonIndex = -1;
		}
		reloadMap();
	});


	$('body').mouseup(function() {
	    duplicated.isDragging = false;
	})

	

	//right click, we return, false to prevent display
	$( "#gc" ).contextmenu(function(evt) {
		return false;
	});


	//test transfer data via url
	var url = new URL(window.location.href);
	var data = url.searchParams.get("data");

	if(data && data.length > 0) {
		var zip = new JSZip();

		let rawZip = Tools.decodeDataFromUrl(data);
		zip.loadAsync(rawZip).then(function (read) {
	        zip.file("data.json").async("string").then((data) => {
	        	duplicated.mapData = JSON.parse(data);
	        	reloadMap();
	        })
	    });
	}


} //end onload

loadLayout = function() {
	if($('#layoutLoader').val().length == 0) return;
	$.getJSON( "layouts/"+$('#layoutLoader').val()+".json", function(data) {
		duplicated.mapData = data;
		reloadMap();
	})
}
reloadMap = function() {
	duplicated.ctx.clearRect(0, 0, canv.width, canv.height);
	duplicated.ctx.fillStyle="#67B0CF";
	duplicated.ctx.fillRect(0,0,duplicated.bw,duplicated.bh);
	duplicated.mapData.tiles.forEach(elem => {
		duplicated.ctx.drawImage(duplicated.assets.tiles,elem.tileX*16,elem.tileY*16,16,16,elem.posX*16,elem.posY*16,16,16);
	})
	
	if(duplicated.mapData.platforms) duplicated.mapData.platforms.forEach((elem,i) => {
		if(i == duplicated.newPlatformIndex) {
			duplicated.ctx.strokeStyle = "#FF3333";
			duplicated.ctx.lineWidth = 3;
		} else {
			duplicated.ctx.strokeStyle = "#000000";
			duplicated.ctx.lineWidth = 1;
		}
		duplicated.ctx.beginPath();
		duplicated.ctx.rect(elem.x,elem.y,elem.w,elem.h);
		duplicated.ctx.stroke();
	})

	if(duplicated.mapData.players) duplicated.mapData.players.forEach((elem,i) => {

		if(duplicated.mode == 'playerPosition' && i == duplicated.playerIndex) return;
		duplicated.ctx.drawImage(
		    duplicated.assets.playerImage,
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
	if(duplicated.mapData.doors) duplicated.mapData.doors.forEach((elem,i) => {

		if(duplicated.mode == 'doorPosition' && i == duplicated.doorIndex) return;
		let doorSpriteY = i*48;
		if(elem.reversed) doorSpriteY += 4*48;
		duplicated.ctx.drawImage(
		    duplicated.assets.doorsImage,
		    0,
		    doorSpriteY,
		    48,
		    48,
		    elem.x-48/2,
		    elem.y-48,
		    48,
		    48
	    );
	})


	if(duplicated.mapData.gravityButtons)  duplicated.mapData.gravityButtons.forEach((elem,i) => {

		if(duplicated.mode == 'gravityButtonPosition' && i == duplicated.gravityButtonIndex) return;
		let gravityButtonSpriteY = 0;
		if(elem.mode == 'down') gravityButtonSpriteY += 32;
		duplicated.ctx.drawImage(
		    duplicated.assets.gravityButtonsImage,
		    0,
		    gravityButtonSpriteY,
		    32,
		    32,
		    elem.x-32/2,
		    elem.y-32,
		    32,
		    32
	    );
	})

	reloadTools();
}

reloadTools = function() {
	$('#platformsList').html('');
	if(duplicated.mapData.platforms) duplicated.mapData.platforms.forEach((elem,i) => {
		$('#platformsList').append('<li index="'+i+'"><span class="eye" index="'+i+'"></span>x:'+elem.x+' y:'+elem.y+' w:'+elem.w+' h:'+elem.h+'<button class="removePlatform" onclick="deletePlatform('+i+')">-</button></li>');
	})

	$('#playersList').html('');
	if(duplicated.mapData.players) duplicated.mapData.players.forEach((elem,i) => {
		let checked="";
		if(elem.reverseCommand) checked = ' checked';

		let selected="";
		if(duplicated.playerIndex == i) selected = ' selected';
		$('#playersList').append('<li class="player'+i+selected+'"><span class="image" onclick="selectPlayer('+i+')"></span>rev commands:<input type="checkbox" '+checked+' onclick="reverseCommand('+i+')"></input><button onclick="deletePlayer('+i+')">-</button></span></li>');
	})

	$('#doorsList').html('');
	if(duplicated.mapData.doors) duplicated.mapData.doors.forEach((elem,i) => {
		let checked="";
		if(elem.reversed) checked = ' checked';

		let selected="";
		if(duplicated.doorIndex == i) selected = ' selected';
		$('#doorsList').append('<li class="door'+i+selected+'"><span class="image" onclick="selectDoor('+i+')"></span>reversed:<input type="checkbox" '+checked+' onclick="reverseDoor('+i+')"></input></li>');
	})

	$('#gravityButtonsList').html('');
	if(duplicated.mapData.gravityButtons) duplicated.mapData.gravityButtons.forEach((elem,i) => {
		let modeGravity=' down';
		if(elem.mode == 'up') modeGravity = ' up';

		let selected="";
		if(duplicated.gravityButtonIndex == i) selected = ' selected';

		$('#gravityButtonsList').append('<li class="gravityButton'+i+selected+modeGravity+'"><span class="image" onclick="selectGravityButton('+i+')"></span><button onclick="deleteGravityButton('+i+')">-</button></li>');
	})
}


addPlatform = function() {
	duplicated.mode = 'newPlatform';
	$('#mode').html(duplicated.mode);
	$('#instruction').html('click and drag on the map to draw the platform');
	duplicated.mapData['platforms'].push({x:0,y:0,w:0,h:0});
	duplicated.newPlatformIndex = duplicated.mapData['platforms'].length - 1;
}

deletePlatform = function(index) {
	console.log('deleting platform');
	duplicated.mapData.platforms.splice(index,1);
	reloadMap();
}

deletePlayer = function(index) {
	duplicated.mapData.platforms.splice(index,1);
	reloadMap();
}

addPlayer = function() {
	if(!duplicated.mapData.players) duplicated.mapData.players = [];
	if(!duplicated.mapData.doors) duplicated.mapData.doors = [];
	//max number of players
	if(duplicated.mapData.players.length == 4) return;

	duplicated.mapData.players.push({x:-100,y:-100,reverseCommand:false});
	duplicated.mapData.doors.push({x:-100,y:-100,reversed:false});

	duplicated.mode = 'playerPosition';
	$('#mode').html(duplicated.mode);
	$('#instruction').html('click on the map to select where player spawn');
	duplicated.playerIndex = duplicated.mapData.players.length - 1;
	reloadMap();
}
selectPlayer = function(index) {
	duplicated.mode = 'playerPosition';
	$('#mode').html(duplicated.mode);
	$('#instruction').html('click on the map to select where player spawn');
	duplicated.playerIndex = index;
	reloadMap();
}
deletePlayer = function(index) {
	duplicated.mapData.players.splice(index,1);
	if(duplicated.mapData.doors) duplicated.mapData.doors.splice(index,1);
	reloadMap();
}

selectDoor = function(index) {
	duplicated.mode = 'doorPosition';
	$('#mode').html(duplicated.mode);
	$('#instruction').html('click on the map to select where door appears');
	duplicated.doorIndex = index;
	reloadMap();
}



reverseCommand = function(index) {
	let checked = $('.player'+index+' [type="checkbox"]').prop('checked');
	duplicated.mapData.players[index].reverseCommand = checked;
}

reverseDoor = function(index) {
	let checked = $('.door'+index+' [type="checkbox"]').prop('checked');
	duplicated.mapData.doors[index].reversed = checked;
	reloadMap();
}


addGravityButton = function(mode) {
	if(!duplicated.mapData['gravityButtons']) duplicated.mapData.gravityButtons = [];
	duplicated.mapData.gravityButtons.push({x:-100,y:-100,mode:mode});
	reloadMap();
}

selectGravityButton = function(index) {
	duplicated.mode = 'gravityButtonPosition';
	$('#mode').html(duplicated.mode);
	$('#instruction').html('click on the map to select where gravity button is displayed');
	duplicated.gravityButtonIndex = index;
	reloadMap();
}




$(document).on('mouseover','.eye',function() {
	duplicated.newPlatformIndex = parseInt($(this).attr('index'));
	reloadMap();
})


testLevel = function() {
	$('#instruction').html('You may need to allow pop up windows');
	var zip = new JSZip();
	zip.file("data.json", JSON.stringify(duplicated.mapData));
	zip.generateAsync({
		type:"string",
		compression: "DEFLATE",
	    compressionOptions: {
	        level: 9
	    }
	})
	.then(function(content) {
		var encodedData = Tools.encodeDataForURL(content);
		window.open('index.html?data='+encodedData, '_blank');
	});
}


$('#tools .box').on('click',function() {
	$('#tools .box').removeClass('active');
	$(this).addClass('active');
})