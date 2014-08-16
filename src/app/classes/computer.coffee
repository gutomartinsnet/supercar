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
# Representation of the Computer
class Computer extends Player
  # Best stat
  bestStat: ->
    @pick @bestStats()

  # OK stat
  okStat: ->
    @pick @okStats()

  # Determine the best stats
  bestStats: ->
    car = @currentCar()
    stats = []
    stats.push "speed" if car.speed > 199
    stats.push "sixty" if car.tenSixty < 40
    stats.push "power" if car.power > 450
    stats.push "engine" if car.engine > 5000
    stats.push "weight" if car.weight < 1200
    stats

  # Determine the OK stats
  okStats: ->
    car = @currentCar()
    stats = []
    stats.push "speed"  if car.speed > 180
    stats.push "sixty" if car.tenSixty < 46
    stats.push "power" if car.power > 350
    stats.push "engine" if car.engine > 4000
    stats.push "weight" if car.weight < 1350
    stats

  # Random stat
  randomStat: ->
    @pick Car.stats

  # Pick random
  pick: (choices) ->
    return false unless choices.length > 0
    choices = _shuffle(choices)
    choices.pop()

  # Choose stat
  choose: ->
    [best, ok, random] = [@bestStat(), @okStat(), @randomStat()]
    return best if best
    return ok if ok
    random
