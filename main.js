
'use_strict'
/*
	Main class
*/
class App {
	constructor() {
		this.canvas = null;
		this.ant = null;	//actual bot instant which moves around grid
		this.moveNum = 0;	//movement # for logging purposes
		//controls wheter to start or stop ant movement
		this.started = false;
		// default app config
		this.config = {
			FPS: 1,			//frames per second
			debug: 0,		//prints aditional info to page console
			logAll: 0,		//print all messages to page console
			canvasW: null,	//canvas width
			canvasH: null	//canvas height
		}
		/* 
			Local reference to this object's instance
			Used in createGrid function
			Needed due to the way "this" works in javascript
		*/
		var _app = this;
		//contains grid functions and properties
		this.grid = {
			// default grid config
			theme: 0,		//default theme
			cellSize: 15,	//size in pixels
			cellMargin: 2,	//margin between cells in pixels
			width: 41,		//grid width measure in "cells"/squares (41 cells default)
			height: 41,		//grid height in cells (41 cells default)
			cells: [],		//array of cells
			// color themes
			themes: [
				/* 
					cell colors used to fill color in cells
					these colors are accessed using the array index, i.e colors[0] = black
					this makes it easy to change the cell color state by incrementing 
					the index
				*/
				//default theme
				[
					'#000000', // black
					'#FF0000', // red
					'#FFFF00', // yellow
					'#0080FF', // blue
					'#00FF00' // green
				],
				//dark theme
				[
					'#000000', // black
					'#800000', // red
					'#808000', // yellow
					'#004080', // blue
					'#008000' // green
				],
				//green theme
				[
					'#212922', // black
					'#AEF6C7', // red
					'#3E6259', // yellow
					'#294936', // blue AEF6C7
					'#5B8266' // green
				],
				//neon theme
				[
					'#6600FF', // black
					'#FF000D', // red
					'#CCFF00', // yellow
					'#0FF0FC', // blue
					'#21FC0D' // green
				],
				//Soft Beach theme
				[
					'#000000', // black
					'#9df9ef', // red
					'#edf756', // yellow
					'#ffa8B6', // blue
					'#a28089' // green
				],
				//  Puple
				[
					'#000000', // black
					'#2a3d66', // red
					'#5d54a4', // yellow
					'#9d65c9', // blue
					'#d789d7' // green
				],
				//Dual
				[
					'#000000', // black
					'#222831', // red
					'#393e46', // yellow
					'#00adb5', // blue
					'#eeeeee' // green
				],
			],
			//One to one map of color values to redable names for logging purposes (only for default theme)
			colorNames: [
				'BLACK',
				'RED',
				'YELLOW',
				'BLUE',
				'GREEN'
			],
			//calculated at grid creation time (cellMargin + cellSize)
			cellSpacing: null,
			/*
				Get readable color name based on array index
				@param int cellState - the current cell state (0 to 4)
			*/
			getCellColorName(cellState) {
				return this.colorNames[cellState];
			},
			/*
				Get cell
				@param oject position - the (x, y) coorditates of the cell. I.e (x:0, y:0) is the first cell
			*/
			getCell(position) {
				//map (x,y) coordinates to 1-D array index
				const cellID = position.y + (this.height * position.x)
				return this.cells[cellID];
			},
			// create grid (i.e 41 x 41 grid)
			createGrid() {
				// set cell color (black by default)
				noStroke();
				fill(this.themes[0][0]);
				let cellID = 0;
				//clean up array in case user changed grid size
				this.cells = [];
				for (let row = 0; row < _app.config.canvasW; row += this.cellSpacing) {
					for (let col = 0; col < _app.config.canvasH; col += this.cellSpacing) {
						// add cell to our array
						this.cells[cellID] = {
							x: row,
							y: col,
							state: 0,
							changed: false //flag to know if the cell state has changed - only used for animation purposes
						}
						// draw cell
						square(row, col, this.cellSize);
						cellID++;
					}
				}
				_app.log('Creating ' + this.width + ' x ' + this.height + ' grid...');
			},
			/*
				Draw specific cell in (x,y) position, i.e x:0, y:0 is the first cell
				@param oject position - the (x, y) coorditates of the cell. I.e (x:0, y:0) is the first cell
			*/
			drawCell: function(position) {
				//map (x,y) coordinates to 1-D array index
				const cellID = position.y + (this.height * position.x);
				//get cell in position given
				const cell = this.cells[cellID];
				cell.changed = true;
				// set cell color based on cell state
				noStroke();
				fill(this.themes[this.theme][cell.state]);
				// draw cell
				square(cell.x, cell.y, this.cellSize);
			}
		}
		//get DOM elem container counter number
		this.moveCounterContainer = document.getElementById('counter');
	}
	//setup canvas
	setupCanvas() {
		this.grid.cellSpacing = this.grid.cellSize + this.grid.cellMargin;
		this.config.canvasW = this.grid.width * this.grid.cellSpacing;
		this.config.canvasH = this.grid.height * this.grid.cellSpacing;
		// draw our canvas
		this.canvas = createCanvas(this.config.canvasW, this.config.canvasH);
	}
	/*
		Print messages to page "console"
		@param string msg - the message to print
	*/
	log(msg, debug) {

		if (typeof debug !== 'undefined' && !debug) {
			return;
		}

		// clear console messages after 50 messages if logAll is false
		if (!this.config.logAll && consoleContainer.childElementCount > 50) {
			consoleContainer.innerHTML = '';
		}
		// create span elem to contain msg
		var elem = document.createElement('span');
		elem.setAttribute('class', 'loggerLine');
		elem.textContent = msg;
		// attach span elem containing msg to console elem
		consoleContainer.appendChild(elem);
		// automatically scroll to bottom of container
		consoleContainer.scrollTop = (consoleContainer.scrollHeight - consoleContainer.clientHeight);
	}

