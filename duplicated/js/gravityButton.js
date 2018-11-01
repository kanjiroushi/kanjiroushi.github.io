class gravityButton {

	constructor(options) {
		
		//options mandatory
		this.image = options.image;
		this.context = options.context;

		this.x = options.x || 200;
	    this.y = options.y || 200;


	    if(options.mode == 'down') this.spriteX = 32;
	    else this.spriteX = 0;

	    this.w=32; //sprite size
	    this.h=32; //sprite size

	   	//the bounding for collision detection
	    this.bounding= {
	        w:23,
	        h:22,
	    };

	    this.boundingNotPressed= {
	        w:23,
	        h:22,
	    };
	    //boundingPressed
	    this.boundingPressed= {
	        w:23,
	        h:10,
	    };
		this.image = options.image;

		//is the button going up or down
		this.mode = options.mode;

		this.pressed = false;
		if(this.mode == 'down') this.pressed = true;

		
	} //end constructor


	update() {
		if(!this.pressed) {
			var self = this;
			duplicated.players.forEach(function(player) {
				var coll = Tools.detectSpriteCollision(player,self);
				if(coll.length > 0) {
					self.doPress(true);
					
					if(self.mode == 'up') duplicated.grav = -0.5;
					else grav = 0.5;
					duplicated.gravityButtons.forEach(function(g) {
						if(self.mode  == g.mode) g.doPress(true);
						else g.doPress(false);
					})
				}
		    })
	    }
	}; //end update

	doPress(isPressed) {
		this.pressed = isPressed;
		if(isPressed) this.bounding = this.boundingPressed;
		else this.bounding = this.boundingNotPressed;
	}

	render() {

		this.context.drawImage(
		    this.image,
		    (this.pressed | 0) * this.w,
		    this.spriteX,
		    this.w,
		    this.h,
		    this.x-this.w/2,
		    this.y-this.h,
		    this.w,
		    this.h
	    );
	} //end render


} //end class