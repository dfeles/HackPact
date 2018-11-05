import p5 from 'p5/lib/p5.min';
var request = require('request');
import moment from 'moment';

var sortedData = []
const sketch = (p5) => {
	let num = 10;
	let pnts = [[]];
	let ratio = p5.windowWidth/p5.windowHeight
	let formulaSeed = Math.round(Math.random() * 6)

	var ws = new WebSocket('wss://api.bitfinex.com/ws');
	ws.onopen = function() {
	ws.send(JSON.stringify({"event":"subscribe", "channel":"ticker", "pair":"BTCUSD"}));
	};
	ws.onmessage = function(msg) {
		// create a variable for response and parse the json data
		var response = JSON.parse(msg.data);
		// save hb variable from bitfinex
		var hb = response[1];
		console.log(response);
		
		if(hb != "hb") {
			console.log( "ASK: " + response[3] + "<br> LAST: " + response[7] + "<br> BID: " + response[1]);
		}
	};
	
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
		  
	})

	p5.setup = () => {
		let canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);

	}

	const scale = (num, in_min, in_max, out_min, out_max) => {
		return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	p5.draw = () => {
		var values = sortedData.map(function(elt) { return elt.y; });

		var max = Math.max.apply(null, values);
		var min = Math.min.apply(null, values);
		p5.noFill()
		p5.stroke(255)

		p5.translate(-400, 0)
		p5.beginShape()

		for (let i=0; i< sortedData.length; i++) {
			let data = sortedData[i]

			let y = scale(data.y, min, max, 1, 0)

			p5.curveVertex(data.x*1, y*100)

		}
		p5.endShape()

	}
}

export default sketch;

new p5(sketch);
