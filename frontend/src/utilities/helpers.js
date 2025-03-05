export const uploadFormatDownload = async () => {
  const data = [
    {
      companyName: "Tech Innovations Ltd",
      website: "https://techinnovations.com",
      industry: ["Technology", "AI", "Fintech"],
      investingFields: ["Blockchain", "Cybersecurity"],
      firstName: "John",
      lastName: "Doe",
      title: "Managing Partner",
      email: "john.doe@techinnovations.com",
      linkedIn: "https://www.linkedin.com/in/johndoe",
      date: "2025-03-05",
      country: ["USA", "Canada"],
      investorName: "John Doe",
      investorType: ["Venture Capitalist", "Angel Investor"],
      investmentStage: ["Seed", "Series A", "Series B"],
      investmentSize: ["$100K - $500K", "$1M - $5M"],
      industryFocus: ["Artificial Intelligence", "Green Tech"],
      geographicFocus: ["North America", "Europe"],
      investmentCriteria: ["Scalability", "Revenue-generating startups"],
      exitStrategy: ["IPO", "Acquisition"],
      industrySubcategory: ["Machine Learning", "Renewable Energy"],
    },
  ];

  const headers = [
    "Company Name",
    "Website",
    "Industry",
    "Investing Fields",
    "First Name",
    "Last Name",
    "Title",
    "Email",
    "LinkedIn",
    "Date",
    "Country",
    "Investor Name",
    "Investor Type",
    "Investment Stage",
    "Investment Size",
    "Industry Focus",
    "Geographic Focus",
    "Investment Criteria",
    "Exit Strategy",
    "Industry Subcategory",
  ];

  const csvRows = data.map((row) =>
    [
      row.companyName,
      row.website,
      row.industry,
      row.investingFields,
      row.firstName,
      row.lastName,
      row.title,
      row.email,
      row.linkedIn,
      row.date,
      row.country,
      row.investorName,
      row.investorType,
      row.investmentStage,
      row.investmentSize,
      row.industryFocus,
      row.geographicFocus,
      row.investmentCriteria,
      row.exitStrategy,
      row.industrySubcategory,
    ]
      .map((value) => `"${value}"`)
      .join(",")
  );

  const csvString = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `upload_format.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
