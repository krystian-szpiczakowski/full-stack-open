const Content = (props) => {
    const part1 = props.parts[0]
    const part2 = props.parts[1]
    const part3 = props.parts[2]

    return <>
        <Part details={part1}/>
        <Part details={part2}/>
        <Part details={part3}/>
    </>
}

const Part = (props) => {
    const details = props.details
    return <p>{details.name} {details.exercises}</p>
}

export default Content