	debug(msg) {
		this.log(msg, this.config.debug);
	}

	// updates the moves counter displayed on page
	updateCounter() {
		this.moveCounterContainer.textContent = 'Movement #: ' + (this.moveNum++);
	}
	//reset app to current settings, used after setting new user-define settings
	resetApp() {
		this.moveNum = 0;
		clear();
		createCanvas(this.config.canvasW, this.config.canvasH);
		//re-create grid
		this.grid.createGrid();
		//reset bot/ant to initial conditions & state
		this.ant.reset();
		this.log('Ant #x15 resetted...');
	}
	/*
		set new cell size
		@ param int cellSize - the new cell size in pixels
	*/
	setCellSize(cellSize) {
		this.grid.cellSize = parseInt(cellSize);
		this.grid.cellSpacing = (this.grid.cellSize + this.grid.cellMargin);
		this.config.canvasW = this.grid.width * this.grid.cellSpacing;
		this.config.canvasH = this.grid.height * this.grid.cellSpacing;
		this.log('New cell size set: ' + this.grid.cellSize + ' pixels');
		this.resetApp();
	}
	/*
		set new grid size
		@ param array newGridSize - the new grid size (width, height) in cells (i.e 41 x 41 cells)
	*/
	setGridSize(newGridSize) {
		this.grid.width = parseInt(newGridSize[0]);
		this.grid.height = parseInt(newGridSize[1]);

		this.config.canvasW = newGridSize[0] * this.grid.cellSpacing;
		this.config.canvasH = newGridSize[1] * this.grid.cellSpacing;

		this.log('New grid size set: (' + newGridSize[0] + ' x ' + newGridSize[1] + ' cells)');
		this.resetApp();
	}
	/*
		set new "Ant" number
		@ param int num - the new ant number in hex
	*/
	setAntNumber(num) {
		// convert hex to array containing each bit
		// 0x0 => [0,0,0,0,0] and set as new Ant Number
		this.ant.number = Array.from(num.toString(2).padStart(5, '0')).map(function(item) {
			return parseInt(item, 10);
		})
		// log for information purposes
		this.log('New Ant number set: 0x' + num.toString(16).toUpperCase() +
			' | Transitions: ' + Array.from(num.toString(2).padStart(5, '0')).map(function(state) {
				if (state === '0') return 'R'
				else return 'L'
			})
		);
	}
	/*
		set new theme
		@ param int theme - the index of the array containing the theme colors
	*/
	setTheme(theme) {
		this.grid.theme = theme;
		noLoop();
		//re-draw all cells to new theme color
		for (let index in this.grid.cells) {
			let cell = this.grid.cells[index];
			//we don't want to re-draw cells that haven't been modified by the bot
			if (cell.changed) {
				noStroke();
				fill(this.grid.themes[this.grid.theme][cell.state]);
				// draw cell
				square(cell.x, cell.y, this.grid.cellSize);
			}
		}
		//update color palette on page showing theme colors
		const themeContainer = document.getElementsByClassName('themeColor');
		for (let i = 0; i < themeContainer.length; i++) {
			themeContainer[i].style.backgroundColor = this.grid.themes[theme][i];
		}
		loop();
	}

