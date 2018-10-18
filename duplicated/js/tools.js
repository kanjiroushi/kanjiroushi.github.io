class Tools {


	static detectPlatformCollision(player,platform) {
	    //On detecte si aucune collision
	    if((player.x+player.bounding.w/2) < platform.x ) return [];
	    if((player.x-player.bounding.w/2) > (platform.x+platform.w) ) return [];
	    if((player.y-player.bounding.h) > (platform.y+platform.h) ) return [];
	    if(player.y < platform.y) return [];


	    //We check for the 6 pixels if they collide
	    let collidePixels = [];
	    collidePixels.push({id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y});
	    collidePixels.push({id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y});
	    collidePixels.push({id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h/2});
	    collidePixels.push({id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h/2});
	    collidePixels.push({id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h});
	    collidePixels.push({id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h});

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
	    if((player.y-player.bounding.h) > sprite.y ) return [];
	    if(player.y < sprite.y-sprite.bounding.h) return [];


	    //We check for the 7 pixels if they collide
	    //each corner plus middle of sprite + center
	    let collidePixels = [];
	    collidePixels.push({id:'bottomRight',x:player.x+player.bounding.w/2,y:player.y});
	    collidePixels.push({id:'bottomLeft',x:player.x-player.bounding.w/2,y:player.y});
	    collidePixels.push({id:'middleRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h/2});
	    collidePixels.push({id:'middleLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h/2});
	    collidePixels.push({id:'topRight',x:player.x+player.bounding.w/2,y:player.y-player.bounding.h});
	    collidePixels.push({id:'topLeft',x:player.x-player.bounding.w/2,y:player.y-player.bounding.h});
	    collidePixels.push({id:'center',x:player.x,y:player.y-player.bounding.h/2});

	    let colliding = [];

	    collidePixels.forEach(function(pix) {
	    	if(
	    		pix.x >= (sprite.x- sprite.bounding.w/2) && 
	    		pix.x <= (sprite.x+ sprite.bounding.w/2) && 
	    		pix.y >= (sprite.y- sprite.bounding.h) && 
	    		pix.y <= sprite.y
	    	) colliding.push(pix.id);
	    })

	    return colliding;
	}

}
Tools.nbCollisionPoints = 7;