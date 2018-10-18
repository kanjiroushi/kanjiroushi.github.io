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
	        w:14,
	        h:18,
	    };

		this.width = options.width;
		this.height = options.height;
		this.image = options.image;
	} //end constructor









	update(keysPressed,platforms) {
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

	    for(let i=0;i<platforms.length;i++) {

	        var coll = this.detectCollision(platforms[i]);
	        if(coll == 'top') {
	            this.y=platforms[i].y;
	            this.onGround=true;
	            this.onGroundPlatform=platforms[i].id;
	            this.speed.y = 0;
	        }
	        if(coll == 'bottom') {
	            this.y=platforms[i].y+platforms[i].h+this.bounding.h;
	            this.speed.y=0;
	        }
	        if(coll == 'left') {
	            this.x=platforms[i].x-this.bounding.w/2;
	            this.speed.x = 0;
	        }
	        if(coll == 'right') {
	            this.x=platforms[i].x+platforms[i].w+this.bounding.w/2;
	            this.speed.x = 0;
	        }
	    }


	}; //end update





	detectCollision(platform) {
	    //On detecte si aucune collision
	    if((this.x+this.bounding.w/2) < platform.x ) return ;
	    if((this.x-this.bounding.w/2) > (platform.x+platform.w) ) return ;
	    if((this.y-this.bounding.h) > (platform.y+platform.h) ) return ;
	    if(this.y < platform.y) return ;

	    //on regarde dans les premier pixels et derniers pixels de la platforme
	    //sauf si le that est sur le sol(pour éviter le décalage de pixel)
	    if(this.onGroundPlatform != platform.id && Math.abs(this.x+this.bounding.w/2-platform.x) < this.bounding.w) return 'left';
	    if(this.onGroundPlatform != platform.id && Math.abs(this.x-this.bounding.w/2-platform.x-platform.w) < this.bounding.w) return 'right';
	    
	    //on regarde en dessous et au dessus
	    if(this.y >= platform.y && (this.y-this.bounding.h) < (platform.y + platform.h/2)) return 'top';
	    if((this.y-this.bounding.h) < platform.y+platform.h && this.y > (platform.y + platform.h/2)) return 'bottom';
	    return;
	}




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