	setDebug(debug) {
		this.config.debug = debug;
	}
	setLogAll(logAll) {
		this.config.logAll = logAll;
	}
}

/*
	Bot "class"
	@param int x - the x coordate of the bot in terms of cells
	@param int y - the x coordate of the bot in terms of cells
	I.e x: 0, y:0 means bot will be drawn on the first cell
*/
function Bot(x, y) {
	// bot state (0 or 1)
	this.state = 0;
	// Ant Number - default number is 0x15 (Hex)
	this.number = [1, 0, 1, 0, 1];
	this.direction = 0; // facing UP | pointing north
	// save current and previous bot position for easily updating cells
	this.currPosition = {
		x: x,
		y: y
	}
	this.prevPosition = {
		x: x,
		y: y
	}
	//1 to 1 map for translating cell direction to readable names for logging purposes
	this.directionToNameMap = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
	/*
		botSize: for drawing/animation purposes, we want the bot to be drawn _inside_ the cell
				 we don't want to overlap with the edges of the cells, hence we "resize" the legth of each
				 line drawn in the triangle shape we use to be 80% of the cell size
				 i.e if cellSize = 20, bot size is 16 (each line wll be 16 pixels long)
	*/
	this.trigangleLine1 = app.grid.cellSize - 4;
	this.trigangleLine2 = (app.grid.cellSize / 2.0) - 2;
	/*
		We use a trigangle shape for the bot animation (ant)
		p5 uses 2 coordinates (x,y) per triangle point
		Hence the first 2 numbers in the arrays below represent 1 triangle point
		We need 3 points for a triangle, so 6 numbers total
		triangle(x1, y1, x2, y2, x3, y3)

		The order is important here, we are "rotating" +90 degrees to change
		from pointing up to pointing right.
		To rotate +90 degrees, we increate the array index by 1.
		To rotate -90 degrees (point left) we decrease array index by -1 (wrapping around array)
	*/
	this.drawingPoints = [
		// pointing up
		[0, this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine2 , 0],
		// pointing right
		[0, 0, 0, this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine2],
		// pointing down
		[0, 0, this.trigangleLine1 , 0, this.trigangleLine2, this.trigangleLine1 ],
		// pointing left
		[this.trigangleLine1 , 0, this.trigangleLine1 , this.trigangleLine1 , 0, this.trigangleLine2]
	];

	// helper function to log data in web app
	this.printState = function() {
		let pointing = this.directionToNameMap[this.direction];
		let currCell = app.grid.getCell(this.currPosition);
		let onColor = app.grid.getCellColorName(currCell.state);
		app.log("Ant is at location:  x: " + this.currPosition.x + " y: " + this.currPosition.y);
		app.log('Current Ant status: heading ' + pointing + ' | on cell color ' + onColor);
	}

	/*
	Bot initializer function
	Updates bot facing/pointing direction based on current cell state
	Sets new state for next loop iteration after drawing current state
	*/
	this.init = function() {
		if (app.config.debug) {
			app.log('===== Movement #' + app.moveNum + '=====')
			// print state if debug is on
			this.printState();
		}
		// draw current bot state
		this.draw()
		/*
		Bot has 2 updating states
		State 0: updates bot pointing direction & the cell it is on based on current bot status
		State 1: moves bot to the cell it is pointing to & redraws the previous cell to it's current color
		this is done so the animation is very smooth and clear between cell changes and bot changes
		*/
		switch (this.state) {
			case 0:
				// change state, does not move the bot, only updates pointing direction and cell color
				this.changeState();
				break
			case 1:
				// actually move the bot to pointing direction and redraw previous cell
				// redraw previous cell so that only the current bot state shows in animation
				this.move();
				break
			default:
				//shouldn't happen tho
				app.log('Error: Ant is in unknown state')
				noLoop();
				return false
		}
	}

	// Change bot state
	this.changeState = function() {

		app.debug("Changing state");

		//get the cell the bot is currently on (sitting on top of)
		let currCell = app.grid.getCell(this.currPosition);
		//get transition based on cell color (left or right)
		var transition = this.number[currCell.state];

		app.debug("Changing from heading " + this.directionToNameMap[this.direction]);

		switch (transition) {
			// move right on ant binary number 0 (+90 degrees)
			case 0:
				this.direction = (this.direction + 1) % 4;
				break
			// move left on ant binary number 1 (wraps drawingPoints array) - (-90 degrees)
			case 1:
				this.direction = this.direction === 0 ? 3 : (this.direction - 1) % 3;
				break
			default:
				//shouldn't happen tho
				app.log('Unknown transition state...');
				noLoop();
				return false
		}

		app.debug("To heading " + this.directionToNameMap[this.direction])
		app.debug("Changing cell color from: " + app.grid.getCellColorName(currCell.state))
		// update current cell color to the next color in the list
		currCell.changed = true;
		currCell.state = (++currCell.state % 5);
		// update bot status
		this.state = (++this.state % 2);
		app.debug("To color: " + app.grid.getCellColorName(currCell.state))
		app.debug("Note: new changes will be drawn in the next iteration")
	}

	/*
	Move bot from one cell to the cell it is pointing to
	*/
	this.move = function() {
		// save current position for correct animation purposes
		this.prevPosition.x = this.currPosition.x;
		this.prevPosition.y = this.currPosition.y;
		//update bot position (will be drawn in that position in the next frame animation)
		switch (this.direction) {
			case 1: // RIGHT
				this.currPosition.x = (++this.currPosition.x % app.grid.width);
				break
			case 3: // LEFT
				this.currPosition.x = this.currPosition.x !== 0 ? this.currPosition.x -= 1 : (app.grid.width - 1);
				break
			case 2: // DOWN
				this.currPosition.y = (++this.currPosition.y % app.grid.height)
				break
			case 0: // UP
				this.currPosition.y = this.currPosition.y !== 0 ? this.currPosition.y -= 1 : (app.grid.height - 1);
				break
			default:
				app.log('Error: unknown direction: ' + Number.isInteger(this.direction));
				noLoop();
				return false
		}

		app.debug('Updating Ant to move: ' + this.directionToNameMap[this.direction]);
		app.debug("Note: new changes will be drawn in the next iteration")

		//update bot state
		this.state = (++this.state % 2);
	}

	/*
	Draw current bot based on current bot status (pointing direction and cell color)
	*/
	this.draw = function() {

		app.debug('Drawing bot in current state');

		// first draw current cell
		if (app.grid.getCell(this.currPosition).changed)
			app.grid.drawCell(this.currPosition);
		// if bot has moved, re-draw previous cell location with appropiate color
		// this is done to remove the previous bot image from the previous cell since bot has moved to new cell
		if (this.state === 0 && app.grid.getCell(this.prevPosition).changed) {
			app.grid.drawCell(this.prevPosition);
		}

		//if cell size is less than 3 pixels, don't bother drawing bot, cell size is too small at this point
		if (app.grid.cellSize < 4) return;

		// bot size and location parameters
		var sqrx = Math.abs(this.currPosition.x % app.grid.width) * app.grid.cellSpacing;
		var sqry = Math.abs(this.currPosition.y % app.grid.height) * app.grid.cellSpacing;

		/*
		push() starts new drawing state for bot only
		this is done to properly draw bot in correct location 
		since p5's translate function is used to simplify math calculations
		*/
		push();
		// if cell size is less than 7, don't draw stroke around bot
		// because all we will see is the stroke color which is black and we can't see
		// the bot if it's on a black cell
		if (app.grid.cellSize < 7) {
			noStroke();
		}
		else {
			strokeWeight(1);
			stroke(0);
		}
		// bot color: white
		fill(255);
		// set appropiate bot drawing location, this takes care of some offsets used to make grid look "nicer"
		translate(sqrx + 2, sqry + 2);

		const point = this.drawingPoints[this.direction];
		// draw bot
		triangle(point[0], point[1], point[2], point[3], point[4], point[5]);
		// Restore original drawing state - needed to properly change cell colors
		pop();
	}
	//reset bot location & state
	this.reset = function() {
		// get middle of grid
		const gridX = Math.trunc(app.grid.width / 2);
		const gridY = Math.trunc(app.grid.height / 2);
		// recenter bot at middle of grid
		this.currPosition = {
			x: gridX,
			y: gridY
		}
		this.prevPosition = {
			x: gridX,
			y: gridY
		}
		// reset state & heading direction
		this.state = 0;
		this.direction = 0;
		// reset bot drawing size (in case cell size has changed)
		this.trigangleLine1 = app.grid.cellSize - 4;
		this.trigangleLine2 = (app.grid.cellSize / 2.0) - 2;
		this.drawingPoints = [
			// pointing up
			[0, this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine2 , 0],
			// pointing right
			[0, 0, 0, this.trigangleLine1 , this.trigangleLine1 , this.trigangleLine2],
			// pointing down
			[0, 0, this.trigangleLine1 , 0, this.trigangleLine2, this.trigangleLine1 ],
			// pointing left
			[this.trigangleLine1 , 0, this.trigangleLine1 , this.trigangleLine1 , 0, this.trigangleLine2]
		];
	}
}

