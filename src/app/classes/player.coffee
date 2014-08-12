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
# Representation of a Player
class Player
  constructor: (@game, @name, @id) ->
    @cars = []
    @score = 0
    @$card = $(".card##{@id}")

  currentCar: ->
    @cars[0]

  scoreData: ->
    name: @name
    games: @score
    cards: @cars.length

  shiftCar: ->
    @cars.shift()

  pushCar: (car) ->
    @cars.push(car)

  hideCard: ->
    @$card.html ''

  showCard: (interactive = true, selected = '') ->
    classes =
      speed: ''
      sixty: ''
      power: ''
      engine: ''
      weight: ''

    classes[selected] = 'selected' unless selected is ''

    car = @currentCar()

    data =
      car: car
      country: @game.countries[car.country]
      interactive: interactive
      classes: classes

    @$card.html App.templates.card(data)

    return if @game.twoPlayer
    return unless @game.currentPlayer is 'two'
    return unless interactive

    @game.computerChooseStat()
