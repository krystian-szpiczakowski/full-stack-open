const Statistics = ({ feedbackGroups }) => {
  const { good, neutral, bad } = feedbackGroups;

  const goodCounts = isNaN(good.totalCount) ? 0 : good.totalCount;
  const badCounts = isNaN(bad.totalCount) ? 0 : bad.totalCount;
  const neutralCounts = isNaN(neutral.totalCount) ? 0 : neutral.totalCount;

  const allCount = goodCounts + neutralCounts + badCounts;

  const average = allCount === 0 ? 0 : (goodCounts - badCounts) / allCount;
  const goodPercentage = allCount === 0 ? 0 : (goodCounts / allCount) * 100;

  if (allCount === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text={"good"} value={good.totalCount} />
            <StatisticLine text={"neutral"} value={neutral.totalCount} />
            <StatisticLine text={"bad"} value={bad.totalCount} />

            <StatisticLine text={"all"} value={allCount} />
            <StatisticLine text={"average"} value={average} />
            <StatisticLine text={"positive"} value={goodPercentage + "%"} />
          </tbody>
        </table>
      </div>
    );
  }
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

export default Statistics;
