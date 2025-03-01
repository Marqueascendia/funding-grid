import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Loader } from "lucide-react";

export default function EntryDialog({ open, setOpen, existingFilters }) {
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(5000);
  const [totalRecords, setTotalRecords] = useState(500);
  const [filtersIndustry, setFiltersIndustry] = useState([]);
  const [filtersInvestingFields, setFiltersInvestingFields] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const ft = {};  
      if (filtersIndustry.length > 0) {
        ft.industry = filtersIndustry;
      }
      if (filtersInvestingFields.length > 0) {
        ft.investingFields = filtersInvestingFields;
      }
      const res = await axios.get(`${baseUrl}/data`, {
        params: { limit: totalRecords, ...ft },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        toast.error(res.data.error || "Error downloading CSV");
        return;
      }

      const data = res.data.data;
      if (data.length === 0) {
        toast.error("No data available to download");
        return;
      }

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
      ];

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const csvRows = batch.map((row) =>
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
          ]
            .map((value) => `"${value}"`)
            .join(",")
        );

        const csvString = [headers.join(","), ...csvRows].join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `data_part_${i / batchSize + 1}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }

      toast.success("CSV files downloaded successfully");
    } catch (error) {
      toast.error(error.message || "Error downloading CSV");
    } finally {
      setLoading(false);
    }
  };

  function handleIndustry(item) {
    if (filtersIndustry.includes(item)) {
      setFiltersIndustry(filtersIndustry.filter((i) => i !== item));
    } else {
      setFiltersIndustry([...filtersIndustry, item]);
    }
  }

  function handleInvestingFields(item) {
    if (filtersInvestingFields.includes(item)) {
      setFiltersInvestingFields(
        filtersInvestingFields.filter((i) => i !== item)
      );
    } else {
      setFiltersInvestingFields([...filtersInvestingFields, item]);
    }
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-3xl">
            <DialogTitle className="text-2xl font-bold text-center mb-5">
              Download CSV
            </DialogTitle>
            <div className="bg-white p-6 max-w-2xl flex flex-col gap-6">

              {/* filter section  */}

              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg">Industry</div>
                <div className="grid grid-cols-4 gap-4">
                  {existingFilters?.industry?.map((item, index) => (
                    <button
                      key={index}
                      className={` text-white px-3 py-2 rounded-md cursor-pointer ${
                        filtersIndustry.includes(item)
                          ? "bg-zinc-700"
                          : "bg-zinc-400"
                      }`}
                      onClick={() => handleIndustry(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg">Investing Fields</div>
                <div className="grid grid-cols-4 gap-4">
                  {existingFilters?.investingFields?.map((item, index) => (
                    <button
                      key={index}
                      className={` text-white px-3 py-2 rounded-md cursor-pointer ${
                        filtersInvestingFields.includes(item)
                          ? "bg-zinc-700"
                          : "bg-zinc-400"
                      }`}
                      onClick={() => handleInvestingFields(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Total Records:
                </label>
                <input
                  type="number"
                  value={totalRecords}
                  onChange={(e) => setTotalRecords(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Records per CSV:
                </label>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-zinc-800 text-white py-2 px-8 rounded-md"
                  onClick={downloadCSV}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Download CSV"
                  )}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
