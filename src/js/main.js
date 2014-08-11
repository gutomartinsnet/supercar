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
var gameType = getURLParameter('g'),
    p1name = getURLParameter('p1'),
    p2name = getURLParameter('p2');

var app, game;

$(document).ready(function() {
  if (!$('.game')) {
    // Return early if this is not the game page
    return;
  }
  
  // gameType = 1 for 1 player, 2 for two player
  var twoPlayer = (gameType == 2);

  app = new App();
  game = new Game(p1name, p2name, twoPlayer);

  setupGame();

  $('.card').on('click', '.stat', null, function() {
    chooseStat($(this).attr('id'));
  });
});

function compareCars(stat) {
  var carA = game.getPlayer('one').currentCar(),
      carB = game.getPlayer('two').currentCar(),
      drawn = false,
      text = '';

  var comparitor = new CarComparitor(carA, carB),
      result = comparitor.compare(stat);

  if (result === false) {
    drawn = true;
    text = "<p>Draw</p>";
  } else {
    if (result === carA) {
      game.currentPlayer = 'one';
      text = '<p class="left">Player 1 Wins</p>';
    } else {
      game.currentPlayer = 'two';
      text = '<p class="right">Player 2 Wins</p>';
    }
  }

  // allocate the cars (to the winner, or if a draw, then stick the car at the back)
  game.allocateCars(drawn);

  app.flash.set(text);
  setTimeout('updateScore()', 2500);
}

function chooseStat(stat) {
  if (game.currentPlayer == 'one') {
    showCar(1, 0, stat);
    Game.carTimer = setTimeout(function() {
      showCar(2, 0, arguments[0]);
    }, 500, stat);
  } else {
    showCar(2,0,stat);
    Game.carTimer = setTimeout(function() {
      showCar(1, 0, arguments[0]);
    }, 500, stat);
  }
  Game.compareTimer = setTimeout(function() {
    compareCars(arguments[0]);
  }, 1500, stat);
}

function computerChooseStat() {
  var computer = game.getPlayer('two'),
      chosen = computer.chooseStat();

  setTimeout(function() {
    chooseStat(arguments[0]);
  }, 1000, chosen);
};

function setupGame() {
  updateScore(); // initialise scores

  if (!game.twoPlayer) { clearTimeout(Game.carTimer); clearTimeout(Game.compareTimer); }

  if (game.currentPlayer == 'one') {
    // Show P1's Card, Hide P2's Card
    showCar(1,1,"");
    showBlank(2);
  } else {
    // Show P2's Card, Hide P1's Card
    if (game.twoPlayer) {
      showCar(2,1,"");
    } else {
      showCar(2,0,""); // don't want interactive links for the computers turn! duh!
    }
    showBlank(1);
  }
}

function updateScore() {
  var player1 = game.getPlayer('one'),
      player2 = game.getPlayer('two');

  app.flash.clear(); // clear status

  var p1score = App.templates.score(player1.scoreData()),
      p2score = App.templates.score(player2.scoreData());

  $('#p1score').html(p1score);
  $('#p2score').html(p2score);

  if (player1.cars.length == 0) {
    // player 2 wins & player 1 loses
    player2.score++;
    if (confirm(player2.name + " has won this game. Do you want to play again?")) {
      setupGame();
    } else {
      location.href = "index.html";
    }

  } else if (player2.cars.length == 0) {
    // player 1 wins & player 2 loses
    player1.score++;
    if (confirm(player1.name + " has won this game. Do you want to play again?")) {
      setupGame();
    } else {
      location.href = "index.html";
    }
  } else {
    // still continue playing :)
  }

  if (game.currentPlayer == 'one') {
    // Player 1's Turn
    // Show P1's Card, Hide P2's Card
    showCar(1,1,"");
    showBlank(2);
  } else if (game.currentPlayer == 'two') {
    // Player 2's Turn
    // Show P2's Card, Hide P1's Card
    showCar(2,1,"");
    showBlank(1);
  }
}

function showBlank(player) {
  blank  = App.templates.card({blank: true});

  if (player == 1) {
    $('#p1card').html(blank);
  } else {
    $('#p2card').html(blank);
  }
}

function showCar(player, interactive, stat) {
  var player1 = game.getPlayer('one'),
      player2 = game.getPlayer('two');
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
  if (!game.twoPlayer && game.currentPlayer == 'two' && interactive != 0) { computerChooseStat(); }
}

function getURLParameter(name) {
  // getURLParameter Code from: http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
  return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}
