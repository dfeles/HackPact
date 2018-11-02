import p5 from 'p5/lib/p5.min';
import tone from 'tone';

const sketch = (p5) => {
	let num = 1000;
	let triggers = [];
	let colors = [];
		
	p5.setup = () => {
		let canvas = p5.createCanvas(800,800, p5.WEBGL);
		for(let i=0;i<num;i++) {
			triggers.push(false);
			colors.push(i/num*255);
		}
	}

	p5.draw = () => {
		p5.camera(1000, 0, 0, 0, 0, 0, 0, 1, 0);
		p5.background(33);
		p5.push();
		p5.beginShape();
		p5.noStroke();
		for(let i=0; i<num; i++) {
			let tempo = (i + 1) * (p5.frameCount * 0.000005 +(p5.mouseX/1000));
			let x = Math.sin(tempo) * (i+1) * .5
			let y = Math.cos(tempo) * (i+1) * .5
			p5.fill((p5.frameCount+i)/10%255,p5.noise(2,2)*255,p5.mouseY/3);
			p5.stroke(0)
			p5.vertex(100,x,y);
			
		}
		p5.endShape();
		p5.pop();
	}
}

export default sketch;

new p5(sketch);
