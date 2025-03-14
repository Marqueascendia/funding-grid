import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";


export default function DeleteDialog({ id, open, setOpen, setData, setTotalCount }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("fundingGridToken");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`${baseUrl}/delete-entry/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: function (status) {
          return status < 500;
        },
      });
      if (response.status === 200) {
        setData?.((prevData) => prevData.filter((item) => item._id !== id));
        setTotalCount?.((prevCount) => prevCount - 1);
        toast.success("Entry deleted successfully");
        setOpen(false);
      } else {
        toast.error(response.data.error || "Error deleting entry");
      }
    } catch (error) {
      toast.error("Error deleting entry");
    } finally {
      setIsDeleting(false);
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
            className="relative transform overflow-hidden p-8 rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <DialogTitle className="flex justify-between gap-5 mb-5">
              <div className="font-bold text-2xl text-gray-800 text-center w-full">Delete </div>
            </DialogTitle>

            <div className="flex flex-col gap-8">
              Are you sure you want to delete this entry? This action is
              irreversible.
            </div>

            <div className="w-full grid grid-cols-2 gap-6 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="border border-zinc-600 rounded-lg p-2 cursor-pointer flex justify-center items-center"
              >
                cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="border bg-red-500 cursor-pointer rounded-lg p-2 text-gray-200 flex justify-center items-center"
              >
                {isDeleting ? <Loader className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
