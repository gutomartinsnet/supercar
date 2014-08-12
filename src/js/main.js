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
var app;

$(document).ready(function() {
  app = new App();
});

Game.prototype.compareCars = function(stat) {
  var carA = this.getPlayer('one').currentCar(),
      carB = this.getPlayer('two').currentCar(),
      drawn = false,
      text = '';

  var comparitor = new CarComparitor(carA, carB),
      result = comparitor.compare(stat);

  if (result === false) {
    drawn = true;
    text = "<p>Draw</p>";
  } else {
    if (result === carA) {
      this.currentPlayer = 'one';
      text = '<p class="left">Player 1 Wins</p>';
    } else {
      this.currentPlayer = 'two';
      text = '<p class="right">Player 2 Wins</p>';
    }
  }

  // allocate the cars (to the winner, or if a draw, then stick the car at the back)
  this.allocateCars(drawn);

  scope = this;
  this.app.flash.set(text);
  setTimeout(function() {
    scope.updateScore();
  }, 2500);
}

Game.prototype.chooseStat = function(stat) {
  var scope = this;

  if (this.currentPlayer == 'one') {
    this.players.one.showCard(false, stat);
    Game.carTimer = setTimeout(function() {
      scope.players.two.showCard(false, arguments[0]);
    }, 500, stat);
  } else {
    this.players.two.showCard(false, stat);
    Game.carTimer = setTimeout(function() {
      scope.players.one.showCard(false, arguments[0]);
    }, 500, stat);
  }
  Game.compareTimer = setTimeout(function() {
    scope.compareCars(arguments[0]);
  }, 1500, stat);
}

Game.prototype.computerChooseStat = function() {
  var computer = this.getPlayer('two'),
      chosen = computer.chooseStat(),
      scope = this;

  setTimeout(function() {
    scope.chooseStat(arguments[0]);
  }, 1000, chosen);
};

Game.prototype.updateScore = function() {
  var player1 = this.getPlayer('one'),
      player2 = this.getPlayer('two');

  this.app.flash.clear(); // clear status

  var p1score = App.templates.score(player1.scoreData()),
      p2score = App.templates.score(player2.scoreData());

  $('#p1score').html(p1score);
  $('#p2score').html(p2score);

  if (player1.cars.length == 0) {
    // player 2 wins & player 1 loses
    player2.score++;
    if (confirm(player2.name + " has won this game. Do you want to play again?")) {
      this.setupGame();
    } else {
      window.location.hash = ''
      window.location.reload()
    }

  } else if (player2.cars.length == 0) {
    // player 1 wins & player 2 loses
    player1.score++;
    if (confirm(player1.name + " has won this game. Do you want to play again?")) {
      this.setupGame();
    } else {
      window.location.hash = ''
      window.location.reload()
    }
  } else {
    // still continue playing :)
  }

  if (this.currentPlayer == 'one') {
    // Player 1's Turn
    // Show P1's Card, Hide P2's Card
    this.players.one.showCard();
    this.showBlank();
  } else if (this.currentPlayer == 'two') {
    // Player 2's Turn
    // Show P2's Card, Hide P1's Card
    this.players.two.showCard();
    this.showBlank();
  }
}
