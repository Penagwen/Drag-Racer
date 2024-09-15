const Camera = {
	x: 0,
	y: 0,
	scale: 1,
	follwedObject: null,
	originalFollwedObject: null,

	shake: (miliSec, magnitude) => {
		if(miliSec <= 0) return;

		Camera.x -= Math.random()*(magnitude*2)-magnitude;
		Camera.y -= Math.random()*(magnitude*2)-magnitude;

		setTimeout(() => { Camera.shake(miliSec-1, magnitude); }, 1);
	},
	follow: async function(object){
		if(object === null){
			Camera.follwedObject = null;
			Camera.originalFollwedObject = null;
		}else{
			Camera.follwedObject = object;

			if(!Camera.originalFollwedObject){
				Camera.originalFollwedObject = object;
			}
			await Camera.moveToFollowedObject();
		}
	},
	moveToFollowedObject: async function() {
		if(Camera.follwedObject !== null){
			Camera.x = Camera.follwedObject.x;
			Camera.y = Camera.follwedObject.y;

			await new Promise(resolve => setTimeout(resolve, 0));

			await Camera.moveToFollowedObject();
		}
	},
	goToPosition: async function(x, y, delay = 0){
		Camera.originalFollwedObject = Camera.follwedObject;
		Camera.follwedObject = null;

		Camera.x = x;
		Camera.y = y;

		await new Promise(resolve => setTimeout(resolve, delay));

		Camera.follow(Camera.originalFollwedObject);
	},

	scaleTo: (scale, delay = 0) => {
		gsap.to(Camera, {
			scale: scale,
			duration: delay,
		});

		// make sure scale isn't 0
		if(scale === 0) Camera.scale = 1;
	},

	render: (canvas, ctx) => {
		ctx.transform(Camera.scale, 0, 0, Camera.scale, -Camera.x*Camera.scale + canvas.width/2, -Camera.y*Camera.scale + canvas.height/2);
	}
}