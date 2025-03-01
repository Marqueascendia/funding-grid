const Filters = require("../models/filters");


const getFilters = async (req, res) => {
  try {
    const filters = await Filters.find();
    res.status(200).json({ filters : filters });
  } catch (error) {
    console.error("error in get filters", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateFilters = async (req, res) => {
  try {
    const { value, _id } = req.body;

    if(!_id || !value) {
      return res.status(400).json({ error: "ID and value are required" });
    }

    const filter = await Filters.findById(_id);

    if (!filter) {
      return res.status(404).json({ error: "Filters not found" });
    }

    filter.value.push(value);

    const updatedFilters = await filter.save();

    res.status(200).json({filters: updatedFilters});
  } catch (error) {
    console.error("Error in update filters:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createFilter = async (req, res) => {
  try {
    const { name, value } = req.body;
    const filter = await Filters.create({ name, value });
    res.status(200).json({ filter: filter });
  } catch (error) {
    console.error("error in create filter", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getFilters, updateFilters, createFilter };
