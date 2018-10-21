// game width
const bw = 800;
// game height
const bh = 592;


let tileX = -1;
let tileY = -1;


let tiles = new Image();
tiles.src = "sprites/tileset_grassAndDirt.png";

var isDragging = false;


let mapData = {};
mapData['tiles'] = [];
mapData['platforms'] = [];
//which mode currently in
// tile: drawing tiles on the map
// newPlatform: drawing new platform on the map
let mode = ''; 

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
			ctx.drawImage(tiles,tileX*16,tileY*16,16,16,tilePositionX,tilePositionY,16,16);

			//We save the tile in the data
			var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
			let payload = {'posX':posX,'posY':posY,'tileX':tileX,'tileY':tileY};
			if(index >= 0) mapData['tiles'][index] = payload;
			else mapData['tiles'].push(payload);
		}
	 })
	.mouseup(function() {
	    isDragging = false;
	})
	.click(function(evt) {

		if(mode === 'tile') {
			if(tileX < 0 || tileY < 0) return;
			let posX = Math.floor(evt.offsetX/16);
			let posY = Math.floor(evt.offsetY/16);
			let tilePositionX = posX * 16;
			let tilePositionY = posY* 16;
			ctx.drawImage(tiles,tileX*16,tileY*16,16,16,tilePositionX,tilePositionY,16,16);

			//We save the tile in the data
			var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
			let payload = {'posX':posX,'posY':posY,'tileX':tileX,'tileY':tileY};
			if(index >= 0) mapData['tiles'][index] = payload;
			else mapData['tiles'].push(payload);

		}
	});


	$('body').mouseup(function() {
	    isDragging = false;
	})

	

	//right click, delete elem
	$( "#gc" ).contextmenu(function(evt) {
		if(mode === 'tile') {
			ctx.fillStyle="#67B0CF";
			let posX = Math.floor(evt.offsetX/16);
			let posY = Math.floor(evt.offsetY/16);
			let tilePositionX = posX * 16;
			let tilePositionY = posY* 16;
			ctx.fillRect(tilePositionX,tilePositionY,16,16);

			var index = mapData['tiles'].map(function(e) { return e.posX+'_'+e.posY; }).indexOf(posX+'_'+posY);
			if(index >= 0) mapData['tiles'].splice(index, 1);
			return false;
		}
	});

}

loadLayout = function() {
	$.getJSON( "layouts/1.json", function(data) {
	  mapData = data;
	  reloadMap();

	})
}
reloadMap = function() {
	canv=document.getElementById("gc");
      ctx=canv.getContext("2d");
      ctx.fillStyle="#67B0CF";
	  ctx.fillRect(0,0,bw,bh);
	  mapData.tiles.forEach(elem => {
	  	ctx.drawImage(tiles,elem.tileX*16,elem.tileY*16,16,16,elem.posX*16,elem.posY*16,16,16);
	  })
}

