import p5 from 'p5/lib/p5.min';
import tone from 'tone';

const sketch = (p5) => {
	let num = 300;
	let triggers = [];
	let colors = [];
		
	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.OPENGL);
	}
	let mouseX = p5.mouseX
	let mouseY = p5.mouseY
	p5.draw = () => {
		mouseX = (mouseX*10 + p5.mouseX)/11
		mouseY = (mouseY*10 + p5.mouseY)/11
		p5.background('white')

		p5.push()
		for(let i=0; i<num; i++) {
			p5.strokeWeight(2);
			p5.stroke(55);
			p5.translate(5, 0);
  			p5.line(0, 0, 0, p5.windowHeight);
		}
		p5.pop()
		p5.push()
		let x=0
		for(let i=0; i<num; i++) {
			
			p5.strokeWeight(2);
			p5.stroke(33);
			p5.translate(5, 0);
			x += 5;
			let lastY = 0
			let height = p5.windowHeight / 20

			p5.beginShape();
			p5.fill(0,0,0,Math.abs(Math.sin(p5.frameCount/300)*255))
			p5.curveVertex(0,0)
			for(let n=0; n < 20; n++) {
				let dist = p5.dist(x, lastY, mouseX, mouseY)
				if (dist < 300) {
					dist /= 300
					dist *= dist
					p5.curveVertex(Math.cos(lastY*dist/(Math.sin(p5.frameCount/300)*50) + p5.frameCount*0.05) * (1-dist)*20,lastY+height)
				} else {
					p5.curveVertex(0,lastY+height)
				}
				lastY = lastY+height;
			}
			p5.endShape();
		}
		p5.pop()
	}
}

export default sketch;

new p5(sketch);
