import p5 from 'p5/lib/p5.min';

const sketch = (p5) => {
	let img
	let system
	let scale = 1
	let density = .5
	
	let images = ["./assets/munkacsy.jpg","./assets/washington.jpg", "./assets/gilbert.jpg","./assets/mona.jpg","./assets/vermeer.png","./assets/frida2.jpg"]
	

	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(0)
		loadImage()


	}

	let seed = 0
	p5.draw = () => {
		seed ++
		p5.fill(0,0,0,200)
		if(system != null) system.run();
	}


	let i = 0
	p5.mouseClicked = () => {
		loadImage()
	}

	var loadImage = () => {
		img = p5.loadImage(images[i], () => {
			p5.background(0)
			scale = 500/img.width
			system = new ParticleSystem(p5.createVector(p5.windowWidth/2, p5.windowHeight/2));

			for(let x=0; x<img.width*scale; x+=density) {
				system.addParticle(p5.createVector(x,0));
		  	}

			img.loadPixels()
			for (let y = 0; y < img.height; y++) {
				for (let x = 0; x < img.width; x++) {
					let loc = x + y * img.width;
					img.pixels[loc]
				}
			}
		})
		i++
		i = i%images.length
	}



	var Particle = function(position) {
		this.lastPixel = 0
		this.lastPixel2 = 0
		this.acceleration = p5.createVector(0, 0);
		this.velocity = p5.createVector(0, p5.random(3,10));
		p5.angleMode(p5.DEGREES)
		this.position = position.copy();
		this.lastPosition = position.copy();
	};

	Particle.prototype.run = function() {
		this.lastPosition = this.position.copy()
		this.update();
		this.display();
	};

	// Method to update position
	Particle.prototype.update = function(){
		let pixel = img.get(this.position.x/scale,this.position.y/scale)[0] +
		img.get(this.position.x/scale,this.position.y/scale)[1] +
		img.get(this.position.x/scale,this.position.y/scale)[2]
		pixel /= (255*3)
		pixel -= .5
		if(this.position.x/scale<=0 || this.position.x/scale>=img.width || this.position.y/scale <= 0 || this.position.y/scale >= img.height) {
			pixel = -1
		} else {
			this.lastPixel2 = img.get(this.position.x/scale,this.position.y/scale)
		}
		this.velocity.add(this.acceleration);
		
		if(pixel != -1) {
			let noise = p5.noise(this.position.x/10,this.position.y/10, seed/10)
			//this.velocity.rotate( .1*) );
			// console.log(p5.Vector)a
			
			
			this.velocity.rotate((this.lastPixel - pixel)*2000)

			if((this.velocity.heading()-90)<0) {
				this.velocity.rotate(10*Math.random())
			} else {
				this.velocity.rotate(10*Math.random())
			}

			this.lastPixel = pixel
		} else {
			//this.velocity.rotate(Math.sin(seed/100)/40);
		}
		

		this.position.add(this.velocity);

	};

	// Method to display
	Particle.prototype.display = function() {

		let pixel = img.get(this.position.x/scale,this.position.y/scale)
		//p5.stroke(0,0,0,100)
		
		let noise = p5.noise(this.position.x/100,this.position.y/100, seed*10)*100
		p5.stroke(this.lastPixel2[0]+noise,this.lastPixel2[1]+noise, this.lastPixel2[2]+noise, 255)
		let wdth = 1.5-pixel/255/2
		wdth = 1
		let offsetX = (p5.windowWidth-img.width*scale)/2
		let offsetY = (p5.windowHeight-img.height*scale)/2
		p5.line(this.position.x +offsetX, this.position.y +offsetY, this.lastPosition.x + offsetX, this.lastPosition.y + offsetY);

		if(this.position.y > img.height*scale ||
			this.position.y < 0 ||
			this.position.x < 0 ||
			this.position.x > img.width*scale
			) {
				this.velocity = p5.createVector(0,p5.random(5,10))
				this.position = p5.createVector(
					p5.random(0, img.width*scale),
					p5.random(10, 10)
				)
		}
	};


	var ParticleSystem = function(position) {
		this.origin = position.copy();
		this.particles = [];
	};

	ParticleSystem.prototype.addParticle = function(position) {
		this.particles.push(new Particle(position));
	};

	ParticleSystem.prototype.run = function() {

		p5.background(0,0,0,10)
		for (var i = this.particles.length-1; i >= 0; i--) {
			var p = this.particles[i];
			p.run();
		}
	};
}

export default sketch;

new p5(sketch);
