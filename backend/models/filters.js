const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: [String],
        default: [],
    },
});

const Filters = mongoose.model("Filters", schema);

module.exports = Filters;
