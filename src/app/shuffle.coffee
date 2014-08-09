# Fisher-Yates shuffle in Coffeescript
#
# _shuffle(array)
#
# Returns a shuffled version of the array leaving the original untouched.
#
# Based on https://gist.github.com/ddgromit/859699#comment-57424
_shuffle = (arr) ->
  shuffled = arr || []

  i = shuffled.length
  return flase if i is 0

  while --i
    rand = Math.floor(Math.random() * (i+1))
    [shuffled[i], shuffled[rand]] = [shuffled[rand], shuffled[i]]

  shuffled
