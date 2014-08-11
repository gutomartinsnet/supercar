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
