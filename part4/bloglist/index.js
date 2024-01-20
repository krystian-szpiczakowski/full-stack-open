import config from "./util/config.js";
import app from "./app.js";

const { PORT } = config;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
