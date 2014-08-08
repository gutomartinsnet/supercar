var images = [],
    flagImages = [];

$(document).ready(function() {
  // preload all car images to increase speed of game

  for(var i = 0; i < cars.length; i++) {
    images[i] = new Image();
    images[i].src = "../images/cars/" + cars[i].image + ".png";
  }

  for(var i = 0; i < flags.length; i++) {
    flagImages[i] = new Image();
    flagImages[i].src = "../images/flags/" + flags[i].image + ".png";
  }

  $('#player1').click(function() {
    if($('#p1name').val() == '' || $('#p1name').val().length > 10) {
      alert("Please enter a valid name for Player 1 (maximum 10 characters)");
      $('#p1name').focus();
      return false;
    }
    location.href = "game.html?g=1&p1="+$('#p1name').val() + "&p2=Computer";
  });

  $('#player2').click(function() {
    if($('#p1name').val() == '' || $('#p1name').val().length > 10) {
      alert("Please enter a valid name for Player 1 (maximum 10 characters)");
      $('#p1name').focus();
      return false;
    }
    if($('#p2name').val() == '' || $('#p2name').val().length > 10) {
      alert("Please enter a valid name for Player 2 (maximum 10 characters)");
      $('#p2name').focus();
      return false;
    }
    if($('#p1name').val() == $('#p2name').val()) {
      alert("Player 1 and Player 2 must have different names, try again.");
      $('#p1name').focus();
      return false;
    }
    location.href = "game.html?g=2&p1="+$('#p1name').val() + "&p2=" + $('#p2name').val();
  });
});
