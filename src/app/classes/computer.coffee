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
