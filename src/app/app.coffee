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




class Game
  constructor: ->
    # Hold cars from both players before giving them to the winner
    @pot = []

    # Hold players
    @players = []

    # All Cars
    @cars = @getCars()

    # All Countries
    @countries = @getCountries()

  getCars: ->
    cars = []
    for data in @constructor.carData
      cars.push new Car(data)
    _shuffle cars

  getCountries: ->
    countries = {}
    for data in @constructor.countryData
      country = new Country(data)
      countries[country.id] = country
    countries

  dealCars: ->
    # Deal our cars to each player


# Representation of a Player
class Player
  constructor: (@name) ->
    @cars = []
    @score = 0

# Representation of a Car
class Car
  constructor: (data) ->
    [@image, @name, @country, @speed, @sixty, @power, @engine, @weight] = data

# Representation of a Country
class Country
  constructor: (data) ->
    [@image, @name] = data

    @id = @image

