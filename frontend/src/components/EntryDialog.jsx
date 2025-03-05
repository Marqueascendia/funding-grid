import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Loader } from "lucide-react";
import MultiSelectDropdown from "./MutiSelect";

export default function EntryDialog({
  open,
  setOpen,
  existingFilters,
  data,
  handleAction,
  loading,
  title,
}) {
  const initialState = {
    companyName: data?.companyName || "",
    date: data?.date || "",
    email: data?.email || "",
    firstName: data?.firstName || "",
    formSubmission: data?.formSubmission || "",
    industry: data?.industry || [],
    investingFields: data?.investingFields || [],
    lastName: data?.lastName || "",
    linkedIn: data?.linkedIn || "",
    title: data?.title || "",
    website: data?.website || "",
    country: data?.country || [],
    investorName: data?.investorName || "",
    investorType: data?.investorType || [],
    investmentStage: data?.investmentStage || [],
    industryFocus: data?.industryFocus || [],
    investmentSize: data?.investmentSize || [],
    geographicFocus: data?.geographicFocus || [],
    investmentCriteria: data?.investmentCriteria || [],
    exitStrategy: data?.exitStrategy || [],
    industrySubcategory: data?.industrySubcategory || [],
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    handleAction(setFormData, formData, data?._id);
  }

  useEffect(() => {
    setFormData(initialState);
  }, [data]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-3xl">
            <DialogTitle className="text-2xl font-bold text-center mb-5">{title}</DialogTitle>
            <div className="bg-white p-6 max-w-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(initialState).map((key) => (
                    Array.isArray(formData[key]) ? (
                      <MultiSelectDropdown key={key} formData={formData} name={key} options={existingFilters?.find((item) => item.name === key)?.value} />
                    ) : (
                      <input
                        key={key}
                        type="text"
                        name={key}
                        placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                        value={formData[key]}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                      />
                    )
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    type="button"
                    className="border border-zinc-800 text-zinc-800 py-2 px-4 rounded-md hover:bg-gray-100 transition"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-zinc-800 text-white py-2 px-4 rounded-md hover:bg-zinc-700 transition"
                  >
                    {loading ? <Loader className="animate-spin" /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}