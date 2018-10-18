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
	    if(options.reverseCommands) this.reverseCommands = true;
	    else this.reverseCommands = false;


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









	update(keysPressed,platforms,players) {
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

	    if(keysPressed.up && this.onGround) {
	        this.speed.y = -10;
	    }
	    if(!keysPressed.up && this.speed.y<-3) {
	        this.speed.y=-3;
	    }


	    if(keysPressed.left) {
	        if(this.reverseCommands) this.speed.x=2;
	    	else this.speed.x=-2;
	    }
	    if(keysPressed.right) {
	        if(this.reverseCommands) this.speed.x=-2;
	    	else  this.speed.x=2; 
	    }
	    //on update la position du joueur avec la vitesse
	    this.x+=this.speed.x;
	    this.y+=this.speed.y;
	    //si au sol on applique un coef de friction
	    if(this.onGround) {
	        this.speed.x *= 0.8;
	    } else {
	        this.speed.y += grav;
	    }

	    //We round to the nearest pixel
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);


		//We detect the collisions
		this.onGround=false;

	    platforms.forEach(plat => {

	        let coll = Tools.detectPlatformCollision(this,plat);

	        if(coll.length === 0) return;

	        //on the ground
	        if(coll.includes('bottomRight') && coll.includes('bottomLeft')) {
	        	this.y=plat.y;
	            this.onGround=true;
	            this.onGroundPlatform=plat.id;
	            this.speed.y = 0;
	            return;
	        }
	        //hit the top
	        if(coll.includes('topRight') && coll.includes('topLeft')) {
	        	this.y=plat.y+plat.h+this.bounding.h+1;
	            this.speed.y=0;
	            return;
	        }
	        //hit the platform at an angle
	        if(coll.length ==1 && (coll.includes('topRight') || coll.includes('topLeft'))) {
	        	this.y=plat.y+plat.h+this.bounding.h+1;
	        	if(this.speed.y < 0) this.speed.y = 0;
	            return;
	        }
	        if(coll.length ==1 && (coll.includes('bottomRight') || coll.includes('bottomLeft'))) {
	        	this.y=plat.y;
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
	    players.forEach(p => {
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


		if(this.onGround && Math.abs(this.speed.x) <0.1) {
			//idle
			this.frameIndex = 6;
			
			this.context.drawImage(
			    this.image,
			    (this.frameIndex+reverseSprite)* this.w,
			    this.spriteX,
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
			    this.spriteX,
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
			    this.spriteX,
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