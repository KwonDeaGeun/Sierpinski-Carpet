"use strict";

var gl;
var points;

var NumTimesToSubdivide = 4;

window.onload = function init() {
	var canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	//
	//  Initialize our data for the Sierpinski Carpet
	//

	points = [];
	divideSquare(-1.0, -1.0, 2.0, NumTimesToSubdivide);

	//
	//  Configure WebGL
	//
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//  Load shaders and initialize attribute buffers

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// Load the data into the GPU

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// Associate out shader variables with our data buffer

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	render();
};

function divideSquare(x, y, size, count) {
	if (count === 0) {
		square(x, y, size);
		return;
	}

	var newSize = size / 3.0;

	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < 3; col++) {
			if (row === 1 && col === 1) {
				continue;
			}

			divideSquare(x + col * newSize, y + row * newSize, newSize, count - 1);
		}
	}
}

function square(x, y, size) {
	var a = vec2(x, y);
	var b = vec2(x + size, y);
	var c = vec2(x + size, y + size);
	var d = vec2(x, y + size);

	points.push(a);
	points.push(b);
	points.push(c);

	points.push(a);
	points.push(c);
	points.push(d);
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, points.length);
}
