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
## Intro Manager
class Intro
  constructor: (app) ->
    @app = app
    @intro = App.templates.intro()
    @$intro = $(@intro)

    @app.$arena.html(@intro)

    $('.oneplayer').on 'click', (ev) =>
      ev.preventDefault()
      @handleSelected false

    $('.twoplayer').on 'click', (ev) =>
      ev.preventDefault()
      @handleSelected true

  # @param {Boolean} twoPlayer
  handleSelected: (twoPlayer) ->
    nameOne = $('#player1').val()
    nameTwo = if twoPlayer then $('#player2').val() else "Computer"

    unless @validateName nameOne
      alert("Please enter a valid name for Player 1 (maximum 10 characters)")
      return
    unless @validateName nameTwo
      alert("Please enter a valid name for Player 2 (maximum 10 characters)")
      return
    if nameOne is nameTwo
      alert("Player 1 and Player 2 must have different names, try again.")
      return
    return @prepareGame nameOne, nameTwo, false


  prepareGame: (one, two, twoPlayer) ->
    @app.game = new Game(@app, one, two, twoPlayer)
  
  validateName: (name) ->
    name isnt '' and name.length <= 10
