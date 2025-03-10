const convertToCamelCase = (data) => {
  const getString = (key) => data[key] || data[key.toLowerCase()] || "";
  const getArray = (key) =>
    data[key] || data[key.toLowerCase()]
      ? data[key].split(",").map((field) => field.trim())
      : [];

  return {
    companyName: getString("Company Name"),
    website: getString("Website"),
    formSubmission: getString("Form Submission"),
    industry: getArray("Industry"),
    investingFields: getArray("Investing Fields"),
    firstName: getString("First Name"),
    lastName: getString("Last Name"),
    title: getString("Title"),
    email: getString("Email"),
    linkedIn: getString("LinkedIn"),
    date: getString("Date"),
    country: getArray("Country"),
    investorName: getString("Investor Name"),
    investorType: getArray("Investor Type"),
    investmentStage: getArray("Investment Stage"),
    investmentSize: getArray("Investment Size"),
    industryFocus: getArray("Industry Focus"),
    geographicFocus: getArray("Geographic Focus"),
    investmentCriteria: getArray("Investment Criteria"),
    exitStrategy: getArray("Exit Strategy"),
    industrySubcategory: getArray("Industry Subcategory"),
  };
};


const normalizeWebsite = (url) => {
  // Remove http/https and www prefixes
  let normalized = url
    .replace(/(https?:\/\/)?(www\.)?/g, "")
    .toLowerCase()
    .trim();

  normalized = normalized.replace(/\/+$/, "");

  const parts = normalized.split(".");

  if (parts.length >= 2) {
    const mainDomain = parts[parts.length - 2];
    return mainDomain;
  }

  return normalized;
};

module.exports = { convertToCamelCase, normalizeWebsite };
