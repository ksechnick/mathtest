function fminsearch(fun, Parm0, x, y, Opt) { // fun = function(x,Parm)
	// example
	//
	// x = [32,37,42,47,52,57,62,67,72,77,82,87,92];
	// y=[749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992]
	// fun = function(x,P){return x.map(function(xi){return (P[0]+1/(1/(P[1]*(xi-P[2]))+1/P[3]))})}
	// Parms=jmat.fminsearch(fun,[100,30,10,5000],x,y)
	//
	// Another test for the same function:
	// x=[32,37,42,47,52,57,62,67,72,77,82,87,92];y=[0,34,59,77,99,114,121,133,146,159,165,173,170];
	//
	// Opt is an object will all other parameters, from the objective function (cost function), to the 
	// number of iterations, initial step vector and the display switch, for example
	// Parms=fminsearch(fun,[100,30,10,5000],x,y,{maxIter:10000,display:false})

	if (!Opt) {
		Opt = {}
	};
	if (!Opt.maxIter) {
		Opt.maxIter = 1000
	};
	if (!Opt.step) { // initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step = Parm0.map(function (p) {
			return p / 100
		});
		Opt.step = Opt.step.map(function (si) {
			if (si == 0) {
				return 1
			} else {
				return si
			}
		}); // convert null steps into 1's
	};
	if (typeof (Opt.display) == 'undefined') {
		Opt.display = 'console'
	};
	if (!Opt.objFun) {
		Opt.objFun = function (y, yp) {
			console.log('new sum');
			return y.map(function (yi, i) {
				let a = Math.pow((yi - yp[i]), 2);
				console.log(a);
				return a
			}).reduce(function (a, b) {
				return a + b
			})
		}
	} // SSD default objective function being minimized
	let regModel = {}
	var ya, y0, yb, fP0, fP1;
	var P0 = [...Parm0],
		P1 = [...Parm0]; // clone parameter array to decouple passing by reference
	var n = P0.length;
	var step = Opt.step;

	function funEval(P) {
		return Opt.objFun(y, fun(x, P))
	} //function evaluation for curent Parameter values to determine value of objective function, passed as a Opt parameter (Opt.objFun)
	// silly multi-univariate walk
	// assemble regresssion Model
	regModel = {
		Opt: Opt,
		x: x,
		y: y,
		parmi: P0, // initial parameter values
		fun: fun
	}
	for (var i = 0; i < Opt.maxIter; i++) {
		for (var j = 0; j < n; j++) { // take a step for each parameter
			P1 = [...P0];
			P1[j] += step[j];
			let a = funEval(P1);
			console.log(a)
			let b = funEval(P0);
			console.log(b)
			if (a < b) { // if parm value going in the righ direction
				step[j] = 1.2 * step[j]; // then go a little faster
				P0 = [...P1];
			} else {
				step[j] = -(0.5 * step[j]); // otherwiese reverse and go slower
			}
		}
		if (Opt.display == 'console') {
			if (i == 0) {
				console.log('  i  ', '  ObjFun ', '  Parms ')
			}
			console.log(i + 1, b, P0)

			if ((i > 10000) && (a == b)) {
				break
			}
		}

		//{if(i>(Opt.maxIter-10)){console.log(i+1,funEval(P0),P0)}}
	}
	regModel.parmf = P0 // final parameter values
	return regModel
};

