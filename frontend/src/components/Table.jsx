import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Loader, PencilIcon, TrashIcon } from "lucide-react";
import EntryDialog from "./EntryDialog";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteDialog from "./DeleteDialog";

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
}) => {
  const [entryOpen, setEntryOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("fundingGridToken");
  const [space, setSpace] = useState(0);

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
    console.log(data);
    const updateSpace = () => {
      const website = document.getElementById("website");
      if (website) {
        setSpace(website.getBoundingClientRect().left);
      }
    };

    // Run after component renders
    setTimeout(updateSpace, 0);

    // Optional: Update on window resize
    window.addEventListener("resize", updateSpace);
    return () => window.removeEventListener("resize", updateSpace);
  }, [data]);

  return (
    <>
      {loading ? (
        <div className="p-12 flex justify-center items-center w-full">
          <Loader className="animate-spin" />
        </div>
      ) : data.length > 0 ? (
        <div className="w-full justify-between items-center flex flex-col gap-6 mb-12">
          <div className="content-wrapper overflow-x-scroll w-[100%]">
            <table className="w-[200%]">
              <thead className="flex border-t border-gray-300">
                <div className="sticky left-0 bg-white w-[50px] ps-2 border border-gray-300 border-t-0 flex items-center">
                  S.No
                </div>
                <tr className="grid grid-cols-12 text-left w-[calc(100%-50px)]">
                  <th className="sticky left-[50px] bg-white row">
                    Company Name
                  </th>
                  <th
                    style={{ left: `${space - 68}px` }}
                    id="website"
                    className="sticky bg-white row"
                  >
                    website
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
                    <div className="sticky left-0 ps-2 bg-white w-[50px] border border-gray-300 border-t-0 flex items-center">
                      {index + 1}
                    </div>
                    <tr
                      key={index}
                      className=" grid grid-cols-12 items-center w-[calc(100%-50px)]"
                    >
                      <td className="row sticky left-[50px] bg-white ">
                        {row.companyName}
                      </td>
                      <td
                        style={{ left: `${space - 68}px` }}
                        className="row sticky bg-white "
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
                      <td className="row">
                        {row?.industry.map((item, index) => (
                          <div key={index}>
                            {item}
                            {index < row?.industry.length - 1 && ", "}
                          </div>
                        ))}
                      </td>
                      <td className="row">
                        {row.investingFields.map((item, index) => (
                          <div key={index}>
                            {item}
                            {index < row?.investingFields.length - 1 && ", "}
                          </div>
                        ))}
                      </td>
                      <td className="row flex gap-4">
                        <button
                          onClick={() => {
                            setFormData(row);
                            setEntryOpen(true);
                          }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteOpen(true);
                            setDeleteId(row._id);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
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
    </>
  );
};

export default Table;