let app = new App();

function setup() {
	// set framerate
	frameRate(app.config.FPS);
	app.setupCanvas();
	app.setTheme(0);
	// get middle cell of grid
	const cellX = Math.trunc(app.grid.width / 2);
	const cellY = Math.trunc(app.grid.height / 2);
	app.ant = new Bot(cellX, cellY);
	app.grid.createGrid();
	app.log('Setup finished');
	app.log('Press "start" button to initialize');
}
// p5's built-in draw function
function draw() {
	if (app.started) {
		app.ant.init();
		app.updateCounter();
	}
}

// vars for global user-controlled settings
const fpsInput = document.getElementById('frameRate');
const antNumberInput = document.getElementById('antNum');
const consoleContainer = document.getElementById('console');
const cellSizeInput = document.getElementById('cellSizeInput');
const gridSizeInputW = document.getElementById('gridSizeInputW');
const gridSizeInputH = document.getElementById('gridSizeInputH');


// set click event listener for "set FPS" button
const btnSetFPS = document.getElementById('btnSetFPS');
btnSetFPS.addEventListener('click', function() {
	const newFPS = trim(fpsInput.value);
	// basic sanity check to make sure input FPS is a number
	if (!isNaN(newFPS) && newFPS !== '') {
		app.config.FPS = newFPS;
		// set frame rate using p5 built-in function
		frameRate(parseInt(app.config.FPS));
		// log success message to page console
		app.log('New FPS set: ' + newFPS);
	} else {
		// if new FPS is not valid, just show error message on page console
		app.log('ERROR: could not set new FPS: ' + newFPS);
	}
})

