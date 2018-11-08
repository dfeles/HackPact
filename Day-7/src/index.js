import p5 from 'p5/lib/p5.min';
var request = require('request');
import moment from 'moment';

import tone from 'tone';

var sortedData = []

var triggeredMex = false
var triggeredFinex = false
var prices = []
var sizes = []
let synths = []
var prices2 = []
let synths2 = []

const sketch = (p5) => {
	let num = 10;
	let pnts = [[]];
	let ratio = p5.windowWidth/p5.windowHeight
	let formulaSeed = Math.round(Math.random() * 6)

	for(let i=0;i<num;i++) {
		synths.push( new tone.MonoSynth({
			"oscillator" : {
				"type" : "sine"
 			},
 			"envelope" : {
 				"attack" : 0.03,
				"decay" : 0.5,
				"sustain"  : 0.1,
				"release"  : 0.4
 			}
		}).toMaster() );
		synths[i].volume.value = -20;


		synths2.push( new tone.MonoSynth({
			"oscillator" : {
				"type" : "sine",
 			},
 			"envelope" : {
				"attack" : 0.03,
			   "decay" : 0.5,
			   "sustain"  : 1.1,
			   "release"  : 0.4
 			}
		}).toMaster() );
		synths2[i].volume.value = -20;
	}

	var ws = new WebSocket('wss://www.bitmex.com/realtime');
	ws.onopen = function() {
	ws.send(JSON.stringify({"op": "subscribe", "args": ["trade:XBTUSD","instrument:XBTUSD"]}));
	};
	ws.onmessage = function(msg) {
		// create a variable for response and parse the json data
		var response = JSON.parse(msg.data);
		// save hb variable from bitfinex
		var hb = response[1];
		if(response.action == 'insert'){
			var data = response.data[0]
			console.log('Mex ', data.price);
			prices.push(data.price)
			sizes.push(data.size)
			triggeredMex = true;
		}
		
	};

	var ws2 = new WebSocket('wss://api.bitfinex.com/ws');
	ws2.onopen = function() {
	ws2.send(JSON.stringify({"event":"subscribe", "channel":"ticker", "pair":"BTCUSD"}));
	};
	ws2.onmessage = function(msg) {
		// create a variable for response and parse the json data
		var response = JSON.parse(msg.data);
		// save hb variable from bitfinex
		var hb = response[1];
		
		if(hb != "hb") {
			prices2.push(response[7]);
			//triggeredFinex = true;
			console.log('Finex ', response[7])
		}
	};


	// window.setInterval(function(){
	// 	prices.push(Math.random()*1+6000);
	// 	sizes.push(Math.random()*10)
	// 	prices2.push(Math.random()*1+6000);

	// 	triggeredFinex = true;
	// 	triggeredMex = true;
	//   }, 100);
	

	
	const url = "https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-01-01&end=2018-10-05"

	request.get(url,
	(error, response, body) => {
		
		var b =  JSON.parse(body)
		var count = 0

		for (let date in b.bpi){
            sortedData.push({
				d: moment(date).format('MMM DD'),
				p: b.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
				x: count, //previous days
				y: b.bpi[date] // numerical price
            });
            count++;
		}
		var values = sortedData.map(function(elt) { return elt.y; });

		// var max = Math.max.apply(null, values);
		// var min = Math.min.apply(null, values);
		// p5.noFill()
		// p5.stroke(255,255,255,.5)

		// p5.beginShape()

		// for (let i=0; i< sortedData.length; i++) {
		// 	let data = sortedData[i]

		// 	let y = scale(data.y, min, max, 1, 0)

		// 	//p5.curveVertex(data.x*1, y*100)

		// }
		// p5.endShape()
		  
	})

	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);

	}

	const scale = (num, in_min, in_max, out_min, out_max) => {
		return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	var freq = Math.round(num/2)
	var freq2 = Math.round(num/2)

	var x = 0
	var length = 0
	p5.draw = () => {
		if(triggeredMex||triggeredFinex) p5.background(33,33,33,3)
		if(triggeredMex) {

			var price = prices[prices.length-1] ? prices[prices.length-1] : 0
			var size = sizes[prices.length-1]/price ? sizes[prices.length-1]/price : 0



			var lastMovement = (prices[prices.length-2]-price)*10
			var movement = (prices[0]-price)*10
			var xx = x+400
			var yy = (price-price2)*10+300

			xx = Math.sin(x/30)*(100- movement)+p5.windowWidth/2
			yy = Math.cos(x/30)*(100- movement)+p5.windowHeight/2


			p5.noStroke()
			if(lastMovement<0) {
				p5.fill(0,150,0)
			} else if (lastMovement == 0) {
				p5.fill(255)
			} else {
				p5.fill(200,0,0)
			}
			
			p5.ellipse(xx, yy, 3, 3)
			
			if(lastMovement<0) {
				p5.fill(0,150,0,10)
			} else if (lastMovement == 0) {
				p5.fill(255,255,255,10)
			} else {
				p5.fill(200,0,0,10)
			}
			p5.ellipse(xx - size/2, yy - size/2, size*10, size*10)
			


			triggeredMex = false
			x+=2

			length = prices.length

			freq += (prices[length-1] > prices[length-2]) ? 1 : (prices[length-1] < prices[length-2]) ? -1 : 0
			freq = freq > 30 ? 30 : freq < -10 ? -10 : freq

			console.log(freq%num, synths[freq2%num])
			synths[Math.abs(freq%num)].triggerAttackRelease(tone.Midi(freq+1 + 55).toFrequency(), "8n");

		}
		if(triggeredFinex) {
			triggeredFinex = false


			var price = prices[prices.length-1] ? prices[prices.length-1] : 0
			var price2 = prices2[prices2.length-1] ? prices2[prices2.length-1] : 0

			p5.noStroke();
			p5.fill(255)

			var movement = (price-price2)*10
			var xx = x+400
			var yy = (price-price2)*10+300

			xx = Math.sin(x/50)*(50+ movement)+p5.windowWidth/2
			yy = Math.cos(x/50)*(50+ movement)+p5.windowHeight/2

			p5.ellipse(xx, yy, 3, 3)
			p5.fill(255,255,255,30)
			p5.ellipse(xx - size/2, yy - size/2, size*10, size*10)
			
			console.log(freq%num, synths2[freq2%num])
			length = prices2.length
			freq2 += (prices2[length-1] > prices2[length-2]) ? 1 : (prices2[length-1] < prices2[length-2]) ? -1 : 0
			synths2[Math.abs(freq2%num)].triggerAttackRelease(tone.Midi(freq2+1+60).toFrequency(), "8n");

		}
	}
}

export default sketch;

new p5(sketch);
