import { useState, useEffect } from "react";
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
  const [filters, setFilters] = useState([]);

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const ft = {};
      if (filters.length > 0) {
        filters.forEach((filter) => {
          ft[filter.name] = filter.value;
        });
      }
      const res = await axios.get(`${baseUrl}/data`, {
        params: { limit: totalRecords, ft },
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

  function handleFilter(ft, item, index) {
    let newValues = filters[index].value || [];
    if (newValues.includes(item)) {
      newValues = newValues.filter((i) => i !== item);
    } else {
      newValues = [...newValues, item];
    }
    setFilters((prev) =>
      prev.map((f) => (f._id === ft._id ? { ...f, value: newValues } : f))
    );
  }

  useEffect(() => {
    if (existingFilters) {
      setFilters(existingFilters.map((filter) => ({
      ...filter,
      value: []
    })));
    }
  }, [existingFilters]);

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

              {existingFilters?.map((ft, i) => (
                <>
                  <div key={i} className="flex flex-col gap-4 ">

                    <div className="font-semibold text-lg">{ft.name}</div>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-4 gap-4">
                        {ft?.value?.map((item, index) => (
                          <button
                            key={index}
                            className={` text-white px-3 py-2 rounded-md cursor-pointer ${
                              filters?.length > 0
                                && filters
                                    ?.find((filter) => filter._id === ft._id)
                                    .value?.includes(item)
                                ? "bg-zinc-700"
                                : "bg-zinc-400"
                            }`}
                            onClick={() => handleFilter(ft, item, i)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ))}

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
