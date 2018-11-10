import p5 from 'p5/lib/p5.min';

const sketch = (p5) => {
	let img
	let system
	let scale = 1
	let density = 10

	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(255)

		img = p5.loadImage("./assets/wave.jpg", () => {
			system = new ParticleSystem(p5.createVector(p5.windowWidth/2, p5.windowHeight/2));

			for(let x=0; x<img.width*scale; x+=density) {
				for(let y=0; y<img.height*scale; y+=2) {
					system.addParticle(p5.createVector(x,y));
				}
		  	}

			img.loadPixels()
			for (let y = 0; y < img.height; y++) {
				for (let x = 0; x < img.width; x++) {
					let loc = x + y * img.width;
					img.pixels[loc]
				}
			}
		})


	}

	let seed = 0
	p5.draw = () => {
		seed ++
		p5.fill(0,0,0,10)
		if(system != null) system.run();
	}


	let i = 0
	let images = ["./assets/frida.jpg","./assets/vasarely.jpg","./assets/munkacsy.jpg","./assets/wave.jpg","./assets/modiano.png", "./assets/lines.jpg"]
	p5.mouseClicked = () => {
		img = p5.loadImage(images[i], () => {
			p5.background(255)
			scale = 500/img.width
			system = new ParticleSystem(p5.createVector(p5.windowWidth/2, p5.windowHeight/2));

			for(let x=0; x<img.width*scale; x+=density) {
				for(let y=0; y<img.height*scale; y+=2) {
					system.addParticle(p5.createVector(x,y));
				}
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
		this.acceleration = p5.createVector(0, 0.0);
		this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
		this.position = position.copy();
	};

	Particle.prototype.run = function() {
		this.update();
		this.display();
	};

	// Method to update position
	Particle.prototype.update = function(){
		
		let pixel = img.get(this.position.x/scale,this.position.y/scale)[0] +
		img.get(this.position.x/scale,this.position.y/scale)[1] +
		img.get(this.position.x/scale,this.position.y/scale)[2]
		pixel /= (255*3)
		pixel = 1-pixel
		pixel *= pixel
		if(this.position.x/scale<=0 || this.position.x/scale>=img.width || this.position.y/scale <= 0 || this.position.y/scale >= img.height) {
			pixel = -1
		} else {
			this.lastPixel2 = img.get(this.position.x/scale,this.position.y/scale)
		}
		this.velocity.add(this.acceleration);
		//this.velocity.add(p5.noise(this.position.x/10, this.position.y/10)/1000);
		//this.velocity.add((1-pixel)/10);
		
		//this.velocity.rotate(pixel/50*Math.sin(seed/100)*Math.cos(seed/200));
		if(pixel != -1) {
			this.velocity.rotate((pixel-this.lastPixel)*10 * Math.sin(seed/10) );
			this.lastPixel = pixel
		} else {
			this.velocity.rotate(Math.sin(seed/100)/40);
		}
		

		this.position.add(this.velocity);

	};

	// Method to display
	Particle.prototype.display = function() {

		let pixel = img.get(this.position.x/scale,this.position.y/scale)
		p5.noStroke()
		//p5.fill(this.lastPixel2[0],this.lastPixel2[1], this.lastPixel2[2], 20)
		let wdth = 1.5-pixel/255/2
		wdth = 1
		let offsetX = (p5.windowWidth-img.width*scale)/2
		let offsetY = (p5.windowHeight-img.height*scale)/2
		p5.rect(this.position.x +offsetX, this.position.y +offsetY, wdth,wdth);

		let dist = p5.dist(
			this.position.x+offsetX,this.position.y+offsetY,
			p5.windowWidth/2, p5.windowHeight/2
		)
		if(dist > 600) {
			this.position = p5.createVector(
				p5.random(0, img.width*scale),
				p5.random(0, img.height*scale)
			)
		}
	};


	var ParticleSystem = function(position) {
		this.origin = position.copy();
		this.particles = [];
	};

	ParticleSystem.prototype.addParticle = function(position) {
		let randomOrigin = p5.createVector(
			p5.random(0, img.width*scale),
			p5.random(0, img.height*scale)
		)
		this.particles.push(new Particle(position));
	};

	ParticleSystem.prototype.run = function() {
		for (var i = this.particles.length-1; i >= 0; i--) {
			var p = this.particles[i];
			p.run();
		}
	};
}

export default sketch;

new p5(sketch);
