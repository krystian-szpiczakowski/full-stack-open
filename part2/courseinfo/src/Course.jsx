const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Summary parts={course.parts} />
    </div>
  );
};

const Header = ({ course }) => <h2>{course}</h2>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Summary = ({ parts }) => {
  const exercisesTotal = parts
    .map((part) => part.exercises)
    .reduce((accumulator, current) => accumulator + current);

  return <p><strong>Total of {exercisesTotal} exercises</strong></p>;
};

export default Course;
