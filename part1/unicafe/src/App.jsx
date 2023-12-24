import { useState } from 'react'
import Header from './Header'
import Button from './Button'
import Statistics from './Statistics'

function App() {
  const [good, setGood] = useState(0) 
  const [neutral, setNeutral] = useState(0) 
  const [bad, setBad] = useState(0) 

  const goodClickHandler = () => {
    setGood(good + 1)
  }

  const neutralClickHandler = () => {
    setNeutral(neutral + 1)
  }

  const badClickHandler = () => {
    setBad(bad + 1)
  }

  const goodFeedbackLabel = "good"
  const neutralFeedbackLabel = "neutral"
  const badFeedbackLabel = "bad"

  const groups = {
    good: {totalCount: good},
    neutral: {totalCount: neutral},
    bad: {totalCount: bad}
  }

  return (
    <div>
      <Header />
      <Button text={goodFeedbackLabel} clickHandler={goodClickHandler}/>
      <Button text={neutralFeedbackLabel} clickHandler={neutralClickHandler}/>
      <Button text={badFeedbackLabel} clickHandler={badClickHandler}/>
      <Statistics feedbackGroups={groups}/>
    </div>
  )
}

export default App
