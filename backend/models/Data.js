const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: { type: String },
  date: { type: String },
  email: { type: String },
  firstName: { type: String },
  formSubmission: { type: String },
  industry: { type: [String] },
  investingFields: { type: [String] },
  lastName: { type: String },
  linkedIn: { type: String },
  title: { type: String },
  website: { type: String },
  country: { type: [String] },
  investorName: { type: String },
  investorType: { type: [String] },
  investmentStage: { type: [String] },
  industryFocus: { type: [String] },
  investmentSize: { type: [String] },
  geographicFocus: { type: [String] },
  investmentCriteria: { type: [String] },
  exitStrategy: { type: [String] },
  industrySubcategory: { type: [String] },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
