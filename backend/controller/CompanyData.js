const Company = require("../models/Data");
const { convertToCamelCase, normalizeWebsite } = require("../utilities/helper");


const countDuplicates = async (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data array" });
    }

    // Convert input data to camelCase format
    const formattedData = data.map(convertToCamelCase);

    const existingWebsites = new Set(
      (await Company.find()).map((item) => normalizeWebsite(item.website))
    );

    const duplicates = formattedData.filter((item) => existingWebsites.has(normalizeWebsite(item.website)));

    const count = duplicates.length;

    res.status(200).json({ count });
  } catch (error) {
    console.error("error in count duplicates API", error.message);
    res
      .status(500)
      .json({ message: "Error counting duplicates", error: error.message });
  }
}

const uploadCompanyData = async (req, res) => {
  try {
    let { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data array" });
    }

    // Convert input data to camelCase format
    const formattedData = data.map(convertToCamelCase);

    const existingWebsites = new Set(
      (await Company.find()).map((item) => normalizeWebsite(item.website))
    );

    const uniqueData = formattedData.filter((item) => {
      const normalizedWebsite = normalizeWebsite(item.website);
      if (!existingWebsites.has(normalizedWebsite)) {
        existingWebsites.add(normalizedWebsite);
        // item.website = normalizedWebsite; // Store normalized website
        return true;
      }
      return false;
    });

    await Company.insertMany(uniqueData);
    res.status(200).json({ message: "CSV data uploaded successfully" });
  } catch (error) {
    console.error("error in upload data APi", error.message);
    res
      .status(500)
      .json({ message: "Error uploading data", error: error.message });
  }
};


const uploadSingle = async (req, res) => {
  try {
    const data = req.body

    const existingWebsites = new Set(
      (await Company.find()).map((item) => normalizeWebsite(item.website))
    );

    if(existingWebsites.has(normalizeWebsite(data.website))){
      return res.status(401).json({error : 'already present in database'})
    }

    const company = new Company(data);
    await company.save();
    res.status(200).json({ error : "Company added successfully!" });
  } catch (error) {
    res.status(500).json({ error : "Error adding company", message: error.message });
  }
}

const getCompanyData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const { ft, searchTerm } = req.query;

    // Create an array for $or conditions
    const orConditions = [];

    if(ft){
      Object.keys(ft).forEach(key => {
        orConditions.push({ [key]: { $in: Array.isArray(ft[key]) ? ft[key] : [ft[key]] } });
      })
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm, "i"); // Case-insensitive regex
    
      Object.keys(Company.schema.paths).forEach(key => {
        if (key === "_id") return
        const schemaType = Company.schema.paths[key].instance;
        
        if (schemaType === "String") {
          orConditions.push({ [key]: { $regex: regex} });
        } else if (schemaType === "Array") {
          orConditions.push({ [key]: { $elemMatch: { $regex: regex } } })
        }
      });
    }
    
    // Construct the final query
    const filters = orConditions.length > 0 ? { $or: orConditions } : {};

    const skip = (page - 1) * limit;

    const totalCount = await Company.countDocuments(filters);
    const data = await Company.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ data, totalCount });
  } catch (error) {
    console.error("error in fetch data API", error.message);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};


const getDownloadData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    if (isNaN(limit) || limit <= 0) {
      limit = undefined; 
    }

    const totalCount = await Company.countDocuments();
    const data = await Company.find()
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ data, totalCount });
  } catch (error) {
    console.error("error in fetch data API", error.message);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

const deleteCompanyData = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Company.findByIdAndDelete(id);
    if(!deletedData){
      return res.status(404).json({ error : "data not found" });
    }
    res.status(200).json({ message: "data deleted successfully" });
  } catch (error) {
    console.error("error in delete data API", error.message);
    res
      .status(500)
      .json({ message: "Error deleting data", error: error.message });
  }
}

const updateCompanyData = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const updatedData = await Company.findByIdAndUpdate(id, data, { new: true });
    if(!updatedData){
      return res.status(404).json({ error : "data not found" });
    }
    res.status(200).json({ message: "data updated successfully", data: updatedData });
  } catch (error) {
    console.error("error in update data API", error.message);
    res
      .status(500)
      .json({ message: "Error updating data", error: error.message });
  }
}


module.exports = { uploadCompanyData, getCompanyData, uploadSingle, getDownloadData, deleteCompanyData, updateCompanyData, countDuplicates };
