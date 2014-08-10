###
# Copyright 2014 Chris Barber (email: chris@chris-barber.co.uk)
#
# This program is free software, you can redistribute it and/or modify
# it under the terms of the GNU General Public License, version 2, as
# published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY, without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program, if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
###
class App
  constructor: ->
    @flash = new Flash()

class Game
  constructor: (nameOne, nameTwo, twoPlayer) ->
    # Hold cars from both players before giving them to the winner
    @pot = []

    # Players
    @players =
      one: new Player(nameOne)
      two: @initPlayerTwo(twoPlayer, nameTwo)

    # All Cars
    @cars = @getCars()

    # All Countries
    @countries = @getCountries()

    # Current Player
    @currentPlayer = "one"

    # Deal Cars
    @dealCars()

  # Init player 2
  initPlayerTwo: (twoPlayer, nameTwo) ->
    return new Player(nameTwo) if twoPlayer
    new Computer(nameTwo)

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

# Representation of a Player
class Player
  constructor: (@name) ->
    @cars = []
    @score = 0

  currentCar: ->
    @cars[0]

# Representation of the Computer
class Computer extends Player
  # Best stat
  bestStat: ->
    car = @currentCar()
    return "speed" if car.speed > 199
    return "sixty" if car.tenSixty < 40
    return "power" if car.power > 450
    return "engine" if car.engine > 5000
    return "weight" if car.weight < 1200
    false

  # OK stat
  okStat: ->
    car = @currentCar()
    return "speed" if car.speed > 180
    return "sixty" if car.tenSixty < 46
    return "power" if car.power > 350
    return "engine" if car.engine > 4000
    return "weight" if car.weight < 1350
    false

  # Random stat
  randomStat: ->
    stats = Car.stats
    random = Math.floor(Math.random() * stats.length)
    stats[random]

  # Choose stat
  chooseStat: ->
    [best, ok, random] = [@bestStat(), @okStat(), @randomStat()]
    return best if best
    return ok if ok
    random

# Representation of a Car
class Car
  @stats = ["speed", "sixty", "power", "engine", "weight"]
  @gt = ["speed", "power", "engine"]
  @lt = ["sixty", "weight"]

  constructor: (data) ->
    [ @image, @name, @country, @speed,
      @tenSixty, @power, @engine, @weight] = data
    @sixty = @tenSixty / 10

# Representation of a Country
class Country
  constructor: (data) ->
    [@image, @name] = data

    @id = @image

# Flash
class Flash
  constructor: ->
    @$html = $('#flash')

  clear: ->
    @set()

  set: (msg = '') ->
    @$html.html msg

# CarComparitor
class CarComparitor
  constructor: (@carA, @carB) ->

  compare: (stat) ->
    return false if @carA[stat] is @carB[stat]

    if stat in Car.gt
      return @carB if @carB[stat] > @carA[stat]
    else if stat in Car.lt
      return @carB if @carB[stat] < @carA[stat]

    @carA
