class Tools {

	static getPlayerPoint(player,point) {

		if(duplicated.grav > 0) {
			switch (point) {
			  case 'bottomRight':
			    return {id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y};
			  case 'bottomLeft':
			    return {id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y};
			  case 'middleRight':
			    return {id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h/2};
			  case 'middleLeft':
			    return {id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h/2};
			  case 'topRight':
			    return {id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h};
			  case 'topLeft':
			    return {id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h};

			}
		} else {
			switch (point) {
			  case 'bottomRight':
			    return {id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y-player.h};
			  case 'bottomLeft':
			    return {id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y-player.h};
			  case 'middleRight':
			    return {id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.h+player.bounding.h/2};
			  case 'middleLeft':
			    return {id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.h+player.bounding.h/2};
			  case 'topRight':
			    return {id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.h+player.bounding.h};
			  case 'topLeft':
			    return {id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.h+player.bounding.h};

			}
		}
	}
	static detectPlatformCollision(player,platform) {

		let collidePixels = [];
	    //On detecte si aucune collision

	    if((player.x+player.bounding.w/2) < platform.x ) return [];
		if((player.x-player.bounding.w/2) > (platform.x+platform.w) ) return [];

	    if(duplicated.grav > 0) {
		    if((player.y-player.bounding.h) > (platform.y+platform.h) ) return [];
		    if(player.y < platform.y) return [];
	    } else {
		    if((player.y-player.h+player.bounding.h) < platform.y ) return [];
		    if((player.y-player.h) > (platform.y+platform.h)) return [];
		}

    	//We check for the 6 pixels if they collide
	    collidePixels.push(Tools.getPlayerPoint(player,'bottomRight'));
	    collidePixels.push(Tools.getPlayerPoint(player,'bottomLeft'));
	    collidePixels.push(Tools.getPlayerPoint(player,'middleRight'));
	    collidePixels.push(Tools.getPlayerPoint(player,'middleLeft'));
	    collidePixels.push(Tools.getPlayerPoint(player,'topRight'));
	    collidePixels.push(Tools.getPlayerPoint(player,'topLeft'));


	    let colliding = [];

	    collidePixels.forEach(function(pix) {
	    	if(
	    		pix.x >= platform.x && 
	    		pix.x <= (platform.x+platform.w) && 
	    		pix.y >= platform.y && 
	    		pix.y <= (platform.y+platform.h)
	    	) colliding.push(pix.id);
	    })
	    return colliding;
	}

	//shit, platform are defined from top left and sprites are defined from bottom center
	static detectSpriteCollision(player,sprite) {
	    //On detecte si aucune collision
	    if((player.x+player.bounding.w/2) < (sprite.x-sprite.bounding.w/2)) return [];
	    if((player.x-player.bounding.w/2) > (sprite.x+sprite.bounding.w/2) ) return [];
	    


	    //We check for the 7 pixels if they collide
	    //each corner plus middle of sprite + center
	    let collidePixels = [];
	    let spriteTop = sprite.y- sprite.bounding.h;
	    let spriteBottom = sprite.y;
	    if(duplicated.grav > 0) {

	    	//player under the sprite
	    	if((player.y-player.bounding.h) > sprite.y ) return [];
	    	//player on top of the sprite
	    	if(player.y < sprite.y-sprite.bounding.h) return [];

		    collidePixels.push({id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y});
		    collidePixels.push({id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y});
		    collidePixels.push({id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h/2});
		    collidePixels.push({id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h/2});
		    collidePixels.push({id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h});
		    collidePixels.push({id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h});
		    collidePixels.push({id:'center',x:player.x,y:player.y-player.bounding.h/2});


		} else {
			//player under the sprite (inverted gravity)
			if((player.y-player.h+player.bounding.h) < (sprite.y-sprite.h)) return [];
			//player on top of the sprite (inverted gravity)
	    	if((player.y-player.h) > (sprite.y-sprite.h+sprite.bounding.h)) return [];

			collidePixels.push({id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y-player.h});
		    collidePixels.push({id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y-player.h});
		    collidePixels.push({id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.h+player.bounding.h/2});
		    collidePixels.push({id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.h+player.bounding.h/2});
		    collidePixels.push({id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.h+player.bounding.h});
		    collidePixels.push({id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.h+player.bounding.h});
		    collidePixels.push({id:'center',x:player.x,y:player.y-player.h+player.bounding.h/2});

		    //not real sprite top due to >=
		    spriteTop = sprite.y - sprite.h;
	    	spriteBottom = sprite.y - sprite.h+sprite.bounding.h;
		}

	    let colliding = [];

	    collidePixels.forEach(function(pix) {
	    	if(
	    		pix.x >= (sprite.x- sprite.bounding.w/2) && 
	    		pix.x <= (sprite.x+ sprite.bounding.w/2) && 
	    		pix.y >= spriteTop && 
	    		pix.y <= spriteBottom
	    	) colliding.push(pix.id);
	    })

	    return colliding;
	}

	//https://jsfiddle.net/magikMaker/7bjaT/
	static encodeDataForURL(str){
		str= window.btoa(str);
	    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '@');
	}

	static decodeDataFromUrl(str){
	    str = str.replace(/-/g, '+').replace(/_/g, '/').replace(/@/g, '=');
	    return window.atob(str); 
	}

}
Tools.nbCollisionPoints = 7;