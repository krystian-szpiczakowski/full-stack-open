const Footer = (props) => {
  const totalExercises = props.parts
    .map((part) => part.exercises)
    .reduce((accumulator, current) => accumulator + current);

  return <p>Number of exercises {totalExercises}</p>;
};

export default Footer;