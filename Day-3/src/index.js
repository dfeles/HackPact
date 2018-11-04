import p5 from 'p5/lib/p5.min';
import tone from 'tone';

const sketch = (p5) => {
	let num = 10;
	let pnts = [[]];
	let ratio = p5.windowWidth/p5.windowHeight
	let formulaSeed = Math.round(Math.random() * 6)
	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
		for(let i=0; i < num*ratio; i++) {
			let numbers = []
			for(let n=0; n < num; n++) {
				numbers[n] = Math.random()*100*(-(n*2/num-1))*(-(i*2/(num*ratio)-1))
			}
			pnts[i] = numbers
		}
	}
	let mouseX = p5.mouseX
	let mouseY = p5.mouseY
	let count = p5.frameCount

	let seed = 0
	p5.draw = () => {
		
		p5.push()
		let x=0
		p5.translate(300,200)
		for(let i=0; i<num*ratio; i++) {
			
			p5.translate(400 / num, 0);
			x += 5;
			let lastY = 0
			let height = 400 / num

			for(let n=0; n < num; n++) {
				let noise = p5.noise(i/10, n/10, seed)
				noise = noise*noise
				
				p5.noStroke()
				p5.fill(n,255,255);
				let rnd = pnts[i][n]

		p5.push()
				formula(i,n, rnd, lastY, height)

		p5.pop()
				
				lastY = lastY+height;
			}
		}
		p5.pop()
		seed+=.1
	}

	p5.mouseClicked = () => {
		p5.clear()
		formulaSeed++;
		if (formulaSeed > 5) formulaSeed = 1 
		p5.print (formulaSeed)
	}

	let formula = (i,n, rnd, lastY, height) => {
		switch (formulaSeed) {
			case 1:
				p5.rotate(rnd/100)
				let x = 0+rnd + Math.cos(i/10+p5.frameCount/10)*Math.tan(n/200+p5.frameCount/10)*Math.cos(n/10+p5.frameCount/10)*30 
				let y = lastY+Math.sin(n/100+p5.frameCount/10)*Math.cos(i/100+p5.frameCount/10)*30+rnd+height
				p5.fill(i*100,n*100,255)
				p5.rect(x,y, .1, .1)
				break
			case 2:
				p5.rotate(rnd/100)
				let x1 = 0+rnd + Math.atan(i/10+p5.frameCount/10)*Math.tan(n/20+p5.frameCount/10)*Math.cos(n/10+p5.frameCount/10)*30
				let y1 = lastY+Math.atan(n/10+p5.frameCount/10)*Math.cos(i/100+p5.frameCount/10)*30+rnd+height
				p5.fill(i*100,n*100,255)
				p5.rect(x1,y1, .1, .1)
				break
			case 3:
				p5.rotate(rnd/100)
				let x2 = 0+rnd + Math.sin(i/10+p5.frameCount/10)*50
				let y2 = lastY+Math.tan(n/10+p5.frameCount/10)*50+rnd+height
				p5.fill(i*100,n*100,255)
				p5.rect(x2,y2, .1, .1)
				break
			case 4:
				p5.rotate(rnd/100)
				let x3 = 0+rnd + Math.tan(i/10+p5.frameCount/10)*Math.sin(n/200+p5.frameCount/10)*50 
				let y3 = lastY+Math.sin(n/10+p5.frameCount/10)*Math.atan(i/100+p5.frameCount/10)*50+rnd+height
				p5.fill(i*100,n*100,255)
				p5.rect(x3,y3, .1, .1)
				break
			case 5:
				p5.rotate(rnd/100)
				let x4 = 0+rnd + Math.tan(i/10+p5.frameCount/10)*50
				let y4 = lastY+Math.tan(n/10+p5.frameCount/10)*50+rnd+height
				p5.fill(i*100,n*100,255)
				p5.rect(x4,y4, .1, .1)
				break
		}

	}
}

export default sketch;

new p5(sketch);
