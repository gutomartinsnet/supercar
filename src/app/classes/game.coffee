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

  # Setup Game
  setupGame: ->
    scope = this

    $('.card').on 'click', '.stat', ->
      scope.chooseStat $(this).prop('id')

    # initialise scores
    @updateScore()

    unless @twoPlayer
      clearTimeout @constructor.carTimer
      clearTimeout @constructor.compareTimer

    if @currentPlayer is 'one'
      # Show P1's Card, Hide P2's Card
      @players.one.showCard()
    else
      # Show P2's Card, Hide P1's Card
      # If not two player, don't want interactive card
      @players.two.showCard(@twoPlayer)

    @showBlank()
