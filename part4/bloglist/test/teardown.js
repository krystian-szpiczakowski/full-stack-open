const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connection.close(true);
    } finally {
        process.exit(0);
    }
}