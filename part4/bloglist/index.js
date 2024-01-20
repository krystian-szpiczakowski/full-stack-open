import config from "./util/config.js";
import app from "./app.js";
import logger from "./util/logger.js";

const { PORT } = config;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
