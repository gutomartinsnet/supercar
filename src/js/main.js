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

Game.prototype.setupGame = function() {
  var scope = this;

  $('.card').on('click', '.stat', null, function() {
    scope.chooseStat($(this).attr('id'));
  });

  this.updateScore(); // initialise scores

  if (!this.twoPlayer) { clearTimeout(Game.carTimer); clearTimeout(Game.compareTimer); }

  if (this.currentPlayer == 'one') {
    // Show P1's Card, Hide P2's Card
    this.showCar(1,1,"");
    this.showBlank(2);
  } else {
    // Show P2's Card, Hide P1's Card
    if (this.twoPlayer) {
      this.showCar(2,1,"");
    } else {
      this.showCar(2,0,""); // don't want interactive links for the computers turn! duh!
    }
    this.showBlank(1);
  }
}

Game.prototype.chooseStat = function(stat) {
  var scope = this;

  if (this.currentPlayer == 'one') {
    this.showCar(1, 0, stat);
    Game.carTimer = setTimeout(function() {
      scope.showCar(2, 0, arguments[0]);
    }, 500, stat);
  } else {
    this.showCar(2,0,stat);
    Game.carTimer = setTimeout(function() {
      scope.showCar(1, 0, arguments[0]);
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
    this.showCar(1,1,"");
    this.showBlank(2);
  } else if (this.currentPlayer == 'two') {
    // Player 2's Turn
    // Show P2's Card, Hide P1's Card
    this.showCar(2,1,"");
    this.showBlank(1);
  }
}

Game.prototype.showBlank = function(player) {
  blank  = App.templates.card({blank: true});

  if (player == 1) {
    $('#p1card').html(blank);
  } else {
    $('#p2card').html(blank);
  }
}

Game.prototype.showCar = function(player, interactive, stat) {
  var player1 = this.getPlayer('one'),
      player2 = this.getPlayer('two');
  var car = player1.cars[0];

  if (player != 1) {
    car = player2.cars[0];
  }

  var classes = { speed:'', sixty:'', power:'', engine:'', weight:'' };
  if (stat != "") {
    classes[stat] = 'selected';
  }
  var data = { car: car, country: this.countries[car.country], interactive: interactive, classes: classes },
      card  = App.templates.card(data);

  if (player == 1) {
    $('#p1card').html(card);
  } else {
    $('#p2card').html(card);
  }

  // activate computer picking if playing against computer
  if (!this.twoPlayer && this.currentPlayer == 'two' && interactive != 0) { this.computerChooseStat(); }
}
