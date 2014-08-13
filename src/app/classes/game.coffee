###
# Copyright 2014 Chris Barber (email: chris@chris-barber.co.uk)
#
# This program is free software, you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 2, as
# published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY, without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program, if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
###
# Game Representation
class Game
  ###
  # @property carTimer
  # @type {timer}
  ###
  @carTimer

  ###
  # @property compareTimer
  # @type {timer}
  ###
  @compareTimer

  # @param {String} nameOne - Player 1 Name
  # @param {String} nameTwo - Player 2 Name
  # @param {Boolean} twoPlayer - (true = 2 player, false = 1 player)
  constructor: (app, nameOne, nameTwo, twoPlayer) ->
    @app = app

    @game = App.templates.game()
    @$game = $(@game)

    @app.$arena.html(@game)

    # Hold cars from both players before giving them to the winner
    @pot = []

    # twoPlayer?
    @twoPlayer = twoPlayer

    # Players
    @players =
      one: new Player(this, nameOne, 'one')
      two: @initPlayerTwo(twoPlayer, nameTwo)

    # All Cars
    @cars = @getCars()

    # All Countries
    @countries = @getCountries()

    # Current Player
    @currentPlayer = "one"

    # Deal Cars
    @dealCars()

    # Setup Game
    @setupGame()

  # Init player 2
  initPlayerTwo: (twoPlayer, nameTwo) ->
    return new Player(this, nameTwo, 'two') if twoPlayer
    new Computer(this, nameTwo, 'two')

  # Get a player (one or two)
  getPlayer: (which) ->
    @players[which]

  # Retrieve the current player
  getCurrentPlayer: ->
    @getPlayer(@currentPlayer)

  # Set the current player
  setCurrentPlayer: (player) ->
    @currentPlayer = player

  # Get cars (shuffles the array too)
  getCars: ->
    cars = []
    for data in @constructor.carData
      cars.push new Car(data)
    _shuffle cars

  # Get countries
  getCountries: ->
    countries = {}
    for data in @constructor.countryData
      country = new Country(data)
      countries[country.id] = country
    countries

  # Deal cars to the players
  dealCars: ->
    length = @cars.length
    half = length/2

    # Deal our cars to each player
    @players.one.cars = @cars.slice 0, half
    @players.two.cars = @cars.slice half, length

  # Allocate cars after a round
  allocateCars: (drawn) ->
    if drawn
      # Put current cards to back of the stack
      @players.one.pushCar(@players.one.shiftCar())
      @players.two.pushCar(@players.two.shiftCar())
    else
      # Take each players car and put them in the pot
      @pot.push(@players.one.shiftCar())
      @pot.push(@players.two.shiftCar())

      # Reassign cars to the winner
      @getCurrentPlayer().cars.push @pot...

      # Clear the pot
      @pot = []

  # Hide card not in play
  showBlank: ->
    if @currentPlayer is 'one'
      @players.two.hideCard()
    else
      @players.one.hideCard()

  # Check Computer
  checkComputer: (interactive = true) ->
    return if @twoPlayer
    return unless @currentPlayer is 'two'
    return unless interactive

    chosen = @getCurrentPlayer().choose()

    setTimeout =>
      @handleStatChoice(chosen)
    , 1000

  # Handle chosing of a stat.
  handleStatChoice: (stat) ->
    @getCurrentPlayer().showCard false, stat
    @checkComputer false

    if @currentPlayer is 'one'
      @delayShow @players.two, stat
    else
      @delayShow @players.one, stat

    @delayCompare stat

  # Compare Cars
  compareCars: (stat) ->
    carA = @players.one.currentCar()
    carB = @players.two.currentCar()
    draw = false

    comparitor = new CarComparitor(carA, carB)
    result = comparitor.compare(stat)

    if result is false
      draw = true
      data =
        text: "Draw"
    else if result is carA
      @setCurrentPlayer 'one'
      data =
        text: "Player 1 Wins"
        class: "left"
    else
      @setCurrentPlayer 'two'
      data =
        text: "Player 2 Wins"
        class: "right"

    # Allocate cars (to winner, or if drawn to the back of the pack)
    @allocateCars draw

    @app.flash.set data

    setTimeout =>
      @updateScore()
    , 2500

  # Delay showCard
  delayShow: (player, stat) ->
    @constructor.carTimer = setTimeout =>
      player.showCard false, stat
      @checkComputer false
    , 500

  # Delay compare
  delayCompare: (stat) ->
    @constructor.compareTimer = setTimeout =>
      @compareCars(stat)
    , 1500

  # Update Score
  updateScore: ->
    @app.flash.clear()

    p1 = @players.one
    p2 = @players.two

    p1.updateScore()
    p2.updateScore()

    if p1.lost()
      p2.score++
      @prompt p2
    else if p2.lost()
      p1.score++
      @prompt p1
    else
      @getCurrentPlayer().showCard()
      @checkComputer()
      @showBlank()

  # Prompt another
  prompt: (winner) ->
    msg = "#{winner.name} has won this game. Do you want to play again?"
    if confirm(msg)
      @setupGame()
    else
      @endGame()

  # End Game
  endGame: ->
    window.location.hash = ''
    window.location.reload()

  # Setup Game
  setupGame: ->
    scope = this

    $('.card').on 'click', '.stat', ->
      scope.handleStatChoice $(this).prop('id')

    # initialise scores
    @updateScore()

    unless @twoPlayer
      clearTimeout @constructor.carTimer
      clearTimeout @constructor.compareTimer

    if @currentPlayer is 'one'
      # Show P1's Card, Hide P2's Card
      @players.one.showCard()
      @checkComputer()
    else
      # Show P2's Card, Hide P1's Card
      # If not two player, don't want interactive card
      @players.two.showCard(@twoPlayer)
      @checkComputer(@twoPlayer)

    @showBlank()
