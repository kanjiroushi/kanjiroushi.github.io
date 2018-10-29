class Player {




	constructor(options) {
		/* animation*/
		this.frameIndex = 0;
		this.tickCount = 0;
		
		//options mandatory
		this.image = options.image;
		this.context = options.context;

		//options not mandatory
		this.ticksPerFrame = options.ticksPerFrame || 3;
		this.numberOfFrames = options.numberOfFrames || 6;



		this.playerNum = options.playerNum || 0;
		this.x = options.x || 200;
	    this.y = options.y || 200;


	    this.spriteX = this.playerNum * 24;
	    //We can reverse the left and right commands
	    if(options.reverseCommand) this.reverseCommand = true;
	    else this.reverseCommand = false;


		this.onGround = false;
	    
	    this.speed= {
	        x:0,
	        y:-3,
	    };
	    this.w=24; //sprite size
	    this.h=24; //sprite size

	    


	    this.bounding= {
	        w:12,
	        h:18,
	    };

		this.image = options.image;
	} //end constructor









	update() {

		let prevX = this.x;
		let prevY = this.y;
		//tick counter for animation
	    this.tickCount += 1;
	    if (this.tickCount > this.ticksPerFrame) {
			this.tickCount = 0;
	        // If the current frame index is in range
	        if (this.frameIndex < this.numberOfFrames - 1) {	
	            // Go to the next frame
	            this.frameIndex += 1;
	        } else {
	            this.frameIndex = 0;
	        }
	    }

	    //modification of position
	    //si on se déplace à gauche ou à droite on change la vitesse

	    if(duplicated.keysPressed.u && this.onGround) {
	        if(duplicated.grav > 0) this.speed.y = -10;
	        else this.speed.y = 10; 
	    }
	    //stop pressing, we set the y speed
	    if(duplicated.grav > 0 && !duplicated.keysPressed.u && this.speed.y<-3) {
	        this.speed.y=-3;
	    }
	    if(duplicated.grav < 0 && !duplicated.keysPressed.u && this.speed.y>3) {
	        this.speed.y=3;
	    }


	    if(duplicated.keysPressed.l) {
	        if(this.reverseCommand) this.speed.x=2;
	    	else this.speed.x=-2;
	    }
	    if(duplicated.keysPressed.r) {
	        if(this.reverseCommand) this.speed.x=-2;
	    	else this.speed.x=2; 
	    }
	    //on update la position du joueur avec la vitesse
	    this.x+=this.speed.x;
	    this.y+=this.speed.y;
	    //si au sol on applique un coef de friction
	    if(this.onGround) {
	        this.speed.x *= 0.3;
	    } else {
	        this.speed.y += duplicated.grav;
	    }


	    //terminal velocity
	    if(duplicated.grav > 0 && this.speed.y > 15 ) this.speed.y = 15;
	    if(duplicated.grav < 0 && this.speed.y < -15 ) this.speed.y = -15;

	    //we don t exit
	    if(this.x < 0) this.x = 16;
	    if(this.x > duplicated.bw) this.x = duplicated.bw-16;

	    if(this.y < 0) this.y = 16;
	    if(this.y > duplicated.bh) this.y = duplicated.bh-16;


	    //We round to the nearest pixel
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);


		//We detect the collisions
		let wasOnGround = this.onGround;
		this.onGround=false;

	    duplicated.platforms.forEach(plat => {

	        let coll = Tools.detectPlatformCollision(this,plat);
	        if(coll.length === 0) return;

	        
	        //on the ground
	        if(coll.includes('bottomRight') && coll.includes('bottomLeft')) {
//	        	console.log('on the ground');
	        	//looking down
	        	if(duplicated.grav > 0) {
		        	this.y=plat.y;
		            this.onGround=true;
		            this.onGroundPlatform=plat.id;
		            this.speed.y = 0;
		            return;
	            } else {
	            	this.y=plat.y+plat.h+this.h;
		            this.onGround=true;
		            this.onGroundPlatform=plat.id;
		            this.speed.y = 0;
		            return;
	            }
	        }
	        //hit the top
	        if(coll.includes('topRight') && coll.includes('topLeft')) {
//	        	console.log('hit the top');
	        	if(duplicated.grav > 0) {
	        		this.y=plat.y+plat.h+this.bounding.h+1;
	            	this.speed.y=0;
	            	return;
	            } else {
	            	this.y=plat.y+this.h-this.bounding.h-1;
	            	this.speed.y=0;
	            	return;
	            }
	        }
	        //hit the platform with the head at an angle
	        if(coll.length ==1 && (coll.includes('topRight') || coll.includes('topLeft'))) {
//	        	console.log('hit the top at an angle');
	        	if(duplicated.grav > 0) {
	        		this.y=plat.y+plat.h+this.bounding.h+1;
	        		if(this.speed.y < 0) this.speed.y = 0;
	            	return;
	            } else {
	            	this.y=plat.y+this.h-this.bounding.h-1;
	            	if(this.speed.y > 0) this.speed.y=0;
	            	return;
	            }
	        }
	        //hit the ground at an angle, we don t allow him to jump already but allow to stay on the platform
	        if(coll.length ==1 && (coll.includes('bottomRight') || coll.includes('bottomLeft'))) {
//	        	console.log('hit at angle','prev:'+prevY,'current:'+this.y,'plat:'+plat.y);
	        	if(duplicated.grav > 0) {
	        		this.y=plat.y;
	        		//if it comes from the top we allow to stay on the platform
	        		if(prevY < this.y) {
	        			console.log('we kill the speed');
	        			this.speed.y = 0;
	            	}
	            } else {
	            	this.y=plat.y+plat.h+this.h;

	            	//if it comes from the top we allow to stay on the platform
	        		if(prevY > this.y) this.speed.y = 0;
	            }
	            //we allo the user to be still on ground even with half of hitbox over the edge
	            //usefull to allow the user to jump
	            if(wasOnGround) this.onGround=true;
	            return;
	        }
	        //If the middle of the player hit, it is against the wall
	        if(coll.includes('middleRight')) {
	        	this.x=plat.x-this.bounding.w/2-1;
	            this.speed.x = 0;
	            return;
	        }
	        if(coll.includes('middleLeft')) {
	        	this.x=plat.x+plat.w+this.bounding.w/2+1;
	            this.speed.x = 0;
	            return;
	        }
	    })


	    //We detect the collision with other players
	    duplicated.players.forEach(p => {
	    	if(p.playerNum == this.playerNum) return;
	    	let coll = Tools.detectSpriteCollision(this,p);
	    	
	    	if(coll.length === 0) return;

	        //on top of the other guy
	        if(coll.includes('bottomRight') && coll.includes('bottomLeft')) {
	        	this.y = p.y-p.bounding.h;
	            return;
	        }
	        //hit the top
	        if(coll.includes('topRight') && coll.includes('topLeft')) {
	        	p.y = this.y-this.bounding.h;
	            return;
	        }
	        //hit from the right
	        if(coll.includes('topRight') || coll.includes('middleRight') || coll.includes('bottomRight')) {
	        	this.x=p.x-p.w/2;
	            return;
	        }
	        if(coll.includes('topLeft') || coll.includes('middleLeft') || coll.includes('bottomLeft')) {
	        	this.x=p.x+p.w/2;
	            return;
	        }
	    })

	}; //end update





	




	render() {
		//the reversed sprite facing left are 9 frame later in the image file
		let reverseSprite = 0;
		if(this.speed.x < 0) reverseSprite = 9;

		//gravity reversal
		if(duplicated.grav < 0) this.finalX = this.spriteX + 24*4;
		else this.finalX = this.spriteX;

		if(this.onGround && Math.abs(this.speed.x) <0.1) {
			//idle
			this.frameIndex = 6;
			
			this.context.drawImage(
			    this.image,
			    (this.frameIndex+reverseSprite)* this.w,
			    this.finalX,
			    this.w,
			    this.h,
			    this.x-this.w/2,
			    this.y-this.h,
			    this.w,
			    this.h
		    );
		} else if(this.onGround) {
			// running
			this.context.drawImage(
			    this.image,
			    (this.frameIndex+reverseSprite) * this.w,
			    this.finalX,
			    this.w,
			    this.h,
			    this.x-this.w/2,
			    this.y-this.h,
			    this.w,
			    this.h);
		} else {
			//jumping
			this.frameIndex = 7;
			this.context.drawImage(
			    this.image,
			    (this.frameIndex+reverseSprite) * this.w,
			    this.finalX,
			    this.w,
			    this.h,
			    this.x-this.w/2,
			    this.y-this.h,
			    this.w,
			    this.h
		    );
		}
	} //end render


} //end class