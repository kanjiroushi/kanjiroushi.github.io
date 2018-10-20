// game width
const bw = 800;
// game height
const bh = 592;


let tileX = -1;
let tileY = -1;


let tiles = new Image();
tiles.src = "sprites/tileset_grassAndDirt.png";

var isDragging = false;


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
		if($(this).hasClass('selected')) {
			$('.tile').removeClass('selected');
			tileX = -1;
			tileY = -1;
			return;
		}
		$('.tile').removeClass('selected');
		$(this).addClass('selected');
		tileX = $(this).attr('x');
		tileY = $(this).attr('y');
	})

	$('#gc').mousedown(function() {
	    isDragging = true;
	})
	.mousemove(function(evt) {
	    if(!isDragging) return;
	    if(tileX < 0 || tileY < 0) return;
		let x = Math.floor(evt.offsetX/16)*16;
		let y = Math.floor(evt.offsetY/16)*16;
		console.log('drawing tile');
		ctx.drawImage(tiles,tileX*16,tileY*16,16,16,x,y,16,16);
	 })
	.mouseup(function() {
	    isDragging = false;
	})
	.click(function(evt) {
		if(tileX < 0 || tileY < 0) return;
		let x = Math.floor(evt.offsetX/16)*16;
		let y = Math.floor(evt.offsetY/16)*16;
		ctx.drawImage(tiles,tileX*16,tileY*16,16,16,x,y,16,16);
	});


	$('body').mouseup(function() {
		console.log('mouse up on body');
	    isDragging = false;
	})

	

	//right click, delete elem
	$( "#gc" ).contextmenu(function(evt) {
		ctx.fillStyle="#67B0CF";
		let x = Math.floor(evt.offsetX/16)*16;
		let y = Math.floor(evt.offsetY/16)*16;
		ctx.fillRect(x,y,16,16);
		return false;
	});

}    