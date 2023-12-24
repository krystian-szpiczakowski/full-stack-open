import { useState } from 'react'
import Button from "./Button"
import anecdotes from './Anecdotes'

const App = () => {  
  const [statefulAnecdotes, setStatefulAnecdotes] = useState(anecdotes)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [topAnecdote, setTopAnecdote] = useState(getTopAnecdote())
  
  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * statefulAnecdotes.length)
    setSelectedIndex(randomIndex)
  }

  const handleVote = () => {
    const copyAnecdotes = [...statefulAnecdotes]

    const anecdote = copyAnecdotes[selectedIndex]
    if (anecdote.votes === null || isNaN(anecdote.votes)) {
      anecdote.votes = 1
    } else {
      anecdote.votes++  
    }

    setStatefulAnecdotes(copyAnecdotes)
    setTopAnecdote(getTopAnecdote())
  }

  function getTopAnecdote() {
    const tempAnecdotes = [...statefulAnecdotes]
    const sorted = tempAnecdotes
    .sort((a, b) => {
      a.votes = isNaN(a.votes) || a.votes === null ? 0 : a.votes
      b.votes = isNaN(b.votes) || b.votes === null ? 0 : b.votes

      return b.votes - a.votes
    })
  
    const topp = sorted[0]
  
    return topp
  }

  const formatVote = anecdote => {
    return anecdote.votes === null || isNaN(anecdote.votes) ? 0 : anecdote.votes
  }

  const selectedAnecdote = statefulAnecdotes[selectedIndex]

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{selectedAnecdote.text}</p>
      <p>has {formatVote(selectedAnecdote)} votes</p>
      <Button text="Vote" clickHandler={handleVote}/>
      <Button text="Random anecdote" clickHandler={handleClick}/>

      <h1>Anecdote with most votes</h1>
      <p>{topAnecdote.text}</p>
    </div>
  )
}

export default App