function fminsearch2(fun, Parm0, points, Opt) { // fun = function(x,Parm)
	function debug(x) {
		if (Opt.loglevel == 'debug') {
			console.log(x);
		}
	}

	// example
	//
	// x = [32,37,42,47,52,57,62,67,72,77,82,87,92];
	// y=[749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992]
	// fun = function(x,P){return x.map(function(xi){return (P[0]+1/(1/(P[1]*(xi-P[2]))+1/P[3]))})}
	// Parms=jmat.fminsearch(fun,[100,30,10,5000],x,y)
	//
	// Another test for the same function:
	// x=[32,37,42,47,52,57,62,67,72,77,82,87,92];y=[0,34,59,77,99,114,121,133,146,159,165,173,170];
	//
	// Opt is an object will all other parameters, from the objective function (cost function), to the 
	// number of iterations, initial step vector and the display switch, for example
	// Parms=fminsearch(fun,[100,30,10,5000],x,y,{maxIter:10000,display:false})

	if (!Opt) {
		Opt = {}
	};
	if (!Opt.maxIter) {
		Opt.maxIter = 1000
	};
	if (!Opt.step) { // initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step = Parm0.map(function (p) {
			return p / 100
		});
		Opt.step = Opt.step.map(function (si) {
			if (si == 0) {
				return 1
			} else {
				return si
			}
		}); // convert null steps into 1's
	};
	if (typeof (Opt.display) == 'undefined') {
		Opt.display = 'console'
	};
	if (typeof (Opt.loglevel) == 'undefined') {
		Opt.loglevel = 'normal'
	};
	//if(!Opt.objFun){Opt.objFun=function(y,yp){return y.map(function(yi,i){return Math.pow((yi-yp[i]),2)}).reduce(function(a,b){return a+b})}} // SSD default objective function being minimized
	if (!Opt.objFun) {
		Opt.objFun = function (result) {
			debug('new sum');
			return result.map((z) => {
				debug(z);
				return Math.abs(z[2])
			}).reduce(function (a, b) {
				return a + b
			})
		}
	};
	let regModel = {}
	var ya, y0, yb, fP0, fP1;
	var P0 = [...Parm0],
		P1 = [...Parm0]; // clone parameter array to decouple passing by reference
	var n = P0.length;
	var step = Opt.step;

	function funEval(P) {
		return Opt.objFun(fun(points, P))
	} //function evaluation for curent Parameter values to determine value of objective function, passed as a Opt parameter (Opt.objFun)
	// silly multi-univariate walk
	// assemble regresssion Model
	regModel = {
		Opt: Opt,
		points: points,
		parmi: P0, // initial parameter values
		fun: fun
	}
	for (var i = 0; i < Opt.maxIter; i++) {
		for (var j = 0; j < n; j++) { // take a step for each parameter
			P1 = [...P0];
			P1[j] += step[j];
			let a = funEval(P1);
			debug(a + ": " + P1);
			let b = funEval(P0);
			debug(b + ": " + P0);
			if (a < b) { // if parm value going in the righ direction
				step[j] = 1.2 * step[j]; // then go a little faster
				P0 = [...P1];
			} else {
				step[j] = -(0.5 * step[j]); // otherwiese reverse and go slower
			}
		}
		if (Opt.display == 'console') {
			if (i == 0) {
				console.log('  i  ', '  ObjFun ', '  Parms ', ' Steps')
			}
			console.log(i + 1, funEval(P0), P0, step)

			if ((i > Opt.maxIter) && (funEval(P1) == funEval(P0))) {
				break
			}
		}

		//{if(i>(Opt.maxIter-10)){console.log(i+1,funEval(P0),P0)}}
	}
	regModel.parmf = P0 // final parameter values
	return regModel
};

let x = [1, 2, 3, 4];
let y = [1, 2, 2, 1];
const combine = function (x, y) {
	z = [];
	for (let i = 0; i < x.length; i++) {
		z[i] = [x[i], y[i]]
	};
	return z
}
let points = combine(x, y);
//let x = [32,37,42,47,52,57,62,67,72,77,82,87,92];
//let y=[749,1525,1947,2201,2380,2537,2671,2758,2803,2943,3007,2979,2992];
//x=[32,37,42,47,52,57,62,67,72,77,82,87,92];
//y=[0,34,59,77,99,114,121,133,146,159,165,173,170]
//let fun = function(x,P){return x.map(function(xi){return (P[0]+1/(1/(P[1]*(xi-P[2]))+1/P[3]))})};
let fun = function (x, P) {
	return x.map(function (xi) {
		return (P[1] + Math.sqrt(Math.pow(P[2], 2) - Math.pow((xi - P[0]), 2)))
	})
};
let fun2 = function (points, P) {
	return points.map(function (p) {
		return [p[0], p[1], ((p[0] - P[0]) ** 2 + (p[1] - P[1]) ** 2 - P[2] ** 2)]
	})
};
//let Parms=fminsearch(fun,[1,1,5],x,y, {maxIter:600});
//let Parms2=fminsearch2(fun2,[1,1,5],z, {maxIter:600});
x = [2, 2, 2, 2, 2];
y = [1, 2, 3, 4, 100];
vline = combine(x, y);
//let Parms3=fminsearch2(fun2,[1,1,5],vline, {maxIter:100});
x = [1, 2, 3, 4, 33, 66, 90, 100];
y = [2, 2, 2, 2, 2, 2, 2, 2];
hline = combine(x, y);
let Parms4 = fminsearch2(fun2, [50, 50, 49], hline, {
	maxIter: 100,
	loglevel: "norm"
});
//console.log(Parms);
console.log(Parms4);
//
export {
	combine,
	fminsearch2
}