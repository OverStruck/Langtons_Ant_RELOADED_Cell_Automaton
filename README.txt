
	Author: Juan Velasco (only team member)
	jvelascolewis@csu.fullerton.edu

	Cella Ant #x15 Project
	Algorithms CPSC 335-03

==================================================
	Contents: index.html, sketch.js, p5.js, style.css, README.txt
	External Requeriments: p5.js
	Set up & install: Just open index.html file in any modern web browser
	Sample invocation: N/A
	Features: User Interface in Index.html to control certain properties of the web app
		  You can customize the frame rate, cell size, grid size, colors used (theme) & even the Ant's number (default is 0x15)
			  
		  A simple console window is provided with some info about the running application
			  
		  You can start the program by clicking on the button "start," that same button changes
		  its text value to "pause", if you click it when it says "pause", it pauses the program
			  
	Bugs: none known when using proper paratemers, who knows what will happen if, for example,
	      a negative number is used

	1. To start program, simply open index.html in any *modern* web browser
	2. Click on the button "start" to start application

=+=+==+=+= =+=+= =+=+= INTRO =+=+==+=+= =+=+= =+==
==================================================
This project is to write a program to display the generational progress of Turk & Propp's (TP) Ant #x15, a
cellular automaton variant of Langton's Ant. The program is written in P5.js + Javascript with an HTML
web page for display.

The cellular automaton (ant) is shown in a 2D grid of black, red, yellow, blue, and green cells; initially all are black.

The algorithm used is very simple. The grid is made of "cells" (squares) which can be in 1 of 5 possible states.
Each state represents the current color of the cell. At the beginning, all cells have state 0 which corresponds to
the color black. State 1 corresponds to the next color, which is red and so on. The mapping between states and colors is as follows:

State		|	Color
-------------------------------
0		|	Black
-------------------------------
1		|	Red
-------------------------------
2		|	Yellow
-------------------------------
3		|	Blue
-------------------------------
4		|	Green
-------------------------------

The cellular automaton (ant) which we will refer to as "bot" has 2 states:

State		|	Action
-------------------------------
0		|	Update bot pointing direction (UP, DOWN, LEFT, RIGHT) & the cell state
-------------------------------
1		|	Move bot to the cell it is pointing to

At the beginning the bot is placed (drawn) in the middle of the grid & it is point/heading up/north

On Movement #0 
The bot is in state 0, which means we need to update some of it's properties like heading/pointing direction
To do this, the bot notices the color (state) of the current cell it is on.
In this case, the cell is black (state 0) so the bot will update it's pointing/heading direction to point left
Then it will update the state of the cell it is on to the next state (from state 0 -> to state 1)
And finally it will update it's own state to state 1 (moving state)

This is all that happens in state 0.

Note: we are not re-drawing the cell in this movement after we update it's properties (pointing/heading direction, etc)

On movement #1
The bot is drawn according to it's current state, in this case, it will be draw facing left
and the cell is is on will be drawn in red because it's state changed from state 0 to state 1 in movement #0.
After the cell & bot are drawn, we simply "move" the bot to the cell it is pointing to because in this stage the bot state is 1 (move state)
Then we change the bot state (from state 1 to state 0)

Note: by "move" what we mean is that we update the position of the bot, HOWEVER, this doesn't mean that we re-draw the bot
this just means we update the bot's current position property. 

Movement #2
In this movement, the same sequence of steps we saw in movement #0 happen:
The bot is in state 0, which means it notices the color (state) of the current cell it is on.
In this case, the cell is black (state 0) so the bot will update it's pointing/heading direction to point left
Then it will update the state of the cell it is on to the next state (from state 0 -> to state 1)
And finally it will update it's own state to state 1 (moving state)

On movement #3
In this movement, the same sequence of steps we saw in movement #1 happen:
The bot is drawn according to it's current state, in this case, it will be draw facing down
and the cell is is on will be drawn in red because it's state changed from state 0 to state 1 in movement #2.
After the cell is drawn, we simply "move" the bot to the cell it is pointing to because in this stage the bot state is 1 (move state)
Then we change the bot state (from state 1 to state 0)

This patterns repeats until the program is stopped.

So essentially, broadly speaking, each movement looks like this:
	1) Draw cell current bot is on (using it's state to determine what color to use)
	2) Draw bot - using whatever paratemers it currently has such as position, pointing/heading direction,etc
	2) Change state or move

Those 3 steps are repeated until the program is stopped.
At the beginning of the movement the bot & the cell it is on are always drawn,
After the cell & bot are drawn on screen, we update the bot's properties (position, pointing/heading direction, etc) & we update the cell state

