const Button = ({ text, clickHandler }) => {
  return (
    <button onClick={clickHandler} style={{ display: "block" }}>
      {text}
    </button>
  );
};

export default Button;
