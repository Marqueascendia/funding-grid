import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Loader, PencilIcon, TrashIcon } from "lucide-react";
import EntryDialog from "./EntryDialog";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteDialog from "./DeleteDialog";
import DeleteMultipleDialog from "./DelteMultipleDialog";

const Table = ({
  fetchPage,
  loading,
  totalCount,
  currentPage,
  setCurrentPage,
  data,
  setData,
  setTotalCount,
  existingFilters,
  handlePageBtn,
  limit,
}) => {
  const [entryOpen, setEntryOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("fundingGridToken");
  const [space, setSpace] = useState(0);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleEdit(setUpdateData, updateData, id) {
    try {
      setIsUpdating(true);
      const response = await axios.put(
        `${baseUrl}/update-entry/${id}`,
        { data: updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setData?.((prevData) =>
          prevData.map((item) => (item._id === id ? response.data.data : item))
        );
        toast.success("Data updated successfully");
        setUpdateData({
          companyName: "",
          date: "",
          email: "",
          firstName: "",
          formSubmission: "",
          industry: "",
          investingFields: "",
          lastName: "",
          linkedIn: "",
          title: "",
          website: "",
        });
        setEntryOpen(false);
      } else {
        toast.error(response.data.error || "Error updating data");
      }
    } catch (error) {
      toast.error("Error updating data");
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    fetchPage({ page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    const updateSpace = () => {
      const website = document.getElementById("website");
      if (website) {
        setSpace(website.getBoundingClientRect().left);
      }
    };

    setTimeout(updateSpace, 0);

    window.addEventListener("resize", updateSpace);
    return () => window.removeEventListener("resize", updateSpace);
  }, [data]);

  // Handle checkbox selection
  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Select all rows
  const handleSelectAll = () => {
    if (Object.keys(selectedRows).length === data.length) {
      setSelectedRows({});
    } else {
      const newSelection = {};
      data.forEach((row) => {
        newSelection[row._id] = true;
      });
      setSelectedRows(newSelection);
    }
  };

  // Delete selected rows
  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    const idsToDelete = Object.keys(selectedRows).filter(
      (id) => selectedRows[id]
    );
    if (idsToDelete.length === 0) {
      toast.error("No rows selected");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/delete-multiple`,
        { ids: idsToDelete },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.filter((row) => !idsToDelete.includes(row._id))
      );
      setTotalCount((prevCount) => prevCount - idsToDelete.length);
      if (idsToDelete.length === data.length) {
        setCurrentPage(1);
        handlePageBtn(1);
      }
      toast.success("Selected rows deleted successfully");
      setSelectedRows({});
    } catch (error) {
      toast.error("Error deleting selected rows");
    } finally {
      setIsDeleting(false);
      setDeleteMultipleOpen(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-12 flex justify-center items-center w-full">
          <Loader className="animate-spin" />
        </div>
      ) : data.length > 0 ? (
        <div className="w-full justify-between flex flex-col gap-6 mb-[60px] relative">
          <button
            onClick={() => setDeleteMultipleOpen(true)}
            className="mb-2 px-4 py-2 bg-red-500 text-white rounded-md w-fit"
          >
            Delete Selected
          </button>
          <div className="content-wrapper overflow-x-scroll w-[100%]">
            <table className="w-[200%]">
              <thead className="flex border-t border-gray-300">
                <div className="sticky left-0 bg-white w-[50px] border border-gray-300 border-t-0 flex items-center justify-center">
                  <input type="checkbox" onChange={handleSelectAll} />
                </div>
                <div className="sticky left-[50px] bg-white w-[50px] ps-2 border border-gray-300 border-t-0 flex items-center">
                  S.No
                </div>
                <tr className="grid grid-cols-12 text-left w-[calc(100%-100px)]">
                  <th className="sticky left-[100px] bg-white row">
                    Company Name
                  </th>
                  <th
                    style={{ left: `${space - 68}px` }}
                    id="website"
                    className="sticky bg-white row"
                  >
                    Website
                  </th>
                  <th className="row">Form Submission</th>
                  <th className="row">Industry</th>
                  <th className="row">Investing Fields</th>
                  <th className="row">Actions</th>
                  <th className="row">Title</th>
                  <th className="row">First Name</th>
                  <th className="row">Last Name</th>
                  <th className="row">Email</th>
                  <th className="row">LinkedIn</th>
                  <th className="row">Date</th>
                </tr>
              </thead>
              <tbody className="text-left border-gray-300">
                {data.map((row, index) => (
                  <div key={index} className="flex w-full">
                    <div className="sticky left-0 bg-white w-[50px] border border-gray-300 border-t-0 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={!!selectedRows[row._id]}
                        onChange={() => handleSelectRow(row._id)}
                      />
                    </div>
                    <div className="sticky left-[50px] ps-2 bg-white w-[50px] border border-gray-300 border-t-0 flex items-center">
                      {(currentPage - 1) * limit + index + 1}
                    </div>
                    <tr className="grid grid-cols-12 items-center w-[calc(100%-100px)]">
                      <td className="row sticky left-[100px] bg-white">
                        {row.companyName}
                      </td>
                      <td
                        style={{ left: `${space - 68}px` }}
                        className="row sticky bg-white"
                      >
                        {row.website}
                      </td>
                      <td
                        onClick={() => {
                          if (row.formSubmission.length > 0) {
                            window.open(row.formSubmission, "_blank");
                          }
                        }}
                        className="cursor-pointer row underline"
                      >
                        {row.formSubmission ? row.formSubmission : "N/A"}
                      </td>
                      <td className="row">{row.industry.join(", ")}</td>
                      <td className="row">{row.investingFields.join(", ")}</td>
                      <td className="row flex gap-4">
                        <button
                          onClick={() => {
                            setFormData(row);
                            setEntryOpen(true);
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(row._id);
                            setDeleteOpen(true);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="row">{row.title}</td>
                      <td className="row">{row.firstName}</td>
                      <td className="row">{row.lastName}</td>
                      <td className="row">{row.email}</td>
                      <td className="row">{row.linkedIn}</td>
                      <td className="row">{row.date}</td>
                    </tr>
                  </div>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            fetchPage={fetchPage}
            totalCount={totalCount}
            handlePageBtn={handlePageBtn}
          />
        </div>
      ) : (
        <div className="w-full justify-center items-center flex flex-col gap-6">
          <h1 className="text-2xl font-bold">No data found</h1>
        </div>
      )}

      {/* -------------dialogs------------ */}

      <EntryDialog
        open={entryOpen}
        setOpen={setEntryOpen}
        data={formData}
        handleAction={handleEdit}
        loading={isUpdating}
        title="Edit Data"
        existingFilters={existingFilters}
      />

      <DeleteDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        id={deleteId}
        setData={setData}
        setTotalCount={setTotalCount}
      />

      <DeleteMultipleDialog
        open={deleteMultipleOpen}
        setOpen={setDeleteMultipleOpen}
        loading={isDeleting}
        handleDelete={handleDeleteSelected}
      />
    </>
  );
};

export default Table;
