/**
 * Copyright 2014 Chris Barber (email: chris@chris-barber.co.uk)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2, as
 * published by the Free Software Foundation.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

// Set up Game variables from Params passed in URL
var game = getURLParameter('g'),
    p1name = getURLParameter('p1'),
    p2name = getURLParameter('p2');

var player1, player2, game;

var currentplayer = 1,
    compareTimer,
    carTimer;

$(document).ready(function() {
  if (!$('.game')) {
    // Return early if this is not the game page
    return;
  }

  player1 = new Player(p1name);
  player2 = new Player(p2name);
  game = new Game();

  setupGame();

  $('.card').on('click', '.stat', null, function() {
    chooseStat($(this).attr('id'));
  });
});

function compareCars(stat) {
  var drawn = false,
      text = "",
      carPlayer1 = player1.cars[0],
      carPlayer2 = player2.cars[0];

  if (carPlayer1[stat] == carPlayer2[stat]) {
    drawn = true;
    text = "<p>Draw</p>";
  } else if (stat == "speed" || stat == "power" || stat == "engine") {
    // Bigger Value is Better for these - Top Speed, BHP, Engine Size
    if (carPlayer1[stat] > carPlayer2[stat]) {
      currentplayer = 1;
    } else {
      currentplayer = 2;
    }
  } else if (stat == "sixty" || stat == "weight") {
    // Smaller Value is Better for these - 0-60 Time, Weight
    if (carPlayer1[stat] < carPlayer2[stat]) {
      currentplayer = 1;
    } else {
      currentplayer = 2;
    }
  }
  // allocate the cars (to the winner, or if a draw, then stick the car at the back)
  allocateCars(currentplayer, drawn);

  if (currentplayer == 1 && !drawn) {
    text = '<p class="left">Player 1 Wins</p>';
  }

  if (currentplayer == 2 && !drawn) {
    text = '<p class="right">Player 2 Wins</p>';
  }

  $('#flash').html(text);
  setTimeout('updateScore()', 2500);
}

function allocateCars(player, draw) { // e.g. allocateCars(1);
  if (draw) {
    player1.cars.push(player1.cars.shift()); // put current card to back of the stack
    player2.cars.push(player2.cars.shift()); // put current card to back of the stack
  } else {
    // This function will take each players car, put them into the pot, and then reassign to the end of the winners car array
    // take cars and put into pot:
    game.pot.push(player1.cars.shift());
    game.pot.push(player2.cars.shift());
    // . push = pushes object to end of array.
    // Combined = remove current card from the player and put it in the pot.
    if (player == 1) {
      // player 1 is the winner -- loop the pot and reassign the cars
      for(i = 0; i < game.pot.length; i++) {
        player1.cars.push(game.pot[i]);
      }
      game.pot = []; // clear the pot
    } else if (player == 2) {
      // player 2 is the winner
      for(i = 0; i < game.pot.length; i++) {
        player2.cars.push(game.pot[i]);
      }
      game.pot = []; // clear the pot
    } else {
      // Something has gone horribly wrong
    }
  }
}

function chooseStat(stat) {
  if (currentplayer == 1) {
    showCar(1, 0, stat);
    var carTimer = setTimeout(function() {
      showCar(2, 0, arguments[0]);
    }, 500, stat);
  } else {
    showCar(2,0,stat);
    var carTimer = setTimeout(function() {
      showCar(1, 0, arguments[0]);
    }, 500, stat);
  }
  var compareTimer = setTimeout(function() {
    compareCars(arguments[0]);
  }, 1500, stat);
}

function computerChooseStat() {
  // are any of the values 'good'?
  var chosen,
      playerCar = player1.cars[0];

  if (playerCar.speed > 199) {
    // Top Speed
    chosen = "speed";
  } else if (playerCar.sixty < 4) {
    // 0-60 Time
    chosen = "sixty";
  } else if (playerCar.power > 450) {
    // BHP
    chosen = "power";
  } else if (playerCar.engine > 5000 ) {
    // Engine Size in cc
    chosen = "engine";
  } else if (playerCar.weight < 1200) {
    // Weight in Kg
    chosen = "weight";
  }
  // if not, are any of them 'ok'
  else if (playerCar.speed > 180) {
    // Top Speed
    chosen = "speed";
  } else if (playerCar.sixty < 4.6) {
    // 0-60 Time
    chosen = "sixty";
  } else if (playerCar.power > 350) {
    // BHP
    chosen = "power";
  } else if (playerCar.engine > 4000 ) {
    // Engine Size in cc
    chosen = "engine";
  } else if (playerCar.weight < 1350) {
    // Weight in Kg
    chosen = "weight";
  } else {
    // if there aren't any good or ok fields, then just go for pot luck
    chosen = chooseRandomStat();
  }

  setTimeout(function() {
    chooseStat(arguments[0]);
  }, 1000, chosen);
};

function chooseRandomStat() {
  var stats = ["speed", "sixty", "power", "engine", "weight"];

  return stats[Math.floor(Math.random() * stats.length)];
};

function setupGame() {
  shuffleCars(); // initial shuffle of cars

  updateScore(); // initialise scores

  if (game == 1) { clearTimeout(carTimer); clearTimeout(compareTimer); }

  if (currentplayer == 1) {
    // Show P1's Card, Hide P2's Card
    showCar(1,1,"");
    showBlank(2);
  } else {
    // Show P2's Card, Hide P1's Card
    if (game == 1) {
      showCar(2,0,""); // don't want interactive links for the computers turn! duh!
    } else {
      showCar(2,1,"");
    }
    showBlank(1);
  }
}

function updateScore() {

  $('#flash').html(''); // clear status

  var p1data = { name: p1name, games: player1.score, cards: player1.cars.length },
      p1score = App.templates.score(p1data);

  var p2data = { name: p2name, games: player2.score, cards: player2.cars.length },
      p2score = App.templates.score(p2data);

  $('#p1score').html(p1score);
  $('#p2score').html(p2score);

  if (player1.cars.length == 0) {
    // player 2 wins & player 1 loses
    player2.score++;
    if (confirm(p2name + " has won this game. Do you want to play again?")) {
      setupGame();
    } else {
      location.href = "index.html";
    }

  } else if (player2.cars.length == 0) {
    // player 1 wins & player 2 loses
    player1.score++;
    if (confirm(p1name + " has won this game. Do you want to play again?")) {
      setupGame();
    } else {
      location.href = "index.html";
    }
  } else {
    // still continue playing :)
  }

  if (currentplayer == 1) {
    // Player 1's Turn
    // Show P1's Card, Hide P2's Card
    showCar(1,1,"");
    showBlank(2);
  } else if (currentplayer == 2) {
    // Player 2's Turn
    // Show P2's Card, Hide P1's Card
    showCar(2,1,"");
    showBlank(1);
  }
}

function showBlank(player) {
  if (player == 1) {
    $('#p1card').html('');
  } else {
    $('#p2card').html('');
  }
}

function showCar(player, interactive, stat) {
  var car = player1.cars[0];

  if (player != 1) {
    car = player2.cars[0];
  }

  var classes = { speed:'', sixty:'', power:'', engine:'', weight:'' };
  if (stat != "") {
    classes[stat] = 'selected';
  }
  var data = { car: car, country: game.countries[car.country], interactive: interactive, classes: classes },
      card  = App.templates.card(data);

  if (player == 1) {
    $('#p1card').html(card);
  } else {
    $('#p2card').html(card);
  }

  // activate computer picking if playing against computer
  if (game == 1 && currentplayer == 2 && interactive != 0) { computerChooseStat(); }
}

function shuffleCars() {
  var length = game.cars.length;

  player1.cars = game.cars.slice(0, length/2);
  player2.cars = game.cars.slice(length/2, length);
}

function getURLParameter(name) {
  // getURLParameter Code from: http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
  return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}
