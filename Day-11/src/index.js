import p5 from 'p5/lib/p5.min';

const sketch = (p5) => {
	let img
	let system
	let scale = 1
	let density = .5
	let num = 1
	let breed = 10
	
	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		p5.background(0)
		
		system = new ParticleSystem(p5.createVector(p5.windowWidth/2, p5.windowHeight/2));
		for(let x=0; x<num; x+=1) {
			system.addParticle(p5.createVector(p5.windowWidth/2,p5.windowHeight), 0, 1, 1);

			system.addParticle(p5.createVector(p5.windowWidth/2,p5.windowHeight), -125, 1, 1);
		  }
		for (var i = 0; i<num; i++) {

		}
	}

	let seed = 0
	p5.draw = () => {
		seed ++
		p5.fill(0,0,0,200)
		if(system != null) system.run();
	}


	let i = 0
	p5.mouseClicked = () => {
		p5.background(33)
		formulaSeed++
		if(formulaSeed > 5) formulaSeed = 1
		system = new ParticleSystem(p5.createVector(p5.windowWidth/2, p5.windowHeight/2));
		for(let x=0; x<num; x+=1) {
			system.addParticle(p5.createVector(p5.windowWidth/2,p5.windowHeight), 0, 1, 1);
			system.addParticle(p5.createVector(p5.windowWidth/2,p5.windowHeight), -125, 1, 1);
		  
		  }
		
	}

	let formulaSeed = 1

	let dice = (probability = .5) => {
		let rnd = Math.random()
		if (rnd < probability) {
			return 1
		} else {
			return 0
		}
	}
	let formula = (_this) => {
		switch (formulaSeed) {
			case 1:
			
				if(seed%(10+dice(.8)*20)==0) {

					_this.nextBreed =  Math.round(breed + breed*p5.random(0,1))

					system.addParticle(_this.position, _this.angle-90, p5.random(_this.strength/2,_this.strength), _this.generation+1)
					system.addParticle(_this.position, _this.angle+90, p5.random(_this.strength/2,_this.strength), _this.generation+1)

				}
				_this.life += .1
				break
			case 2:
					
				_this.velocity.rotate(Math.sin(seed/10+_this.strength*100)*1)
				if(_this.nextBreed==0) {

					_this.nextBreed =  Math.round(breed + breed*p5.random(0,1))

					system.addParticle(_this.position, _this.angle - _this.strength*120*p5.random(-1,1), p5.random(_this.strength/2,_this.strength), _this.generation+1)
					system.addParticle(_this.position, _this.angle - _this.strength*120*p5.random(-1,1), p5.random(_this.strength/2,_this.strength), _this.generation+1)

				}
				break
			case 3:
				let noise = p5.noise(_this.position.x, _this.position.y)
				if(seed%10==0 && noise < .35) {

					_this.nextBreed =  Math.round(breed + breed*p5.random(0,1))


					system.addParticle(_this.position, _this.angle-90, p5.random(_this.strength/2,_this.strength), _this.generation+1)
					system.addParticle(_this.position, _this.angle+90, p5.random(_this.strength/2,_this.strength), _this.generation+1)

				}
				_this.life += .1
				break
			case 4:
				let noise2 = p5.noise(_this.position.x, _this.position.y)-.5
					
				if(seed%10==0) {

					_this.nextBreed =  Math.round(breed + breed*p5.random(0,1))

					system.addParticle(_this.position, Math.round(noise2*10)%100*120, p5.random(_this.strength/2,_this.strength), _this.generation+1)
					system.addParticle(_this.position, Math.round(noise2*10)%100*120, p5.random(_this.strength/2,_this.strength), _this.generation+1)

				}
				break
			case 5:
				return 5
				break
		}

		_this.velocity.add(_this.acceleration);
		_this.position.add(_this.velocity);
		
		if(_this.life < 0) {
			_this.kill()
		}
	}

	var Particle = function(position, angle, strength, gen) {
		this.strength = strength
		this.angle = angle
		this.nextBreed = breed + Math.round(breed*strength)
		this.life = Math.round(strength*300)
		this.lastPixel = 0
		this.lastPixel2 = 0
		this.acceleration = p5.createVector(0, 0);
		this.velocity = p5.createVector(0, -1);
		this.velocity.rotate(angle)
		this.generation = gen
		p5.angleMode(p5.DEGREES)
		this.position = position.copy();
		this.lastPosition = position.copy();
	};

	Particle.prototype.run = function() {
		this.lastPosition = this.position.copy()
		this.display();
		this.nextBreed--
		this.life--

		formula(this)
	};


	Particle.prototype.kill = function() {
		system.kill(this)
	}

	let offsetX = 0
	let offsetY = -p5.windowHeight/2
	// Method to display
	Particle.prototype.display = function() {

		p5.stroke(255-seed/2,255,255-seed/5,this.strength*255)
		p5.stroke(255)
		p5.strokeWeight(this.strength*this.strength*3)
		p5.noFill()
		p5.line(this.position.x +offsetX, this.position.y +offsetY, this.lastPosition.x + offsetX, this.lastPosition.y + offsetY);

	};


	var ParticleSystem = function(position) {
		this.origin = position.copy();
		this.particles = [];
	};

	ParticleSystem.prototype.addParticle = function(position, angle, strength, gen) {

		this.particles.push(new Particle(position, angle, strength, gen));
	};

	ParticleSystem.prototype.run = function() {

		for (var i = this.particles.length-1; i >= 0; i--) {
			var p = this.particles[i];
			p.run();
		}
	};


	ParticleSystem.prototype.kill = function(particle) {
		var index = this.particles.indexOf(particle)
		this.particles.splice(index, index+1)
	};
}

export default sketch;

new p5(sketch);
