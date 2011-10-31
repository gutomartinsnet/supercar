/* Website: Supercar Top Trumps
Developer: Chris Barber
Version: 1.0
Date: 23/10/2011
File: main.js */

/*  Copyright 2011 Chris Barber (email: chris@chris-barber.co.uk)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

// Set up Game variables from Params passed in URL
var game 	= getURLParameter('g');
var p1name 	= getURLParameter('p1');
var p2name 	= getURLParameter('p2');

// Set up arrays
var player1 = new Array(); // to hold p1's cars
var player2 = new Array(); // to hold p2's cars
var pot		= new Array(); // to hold cars from both players before giving them to the winner

var countries = new Array();

var player1score = 0; // score (number of games won)
var player2score = 0; // score (number of games won)

var currentplayer = 1;

var carTimer;
var compareTimer;

$(document).ready(function() {
	
	setupCountries();
	
	setupGame();
	
	$('.stat').live('click', function() {
	  	// Live handler called.
		chooseStat($(this).attr('id'));
	});
});

function setupCountries() {
	// done this so I can call countries[country ref] rather than looping the array everytime to find the right image ref
	for(var j = 0; j<flags.length; j++) {
		countries[flags[j][0]] = flags[j];
	}
	
}

function compareCars(stat) {
	var drawn 	= false;
	var text 	= "";

	if(cars[player1[0]][stat] == cars[player2[0]][stat]) {
		drawn = true;
		text = "<p>Draw</p>";
	} else if(stat == 3 || stat == 5 || stat == 6) {
		// Bigger Value is Better for these - Top Speed, BHP, Engine Size
		if (cars[player1[0]][stat] > cars[player2[0]][stat]) { 
			currentplayer = 1; 
		} else { 
			currentplayer = 2;
		}
	} else if(stat == 4 || stat == 7) {
		// Smaller Value is Better for these - 0-60 Time, Weight
		if (cars[player1[0]][stat] < cars[player2[0]][stat]) { 
			currentplayer = 1; 
		} else { 
			currentplayer = 2;
		}	
	} 	
	// allocate the cars (to the winner, or if a draw, then stick the car at the back)
	allocateCars(currentplayer, drawn);	
	
	if(currentplayer == 1 && !drawn) {
		text = '<p class="left">Player 1 Wins</p>';
	}

	if(currentplayer == 2 && !drawn) {
		text = '<p class="right">Player 2 Wins</p>';
	}
	
	$('#flash').html(text);
	setTimeout('updateScore()',2500);
}

function allocateCars(player, draw) { // e.g. allocateCars(1);
	if(draw) {
		player1.push(player1.shift()); // put current card to back of the stack
		player2.push(player2.shift()); // put current card to back of the stack
	} else {
		// This function will take each players car, put them into the pot, and then reassign to the end of the winners car array
		// take cars and put into pot:
		pot.push(player1.shift());
		pot.push(player2.shift());
		// .shift = removes the first element in the array and returns it.
		// . push = pushes object to end of array.
		// Combined = remove current card from the player and put it in the pot.
	
		if(player == 1) {
			// player 1 is the winner -- loop the pot and reassign the cars
			for(i = 0; i < pot.length; i++) { 
				player1.push(pot[i]);
			}
			pot = new Array(); // clear the pot
		} else if (player == 2) {
			// player 2 is the winner
			for(i = 0; i < pot.length; i++) { 
				player2.push(pot[i]);
			}
			pot = new Array(); // clear the pot
		} else {
			// Something has gone horribly wrong
		}
	}
}

function chooseStat(stat) {
	if (currentplayer == 1) {
		showCar(1,0,stat);
		var carTimer = setTimeout("showCar(2, 0, " + stat + ")",500);
		var compareTimer = setTimeout('compareCars(' + stat + ')',1500);
	} else {
		showCar(2,0,stat);
		var carTimer = setTimeout("showCar(1, 0, " + stat + ")",500);
		var compareTimer = setTimeout('compareCars(' + stat + ')',1500);
	}
}

function computerChooseStat() {
	// are any of the values 'good'?
	var chosen;
	
	if(cars[player1[0]][3] > 199) {
		// Top Speed
		chosen = 3;
	} else if (cars[player1[0]][4] < 4) {
		// 0-60 Time
		chosen = 4;
	} else if (cars[player1[0]][5] > 450) {
		// BHP
		chosen = 5;
	} else if (cars[player1[0]][6] > 5000 ) {
		// Engine Size in cc
		chosen = 6;
	} else if (cars[player1[0]][7] < 1200) {
		// Weight in Kg
		chosen = 7;
	}
	// if not, are any of them 'ok'
	else if(cars[player1[0]][3] > 180) {
		// Top Speed
		chosen = 3;
	} else if (cars[player1[0]][4] < 4.6) {
		// 0-60 Time
		chosen = 4;
	} else if (cars[player1[0]][5] > 350) {
		// BHP
		chosen = 5;
	} else if (cars[player1[0]][6] > 4000 ) {
		// Engine Size in cc
		chosen = 6;
	} else if (cars[player1[0]][7] < 1350) {
		// Weight in Kg
		chosen = 7;
	}
	// if there aren't any good or ok fields, then just go for pot luck
	else {
		chosen = parseInt((Math.random()*5)+3);
	}
	setTimeout("chooseStat(" + chosen + ")",1000);
}

function setupGame() {
	player1 = new Array(); // clear array just incase
	player2 = new Array(); // clear array just incase
	pot		= new Array(); // clear array just incase
	
	shuffleCars(); // initial shuffle of cars
	
	updateScore(); // initialise scores
	
	if (game == 1) { clearTimeout(carTimer); clearTimeout(compareTimer); }
	
	if(currentplayer == 1) {
		// Show P1's Card, Hide P2's Card
		showCar(1,1,0);
		showBlank(2);
	} else {
		// Show P2's Card, Hide P1's Card
		if(game == 1) {
			showCar(2,0,0); // don't want interactive links for the computers turn! duh!
		} else {
			showCar(2,1,0);
		}
		showBlank(1);
	}
}

function updateScore() {

	$('#flash').html(''); // clear status

	var p1score = '<ul>\
		<li class="name">Name: ' + p1name + '</li>\
		<li class="games">Games: ' + player1score + '</li>\
		<li class="cards">Cards: ' + player1.length + '</li>\
	</ul>';
	
	$('#p1score').html(p1score);
	
	var p2score = '<ul>\
		<li class="name">Name: ' + p2name + '</li>\
		<li class="games">Games: ' + player2score + '</li>\
		<li class="cards">Cards: ' + player2.length + '</li>\
	</ul>';

	$('#p2score').html(p2score);
	
	if(player1.length == 0) {
		// player 2 wins & player 1 loses
		player2score++;
		if(confirm(p2name + " has won this game. Do you want to play again?")) {
			setupGame();
		} else {
			location.href = "index.html";
		}
		
	} else if(player2.length == 0) {
		// player 1 wins & player 2 loses
		player1score++;
		if(confirm(p1name + " has won this game. Do you want to play again?")) {
			setupGame();
		} else {
			location.href = "index.html";
		}
	} else {
		// still continue playing :)
	}
	
	if(currentplayer == 1) {
		// Player 1's Turn
		// Show P1's Card, Hide P2's Card
		showCar(1,1,0);
		showBlank(2);
	} else if(currentplayer == 2) {
		// Player 2's Turn
		// Show P2's Card, Hide P1's Card
		showCar(2,1,0);
		showBlank(1);
	}
}

function showBlank(player) {
	if(player == 1) {
		$('#p1card').html('');
	} else {
		$('#p2card').html('');
	}
}

function showCar(player, interactive, stat) {
	
	var carno;
	if(player == 1) {
		carno = player1[0];
	} else {
		carno = player2[0];
	}

	//Image Ref, Car Name, Car Country, Top Speed, 0-60, Power, Engine Size cc, Weight Kgs
	var imageref 	= cars[carno][0];
	var carname		= cars[carno][1];
	var country		= countries[cars[carno][2]];
	var topspeed	= cars[carno][3];
	var zerosixty	= cars[carno][4];
	var power		= cars[carno][5];
	var enginesize	= cars[carno][6];
	var weight		= cars[carno][7]; 
	
	var card = '<div class="country">\
		<p>'+country[1]+'</p>\
		<img src="images/flags/'+country[0]+'.png" alt="'+country[1]+'">\
	</div>\
	<h2>'+carname+'</h2>\
	<img src="images/cars/'+imageref+'.png" alt="'+carname+'" />\
	<dl>\
	';
	
	if(interactive) {
		card += '<dt><a id="3" class="stat">Top Speed</a></dt>\
			<dd><a id="3" class="stat">'+topspeed+' mph</a></dd>\
		<dt><a id="4" class="stat">0 - 60 mph</a></dt>\
			<dd><a id="4" class="stat">'+zerosixty+' sec</a></dd>\
		<dt><a id="5" class="stat">Power</a></dt>\
			<dd><a id="5" class="stat">'+power+' bhp</a></dd>\
		<dt><a id="6" class="stat">Capacity</a></dt>\
			<dd><a id="6" class="stat">'+enginesize+' cc</a></dd>\
		<dt><a id="7" class="stat">Weight</a></dt>\
			<dd><a id="7" class="stat">'+weight+' Kg</a></dd>';
	} else {
		var classes = ['','','','',''];
		if(stat > 0) {
			classes[stat-3] = 'selected';
		}
		card += '<dt class="'+classes[0]+'">Top Speed</dt>\
			<dd class="'+classes[0]+'">'+topspeed+' mph</dd>\
		<dt class="'+classes[1]+'">0 - 60 mph</dt>\
			<dd class="'+classes[1]+'">'+zerosixty+' sec</dd>\
		<dt class="'+classes[2]+'">Power</dt>\
			<dd class="'+classes[2]+'">'+power+' bhp</dd>\
		<dt class="'+classes[3]+'">Capacity</dt>\
			<dd class="'+classes[3]+'">'+enginesize+' cc</dd>\
		<dt class="'+classes[4]+'">Weight</dt>\
			<dd class="'+classes[4]+'">'+weight+' Kg</dd>';	
	}
	
	card += '</dl>';
	
	if(player == 1) {
		$('#p1card').html(card);
	} else {
		$('#p2card').html(card);
	}
	
	// activate computer picking if playing against computer
	if (game == 1 && currentplayer == 2 && interactive != 0) { computerChooseStat(); }
} 

function shuffleCars() {
	// Duplicate cars array
	var randoms = rangefill(32);
	// shuffle array (Line of Code from: http://onwebdev.blogspot.com/2011/05/jquery-randomize-and-shuffle-array.html)
	for(var j, x, i = randoms.length; i; j = parseInt(Math.random() * i), x = randoms[--i], randoms[i] = randoms[j], randoms[j] = x);
	// deal card array location out to players
	for(k=0;k<16;k++) { player1.push(randoms[k]) }   
	for(k=16;k<32;k++) { player2.push(randoms[k]) }
}

function getURLParameter(name) {
	// getURLParameter Code from: http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}
// quick range arrray populate from: http://stackoverflow.com/questions/6299500/tersest-way-to-create-an-array-of-integers-from-1-20-in-javascript
function rangefill(i){return i?rangefill(i-1).concat(i-1):[]}