// set click event listener for "Set Cell Size" button
const btnSetCellSize = document.getElementById('btnSetCellSize');
btnSetCellSize.addEventListener('click', function() {
	noLoop();
	const newCellSize = trim(cellSizeInput.value);
	// basic sanity check to make sure input cell Size is a number
	if (!isNaN(newCellSize) && newCellSize !== '') {
		app.setCellSize(newCellSize);
	} else {
		// if new cell size is not valid, just show error message on page console
		app.log('ERROR: could not set new cell size: ' + app.grid.cellSize);
	}
	loop();
})

// set click event listener for "Set Grid Size" button
const btnSetGridSize = document.getElementById('btnSetGridSize')
btnSetGridSize.addEventListener('click', function() {
	noLoop();
	const newGridSize = [
		trim(gridSizeInputW.value),
		trim(gridSizeInputH.value)
	]
	// basic sanity check to make sure input cell Size is a number
	if (!isNaN(newGridSize[0]) && newGridSize[0] !== '' && !isNaN(newGridSize[1]) && newGridSize[1] !== '') {
		app.setGridSize(newGridSize);
	} else {
		// if new cell size is not valid, just show error message on page console
		app.log('ERROR: could not set new grid size');
	}
	loop();
})

// set click event listener for "Set Ant number" button
const btnSetAntNum = document.getElementById('btnSetAntNum');
btnSetAntNum.addEventListener('click', function() {
	noLoop();
	// get user input
	const newAnt = trim(antNumberInput.value);
	// basic sanity check to make sure input cell Size is a number
	if (!Number.isNaN(newAnt) && newAnt !== '') {
		// convert string to hex number
		let num = abs(parseInt(newAnt, 16));
		// make user input is a valid hex number
		if (num.toString(16) !== newAnt.toLowerCase()) {
			app.log('ERROR: could not set Ant number. Number is not a valid hexadecimal');
		} else {
			if (num > 0x1F) {
				app.log("Ant number is too big, setting ant number to 0x1F");
				num = 0x1F;
			}

			app.setAntNumber(num);
		}
	} else {
		// if new cell size is not valid, just show error message on page console
		app.log('ERROR: could not set Ant number: ' + newAnt);
	}
	loop();
})

