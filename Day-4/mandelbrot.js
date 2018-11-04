var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var xr = 800;
var yr = 800;
var imgd = context.createImageData(xr, yr);
var pix = imgd.data;

var xmin = -2.0;
var xmax = 1.0;
var ymin = -1.5;
var ymax = 1.5;

// these are for coloring the image


window.setInterval(function(){
    mandelMe()
  }, 1);

iter = 16

var rnds = []
for (var ky = 0; ky < yr; ky++) {
    rnds[ky] = []
    for (var kx = 0; kx < xr; kx++) {
        rnds[ky][kx] = Math.random()
    }
}
var mr0 = 0;
var mg0 = 0;
var mb0 = 0;

while (mr0 == mg0 || mr0 == mb0 || mg0 == mb0) {

    mr0 = Math.pow(2, Math.ceil(.1 * 3 + 3));
    mg0 = Math.pow(2, Math.ceil(.5 * 3 + 3));
    mb0 = Math.pow(2, Math.ceil(.9 * 3 + 3));
    
}
var mr1 = mr0;
var mg1 = mg0;
var mb1 = mb0;

var maxIt = 16;
var diff = 4
mandelMe = () => {

    if(iter > 1600) {
        diff = -8
    }
    if (iter < -1600) {
        diff = 8
    }
    iter+=diff

    var x = 0.0;
    var y = 0.0;
    var zx = 0.0;
    var zx0 = 0.0;
    var zy = 0.0;
    var zx2 = 0.0;
    var zy2 = 0.0;
    
    for (var ky = 0; ky < yr; ky++) {
        y = ymin + (ymax - ymin) * ky / yr;
        for (var kx = 0; kx < xr; kx++) {
            x = xmin + (xmax - xmin) * kx / xr;
            zx = x;
            zy = y;
            for (var i = 0; i < maxIt; i++) {
                zx2 = iter*i/1000 + zx * zx;
                zy2 = zy * zy;
                if (zx2 + zy2 > 5.5) break;
                zx0 = zx2 - zy2 + x;
                zy = 2.0 * zx * zy + y ;
                zx = zx0
            }
            var p = Math.round((xr * kx + ky) * 4);
            i += rnds[kx][ky]*.1
            pix[p] = i*i*2 +kx*ky*i/10000; // red
            pix[p + 1+8] = i*i*2 +kx*i/50+rnds[kx][ky]*i*2; // green
            pix[p + 2+8] = i*i*2 +ky*i/50 +  rnds[kx][ky]*i*2; // blue
            pix[p + 3] = 255; // alpha
        }
    }
    context.putImageData(imgd, 0,0);
}