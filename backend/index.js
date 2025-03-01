const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Company = require("./models/Data");
const dotenv = require("dotenv");
const { uploadCompanyData, getCompanyData, uploadSingle, getDownloadData, deleteCompanyData, updateCompanyData, countDuplicates } = require("./controller/CompanyData");
const { signup, login } = require("./controller/auth");
const { verifyUser } = require("./utilities/middleware");
const { getFilters, updateFilters, createFilter } = require("./controller/filters");
const { getDbUtils } = require("./controller/dbUtils");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

connectToDatabase();

app.get('/api/db', verifyUser, getDbUtils)

// Auth Routes
// app.post("/signup", signup);
app.post("/login", login);

// company data routes
app.post("/count-duplicates", verifyUser, countDuplicates);
app.post("/upload-csv",verifyUser, uploadCompanyData);
app.post("/api/single-upload", verifyUser, uploadSingle);
app.delete("/delete-entry/:id", verifyUser, deleteCompanyData);
app.put("/update-entry/:id", verifyUser, updateCompanyData);

// Fetch existing data
app.get("/data", verifyUser, getCompanyData);
app.get("/download-data", verifyUser, getDownloadData);

// Filters routes
app.post("/create-filter", createFilter);
app.get("/filters", verifyUser, getFilters);
app.post("/update-filter", verifyUser, updateFilters);

app.listen(5000, () => console.log("Server running on port 5000"));