// set click event listener for "Start/Pause" button
const btnToggle = document.getElementById('btnToggle');
btnToggle.addEventListener('click', function() {
	if (!app.started) {
		app.log('Ant started...');
		app.log('Frame rate: ' + app.config.FPS);
		btnToggle.value = 'Pause';
		app.started = true;
	} else {
		app.log('Ant paused...');
		btnToggle.value = 'Resume';
		app.started = false;
	}
})

// set click event listener for "Clear" button
const btnClear = document.getElementById('btnClear');
btnClear.addEventListener('click', function() {
	consoleContainer.innerHTML = '';
})

// set click event listener for "Reset" button
const btnReset = document.getElementById('btnReset');
btnReset.addEventListener('click', function() {
	app.resetApp();
})

// set change event listener for "Theme" button
const themeDropDown = document.getElementById('theme');
themeDropDown.addEventListener('change', function() {
	let theme = themeDropDown.selectedIndex;
	app.setTheme(theme);
})

// set change event listener for "debug" checkbox
const debug = document.getElementById('debug');
debug.addEventListener('change', function() {
	app.setDebug(debug.checked);
})

// set change event listener for "debug" checkbox
const logAll = document.getElementById('logAll');
logAll.addEventListener('change', function() {
	app.setLogAll(logAll.checked);
})


const btnSavePic = document.getElementById('btnSavePic');
btnSavePic.addEventListener('click', function() {
	app.log("Saving image...");

	let antNum = "0x" + app.ant.number.reduce((res, x) => res << 1 | x).toString(16);
	let textBox = createGraphics(200, 100);
	let imgCanvas = createGraphics(app.config.canvasW, app.config.canvasH);
	imgCanvas.copy(app.canvas, 0, 0, app.config.canvasW, app.config.canvasH, 0, 0, app.config.canvasW, app.config.canvasH);

	// (x, y) coorditates for textbox
	let x = 3;
	let y = 13;

	textBox.stroke(0);
	textBox.fill(255);
	textBox.text("Modified Langton's Ant pattern", x, y);
	textBox.text("Ant number: " + antNum, x, (y+=15));
	textBox.text("Cell size: " + app.grid.cellSize + " pixels", x, (y+=15));
	textBox.text("Grid size: " + app.grid.width + " x " + app.grid.height + " cells", x, (y+=15));
	textBox.text("Movement number: " + app.moveNum, x, (y+=15));
	textBox.text("Date: " + month() + "/" + day() + "/" + year(), x, (y+=15));

	imgCanvas.image(textBox, 0,0);
	
	let gridSize = `${app.grid.width}_x_${app.grid.height}`
	let timeStamp = `${hour()}_${minute()}_${second()}`;
	let fileName = `Modified_Langton_s_ant_${gridSize}_grid_${timeStamp}`

	saveCanvas(imgCanvas, fileName, 'jpg');

})