﻿Demo = {
	// Variables:
	interval  : 200,
	hideChess : true,
	jsonURL   : undefined,
	playing   : undefined,
	pause     : undefined,
	timeoutID : undefined,
	hight     : 9,
	width     : 9,

	// DOM:
	board     : undefined,
	floatChess: undefined,
	data      : undefined,
	demoText  : undefined,
	btnNext   : undefined,
	btnPlay   : undefined,
	btnPrev   : undefined,
	spanNext  : undefined,
	spanPlay  : undefined,
	spanPrev  : undefined,

	//Demo Runtime Data
	oldBoard : undefined,
	demoPlayed : false,

	// Functions:
	getBox: function getBox(i, j) {
		return Demo.board.find('#box-' + i + '-' + j);
	},

	drawTable: function drawTable() {
		var table = $('<table id="chess-board">');
		for (var i = 0; i < Demo.hight; ++i) {
			var tr = $('<tr id="row-' + i + '">');
			for (var j = 0; j < Demo.width; ++j) {
				var td = $('<td id="box-' + i + '-' + j + '">');
				td.data('row', i);
				td.data('col', j);
				td.board;
				tr.append(td);
			}
			table.append(tr);
		}
		Demo.board.replaceWith(table);
		Demo.board = $('#chess-board');
	},

	putChess: function putChess() {
		for (var i = 0; i < Demo.hight; ++i) {
			for (var j = 0; j < Demo.width; ++j) {
				Demo.getBox(i, j).attr('class', 'img-chess img-blank');
			}
		}
		Demo.getBox(0, 4).attr('class', 'img-chess img-red');
		Demo.getBox(8, 4).attr('class', 'img-chess img-blue');
	},

	// getImg : function getImg(chess) {
	// 	if (chess[0] ===  0) {
	// 		return '';
	// 	}
	// 	if (chess[1] === true && Demo.hideChess === true) {
	// 		return 'img-chess img-blank';
	// 	} else {
	// 		if (chess[0] === -7) {return 'img-chess img-blue';}
	// 		if (chess[0] === -6) {return 'img-chess img-blue';}
	// 		if (chess[0] === -5) {return 'img-chess img-blue';}
	// 		if (chess[0] === -4) {return 'img-chess img-blue';}
	// 		if (chess[0] === -3) {return 'img-chess img-blue';}
	// 		if (chess[0] === -2) {return 'img-chess img-blue';}
	// 		if (chess[0] === -1) {return 'img-chess img-blue';}
	// 		if (chess[0] ===  7) {return 'img-chess img-red';}
	// 		if (chess[0] ===  6) {return 'img-chess img-red';}
	// 		if (chess[0] ===  5) {return 'img-chess img-red';}
	// 		if (chess[0] ===  4) {return 'img-chess img-red';}
	// 		if (chess[0] ===  3) {return 'img-chess img-red';}
	// 		if (chess[0] ===  2) {return 'img-chess img-red';}
	// 		if (chess[0] ===  1) {return 'img-chess img-red';}
	// 	}
	// },

	flushBoard : function flushBoard() {
		for (var i = 0; i < Demo.hight; ++i) {
			for (var j = 0; j < Demo.width; ++j) {
				Demo.getBox(i, j).attr('class', 'img-chess img-blank');
			}
		}
		Demo.getBox(oldPos[Demo.playing][0], oldPos[Demo.playing][1]).attr('class', 'img-chess img-red');
		Demo.getBox(oldPos[Demo.playing][2], oldPos[Demo.playing][3]).attr('class', 'img-chess img-blue');
		for (var i = 0; i < Demo.hight - 1; ++i) {
			for (var j = 0; j < Demo.width - 1; ++j) {
				if (oldBoard[Demo.playing][i * 2][j]) {
					Demo.getBox(i, j).addClass('right-line')
				}
				if (oldBoard[Demo.playing][i * 2 + 1][j]){
					Demo.getBox(i, j).addClass('bottom-line')
				}
			}
		}
	},

	setupInvalidList: function setupInvalidList() {
		var ul = $('#invalid-list');
		if (Demo.data.err[0])
			ul.append('<li class="list-group-item"><strong>AI0 Err:</strong> ' + Demo.data.err[0] + '</li>');
		if (Demo.data.err[1])
			ul.append('<li class="list-group-item"><strong>AI1 Err:</strong> ' + Demo.data.err[1] + '</li>');
		for (var i = 0; i < Demo.data.step.length; ++i) {
		    var step = Demo.data.step[i];
		    if ('err' in step) {
		        var info = step.err || 'Invalid Operation! (No Details)';
		        ul.append('<li class="list-group-item"><strong>[Step ' + (i+1) + '] AI' + (i%2) + '</strong> ' + info + '</li>');
		    }
		}
	},

	getData: function getData() {
		$.getJSON(Demo.jsonURL, function(dt) {
			Demo.data = dt;
			Demo.prepare();
			Demo.setupInvalidList();
			Demo.btnPlay.prop('disabled', false);
			Demo.spanPlay.html('');
			// Demo.playing = dt.step.length - 1;
			Demo.playing = 0;
			Demo.isPause = true;
			Demo.spanPlay.attr('class', 'glyphicon glyphicon-play');
			Demo.setControls();
		});
	},

	setControls: function setControls() {
		var i = Demo.playing;
		var step = Demo.data.step;
		if (Demo.isPause) {
			if (i === 0 && i < step.length - 1) {
				Demo.btnPrev.prop('disabled', true);
				Demo.btnNext.prop('disabled', false);
			} else if (0 < i && i === step.length) {
				Demo.btnPrev.prop('disabled', false);
				Demo.btnNext.prop('disabled', true);
			} else {
				Demo.btnPrev.prop('disabled', false);
				Demo.btnNext.prop('disabled', false);
			}
		} else {
			Demo.btnPrev.prop('disabled', true);
			Demo.btnNext.prop('disabled', true);
		}
		Demo.btnPlay.prop('disabled', false);
	},

	updateText: function updateText() {
		var i = Demo.playing;
		var step = Demo.data.step[i];

		if (i % 2 === 0) {
			Demo.demoText.attr('class', 'bg-red');
		} else {
			Demo.demoText.attr('class', 'bg-black');
		}

		if (Demo.playing === -1) {
			Demo.demoText.html('<strong>initial chessboard</strong>');
		}

		if ('err' in step) {
			Demo.demoText.html('<strong>[Step ' + (i+1) + '] AI' + (i % 2) + '</strong> Error: ' + step.err);
			Demo.demoText.attr('class', 'bg-warning');
		} else if (step.kind == 'wall') {
			Demo.demoText.html('<strong>[Step ' + (i+1) + '] AI' + (i % 2) + '</strong> Walled (' + step.x + ',' + step.y + ')');
		} else {
			Demo.demoText.html('<strong>[Step ' + (i+1) + '] AI' + (i % 2) + '</strong> Moved to (' + step.x + ',' + step.y + ')');
		}
	},

	cloneObject : function cloneObject(objectToBeCloned) {
		// Basis.
		if (!(objectToBeCloned instanceof Object)) {
			return objectToBeCloned;
		}

		var objectClone;

		var Constructor = objectToBeCloned.constructor;
		switch (Constructor) {
			case RegExp:
				objectClone = new Constructor(objectToBeCloned);
				break;
			case Date:
				objectClone = new Constructor(objectToBeCloned.getTime());
				break;
			default:
				objectClone = new Constructor();
		}

		for (var prop in objectToBeCloned) {
			objectClone[prop] = Demo.cloneObject(objectToBeCloned[prop]);
		}
		return objectClone;
	},

	prepare : function prepare() {
		var curBoard = [];
		for (var i = 0; i < 17; i++) curBoard.push([]);
		var curPos = [];8
		for (var i = 0; i < 17; i++)
			for (var j = 0; j < 7; j++)
				curBoard[i].push(false);
		curPos = [0, 4, 8, 4];
		
		oldBoard = [];
		oldPos = [];
		oldBoard.push(Demo.cloneObject(curBoard));
		oldPos.push(Demo.cloneObject(curPos));
		for (var i = 0; i < Demo.data.step.length; ++i) {
			if (!('err' in Demo.data.step[i])) {
				var kind = Demo.data.step[i].kind;
				var x = Demo.data.step[i].x;
				var y = Demo.data.step[i].y;
				if (kind == 'wall') {
					if (x % 2 == 0) {
						curBoard[x][y] = true;
						curBoard[x + 2][y] = true;
					}
					else {
						curBoard[x][y] = true;
						curBoard[x][y + 1] = true;
					}
				} else if(kind == 'red') {
					curPos[0] = x;
					curPos[1] = y;
				} else {
					curPos[2] = x;
					curPos[3] = y;
				}
			}
			oldBoard.push(Demo.cloneObject(curBoard));
			oldPos.push(Demo.cloneObject(curPos));
		}

		function set_ai_color_span(id, jdom) {
			if (id == 0) jdom.attr('class', 'label label-danger').html('红');
			else jdom.attr('class', 'label bg-black').html('蓝');
		}
		set_ai_color_span(Demo.data.id[0], $('#span-ai0-color'));
		set_ai_color_span(Demo.data.id[1], $('#span-ai1-color'));
	},

	moveChess: function moveChess(kind, x, y) {
		if (kind == 'wall') {
			var xx = parseInt(x / 2);
			if (x % 2 == 0) {
				Demo.getBox(xx, y).addClass('right-line');
				Demo.getBox(xx + 1, y).addClass('right-line');
			}
			else {
				Demo.getBox(xx, y).addClass('bottom-line');
				Demo.getBox(xx, y + 1).addClass('bottom-line');
			}
			Demo.setControls();
			if (!Demo.isPause) {
				++Demo.playing;
				Demo.timeoutID = setTimeout(Demo.draw, Demo.interval * 3);
			}
		} else {
			if (kind == 'red') {
				var sx = oldPos[Demo.playing][0];
				var sy = oldPos[Demo.playing][1];
				var img = 'img-chess img-red';
			}
			else {
				var sx = oldPos[Demo.playing][2];
				var sy = oldPos[Demo.playing][3];
				var img = 'img-chess img-blue';
			}
			var source = Demo.getBox(sx, sy);
			var target = Demo.getBox(x, y);
			Demo.floatChess.attr('class', img);
			Demo.floatChess.offset(source.offset());

			source.attr('class', 'img-chess img-blank');
			if (sy < 8 && oldBoard[Demo.playing][sx * 2][sy]) source.addClass('right-line');
			if (sx < 8 && oldBoard[Demo.playing][sx * 2 + 1][sy]) source.addClass('bottom-line');

			Demo.floatChess.animate(target.offset(), Demo.interval, function() {
				target.attr('class', Demo.floatChess.attr('class'));
				if (y < 8 && oldBoard[Demo.playing][x * 2][y]) target.addClass('right-line');
				if (x < 8 && oldBoard[Demo.playing][x * 2 + 1][y]) target.addClass('bottom-line');
				Demo.floatChess.addClass('hidden');
				Demo.setControls();
				if (!Demo.isPause) {
					++Demo.playing;
					Demo.timeoutID = setTimeout(Demo.draw, Demo.interval);
				}
			});
		}
	},

	draw: function draw() {
		var i = Demo.playing;
		var step = Demo.data.step[i];

		if (i === Demo.data.step.length) {
			Demo.isPause = true;
			Demo.spanPlay.attr('class', 'glyphicon glyphicon-play');
			return;
		}

		Demo.updateText();

		Demo.moveChess(step.kind, step.x, step.y);
	},

	drawNext: function drawNext() {

		var i = Demo.playing;
		var step = Demo.data.step[i];

		if (i === Demo.data.step.length) {
			Demo.isPause = true;
			Demo.spanPlay.attr('class', 'glyphicon glyphicon-play');
			return;
		}

		Demo.moveChess(step.kind, step.x, step.y);
		Demo.updateText();
		++Demo.playing;

	},

	playDemo: function playDemo() {
		Demo.drawTable();
		Demo.putChess();

		Demo.playing = 0;
		Demo.timeoutID = setTimeout(Demo.draw, Demo.interval);
	},

	drawPrev: function drawPrev() {
		Demo.drawTable();
		Demo.putChess();

		Demo.flushBoard();

		Demo.setControls();
		Demo.updateText();
	},

	prevClick: function prevClick(e) {
		e.preventDefault();
		Demo.demoPlayed = true;
		if (Demo.playing > 0) {
			Demo.btnNext.prop('disabled', true);
			Demo.btnPlay.prop('disabled', true);
			Demo.btnPrev.prop('disabled', true);
			setTimeout(Demo.drawPrev, 0);
			--Demo.playing;
		}
		$(this).blur();
		return false;
	},

	playClick: function playClick(e) {
		e.preventDefault();
		Demo.demoPlayed = true;
		if (Demo.isPause) {
			Demo.isPause = false;
			// ++Demo.playing;
			Demo.spanPlay.attr('class', 'glyphicon glyphicon-pause');
			Demo.btnPrev.attr('disabled', true);
			Demo.btnNext.attr('disabled', true);
			if (Demo.playing >= Demo.data.step.length) {
				Demo.playDemo();
			} else {
				Demo.timeoutID = setTimeout(Demo.draw, Demo.interval);
			}
		} else {
			clearTimeout(Demo.timeoutID);
			--Demo.playing;
			Demo.isPause = true;
			Demo.spanPlay.attr('class', 'glyphicon glyphicon-play');
			Demo.setControls();
		}
		$(this).blur();
		return false;
	},

	nextClick: function nextClick(e) {
		e.preventDefault();
		Demo.demoPlayed = true;
		if (Demo.playing < Demo.data.step.length) {
			Demo.btnNext.prop('disabled', true);
			Demo.btnPlay.prop('disabled', true);
			Demo.btnPrev.prop('disabled', true);
			Demo.drawNext();
		}
		$(this).blur();
		return false;
	},

	bindEvents: function bindEvents() {
		Demo.btnPrev.on('click', Demo.prevClick);
		Demo.btnPlay.on('click', Demo.playClick);
		Demo.btnNext.on('click', Demo.nextClick);

		$("#btn-speed-slow")  .on('click', function(){Demo.interval=500});
		$("#btn-speed-normal").on('click', function(){Demo.interval=200});
		$("#btn-speed-fast")  .on('click', function(){Demo.interval= 50});

		// $("#btn-chess-show").on('click', function(){
		// 	Demo.hideChess = false;
		// 	if (Demo.demoPlayed === false) {
		// 		Demo.playing = 0;
		// 		Demo.flushBoard();
		// 		Demo.playing = Demo.data.step.length - 1;
		// 	} else {
		// 		Demo.flushBoard();
		// 	}
		// });
		// $("#btn-chess-hide").on('click', function(){
		// 	Demo.hideChess =  true;
		// 	if (Demo.demoPlayed === false) {
		// 		console.log("~~~");
		// 		Demo.putChess();
		// 	} else {
		// 		Demo.flushBoard();
		// 	}
		// });
	},

	setup: function setup(jsonURL) {
		Demo.jsonURL = jsonURL;

		Demo.board      = $('#chess-board');
		Demo.floatChess = $('#float-chess');

		Demo.board      = $('#chess-board');
		Demo.floatChess = $('#float-chess');
		Demo.demoText   = $("#demo-text");
		Demo.btnPrev    = $('#btn-prev');
		Demo.btnPlay    = $("#btn-play");
		Demo.btnNext    = $('#btn-next');
		Demo.spanPrev   = $('#span-prev');
		Demo.spanPlay   = $('#span-play');
		Demo.spanNext   = $('#span-next');


		Demo.drawTable();
		Demo.putChess();
		Demo.getData();
		Demo.bindEvents();
	}

}
