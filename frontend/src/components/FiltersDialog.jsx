import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function FiltersDialog({
  open,
  setOpen,
  setFilters,
  handleApply,
  existingFilters,
  filters,
  setExistingFilters,
}) {
  const { register, getValues, watch } = useForm();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("fundingGridToken");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState("");

  // Watch the new filter input
  const newFilterValue = watch('newFilter');

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

  function handleReset() {
    setFilters((prev) => prev.map((filter) => ({ ...filter, value: [] })));
  }

  async function handleAddFilter({ ft, item }) {
    // Prevent adding empty or already existing values
    if (!item || ft.value.includes(item)) return;

    setLoading(true);
    setLoadingType(ft.name);
    try {
      const response = await axios.post(
        `${baseUrl}/update-filter`,
        {
          value: item,
          _id: ft._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );
      if (response.status === 200) {
        setExistingFilters?.((prev) =>
          prev.map((f) =>
            f._id === ft._id ? { ...f, value: [...f.value, item] } : f
          )
        );
        toast.success("Filter added successfully");
      } else {
        toast.error(response.data.error || "Error adding filter");
      }
    } catch (error) {
      toast.error("Error adding filter");
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  }

  async function handleAddNewFilter({ item }) {
    // Prevent adding empty filter
    if (!item) return;

    setLoading(true);
    setLoadingType("newFilter");
    try {
      const response = await axios.post(`${baseUrl}/create-filter`, {
        name: item,
      });
      if (response.status === 200) {
        setExistingFilters?.((prev) => [...prev, response.data.filter]);
        toast.success("Filter added successfully");
      } else {
        toast.error(response.data.error || "Error adding filter");
      }
    } catch (error) {
      toast.error("Error adding filter");
    } finally {
      setLoading(false);
      setLoadingType("");
    }
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-5xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle className="flex justify-between gap-5 mb-5">
              <div className="flex gap-4">
                <div className="font-bold text-2xl">Filters</div>
                <div className="flex border text-black border-zinc-600 rounded-md gap-2">
                  <input
                    {...register('newFilter')}
                    placeholder="Add name of new filter"
                    type="text"
                    className="px-2 py-[6px] focus:outline-none"
                  />
                  <button
                    disabled={loading || !newFilterValue}
                    onClick={() =>
                      handleAddNewFilter({
                        item: getValues('newFilter'),
                      })
                    }
                    className={`rounded-md py-[6px] px-4 text-white cursor-pointer 
                      ${loading || !newFilterValue 
                        ? 'bg-zinc-400 cursor-not-allowed' 
                        : 'bg-zinc-800'}`}
                  >
                    {loadingType === 'newFilter' ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
              <div className="flex gap-6">
                <button
                  className="bg-zinc-800 rounded-lg p-2 px-4 text-white cursor-pointer"
                  onClick={() => handleReset()}
                >
                  Reset
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer p-2"
                >
                  X
                </button>
              </div>
            </DialogTitle>

            <div className="flex flex-col gap-8">
              {existingFilters.map((ft, i) => {
                // Watch the input for each filter
                const filterValue = watch(ft.name);
                
                return (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="font-semibold text-lg">{ft.name}</div>
                      <div className="flex border text-black border-zinc-600 rounded-md gap-2">
                        <input
                          {...register(ft.name)}
                          placeholder={`Add ${ft.name}`}
                          type="text"
                          className="px-2 py-[6px] focus:outline-none"
                        />
                        <button
                          disabled={loading || !filterValue || ft.value.includes(filterValue)}
                          onClick={() =>
                            handleAddFilter({
                              ft,
                              item: getValues(ft.name),
                            })
                          }
                          className={`rounded-md py-[6px] px-4 text-white cursor-pointer 
                            ${(loading || !filterValue || ft.value.includes(filterValue)) 
                              ? 'bg-zinc-400 cursor-not-allowed' 
                              : 'bg-zinc-800'}`}
                        >
                          {loadingType === ft.name ? 'Adding...' : 'Add'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-4 gap-4">
                        {ft?.value?.map((item, index) => (
                          <button
                            key={index}
                            className={` text-white px-3 py-2 rounded-md cursor-pointer ${
                              filters
                                ?.find((filter) => filter._id === ft._id)
                                ?.value?.includes(item)
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
                );
              })}
            </div>

            <div className="w-full grid grid-cols-2 gap-6 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="border border-zinc-600 rounded-lg p-2 text-xl cursor-pointer "
              >
                cancel
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  handleApply();
                }}
                className="border bg-zinc-800 cursor-pointer rounded-lg p-2 text-xl text-white"
              >
                Apply
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}