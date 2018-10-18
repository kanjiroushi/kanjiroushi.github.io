class Door {

	constructor(options) {
		
		//options mandatory
		this.image = options.image;
		this.context = options.context;

		this.doorNum = options.doorNum || 0;
		this.x = options.x || 200;
	    this.y = options.y || 200;


	    this.spriteX = this.doorNum * 48;

	    this.w=48; //sprite size
	    this.h=48; //sprite size

	   	//the bounding for collision detection
	    this.bounding= {
	        w:38,
	        h:38,
	    };

		this.image = options.image;

		//is the user in front of the door
		this.active = false;
	} //end constructor


	update(players) {
		var player = players.filter(p => p.playerNum === this.doorNum)[0];
		var coll = Tools.detectSpriteCollision(player,this);
		if(coll.length === Tools.nbCollisionPoints) this.active = true;
		else this.active = false;
	      
	}; //end update


	render() {
		this.context.drawImage(
		    this.image,
		    (this.active | 0) * this.w,
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