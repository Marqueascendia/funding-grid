const convertToCamelCase = (data) => {
  return {
    companyName: data["Company Name"] || "",
    website: data.Website || "",
    formSubmission: data["Form submission"] || "",
    industry: data.Industry ? data.Industry.split(",").map((field) => field.trim()) : [],
    investingFields: data["Investing Fields"]
      ? data["Investing Fields"].split(",").map((field) => field.trim())
      : [],
    firstName: data["First Name"] || "",
    lastName: data["Last Name"] || "",
    title: data.Title || "",
    email: data.Email || "",
    linkedIn: data.LinkedIn || "",
    date: data.Date || "",
  };
};

const normalizeWebsite = (url) => {
  // Remove http/https and www prefixes
  let normalized = url
    .replace(/(https?:\/\/)?(www\.)?/g, "")
    .toLowerCase()
    .trim();
  
  normalized = normalized.replace(/\/+$/, "");

  const parts = normalized.split('.');
  
  if (parts.length >= 2) {
    const mainDomain = parts[parts.length - 2];
    return mainDomain;
  }

  return normalized;
};

module.exports = { convertToCamelCase, normalizeWebsite };
