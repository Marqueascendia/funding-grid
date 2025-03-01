import React, { useState, useEffect } from "react";
import CsvUploader from "../components/CsvUploader";
import Table from "../components/Table";
import FiltersDialog from "../components/FiltersDialog";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import toast from "react-hot-toast";
import EntryDialog from "../components/EntryDialog";
import DownloadDialog from "../components/DownloadDialog";
import StorageStats from "../components/StorageStats";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [existingFilters, setExistingFilters] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [filters, setFilters] = useState([]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(
    searchTerm,
    500
  );

  async function fetchPage({ page, searchTerm, industry, investingFields }) {
    const ft = {};
    if (searchTerm) {
      ft.searchTerm = searchTerm;
    }
    if (industry) {
      ft.industry = industry;
    }
    if (investingFields) {
      ft.investingFields = investingFields;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/data`, {
        params: {
          page,
          limit,
          ...ft,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setData(response.data.data);
        setTotalCount(response.data.totalCount);
      } else {
        toast.error(response.data.error || "Error fetching data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  async function fetchFilters() {
    try {
      const response = await axios.get(`${baseUrl}/filters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setExistingFilters(response.data.filters);
      } else {
        toast.error(response.data.error || "Error fetching data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  }

  async function handleAddEntry(setFormData, formData) {
    console.log('setFormData');
    setIsAdding(true);
    try {
      const payload = {
        ...formData,
        investingFields: formData.investingFields
          .split(",")
          .map((item) => item.trim()),
      };
      console.log('payload', payload);
      const res = await axios.post(`${baseUrl}/api/single-upload`, payload, {
        validateStatus: (s) => s < 500,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('res', res);
      if (res.status !== 200) {
        toast.error(res.data.error || "error adding data.");
        return;
      }
      toast.success("data added");
      setEntryOpen(false);
      setFormData({
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
    } catch (error) {
      toast.error("Error adding company");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchPage({ page: currentPage, searchTerm: debouncedSearchTerm, filters });
  }, [debouncedSearchTerm]);

  function handleFilter() {
    fetchPage({ page: currentPage, searchTerm: searchTerm, ...filters });
  }

  useEffect(() => {
    const token = localStorage.getItem("fundingGridToken");
    if (!token) {
      window.location.href = "/login";
    }

    fetchFilters();
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 p-12 h-screen">
      <h1 className="text-4xl font-bold flex justify-between items-center w-full px-5">
        FUNDING GRID
      </h1>
      <div className="flex justify-between items-center w-full pe-5">
      <StorageStats />
        <CsvUploader />
      </div>
      <div className="grid grid-cols-2 gap-12 justify-between items-center w-full px-5">
        <div className="flex items-center gap-2 w-full bg-gray-100 rounded-lg p-2">
          <SearchIcon height={16} width={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none"
          />
        </div>
        <div className="w-full flex gap-5 justify-end items-center">
          <button
            className="bg-zinc-800 text-white py-2 rounded-md px-8 cursor-pointer"
            onClick={() => setEntryOpen(true)}
          >
            Add new
          </button>
          <button
            className="bg-zinc-800 text-white py-2 rounded-md px-8 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Filters
          </button>
          <button
            onClick={() => setDownloadOpen(true)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition cursor-pointer"
          >
            Download CSV
          </button>
        </div>

        {/* dailogs  */}
        <EntryDialog
          open={entryOpen}
          setOpen={setEntryOpen}
          existingFilters={existingFilters}
          handleAction={handleAddEntry}
          loading={isAdding}
          title="Add new"
        />
        <FiltersDialog
          filters={filters}
          setFilters={setFilters}
          open={open}
          setOpen={setOpen}
          handleApply={handleFilter}
          existingFilters={existingFilters}
          setExistingFilters={setExistingFilters}
        />
        <DownloadDialog
          open={downloadOpen}
          setOpen={setDownloadOpen}
          existingFilters={existingFilters}
        />
      </div>
      <div className="w-full px-5">
        <Table
          fetchPage={fetchPage}
          data={data}
          totalCount={totalCount}
          loading={loading}
          setData={setData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTotalCount={setTotalCount}
        />
      </div>
    </div>
  );
};

export default Home;
