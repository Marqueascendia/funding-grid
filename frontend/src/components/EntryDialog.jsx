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
    industry: data?.industry || "",
    investingFields: data?.investingFields || "",
    lastName: data?.lastName || "",
    linkedIn: data?.linkedIn || "",
    title: data?.title || "",
    website: data?.website || "",
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
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-3xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <DialogTitle className="text-2xl font-bold text-center mb-5">
                {title}
              </DialogTitle>
              <div className="bg-[#ffffff] p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      name="date"
                      placeholder="Date"
                      value={formData.date}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={formData.title}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <MultiSelectDropdown formData={formData} name="industry" options={existingFilters?.find((item) => item.name === "industry")?.value}/>
                    <MultiSelectDropdown formData={formData} name="investingFields" options={existingFilters?.find((item) => item.name === "investingFields")?.value}/>
                    <input
                      type="text"
                      name="website"
                      placeholder="Website"
                      value={formData.website}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <input
                      type="text"
                      name="linkedIn"
                      placeholder="LinkedIn"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      className="border p-2 rounded w-full"
                    />
                    <textarea
                      name="formSubmission"
                      placeholder="Form Submission"
                      value={formData.formSubmission}
                      onChange={handleChange}
                      className="border p-2 rounded w-full col-span-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 ">
                    <button
                      type="button"
                      className="border border-zinc-800 text-zinc-800 py-2 px-4 rounded-md hover:bg-gray-100 transition flex justify-center items-center cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-zinc-800 text-white py-2 px-4 rounded-md hover:bg-zinc-700 transition flex justify-center items-center cursor-pointer"
                    >
                      {loading ? <Loader className="animate-spin" /> : "submit"}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
