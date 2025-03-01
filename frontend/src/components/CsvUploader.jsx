import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import AlertDialog from "./AlertDialog";

const CsvUploader = ({}) => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [duplicatesCount, setDuplicatesCount] = useState(0);
  const [upload, setUpload] = useState(false)
  const token = localStorage.getItem("fundingGridToken");
  const baseUrl = import.meta.env.VITE_BACKEND_URL;


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => setCsvData(result.data),
      header: true,
    });
  };

  async function handleCountDuplicates() {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/count-duplicates`, {
        data: csvData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setDuplicatesCount(response.data.count);
        setAlertOpen(true);
      } else {
        toast.error(response.data.error || "Error counting duplicates");
      }
    } catch (error) {
      toast.error("Error counting duplicates");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadToServer() {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/upload-csv`, {
        data: csvData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success("Data uploaded successfully");
        setCsvData([])
      }else{
        toast.error(response.data.error || "Error uploading data");
      }
    } catch (error) {
      toast.error("Error uploading data");
    } finally {
      setLoading(false);
      setUpload(false);
    }
  };

  useEffect(() => {
    if(upload){
      handleUploadToServer()
    }
  }, [upload]);

  return (
    <>
      <div className="flex gap-4 items-center">
        <input
          required
          className="border-2 border-gray-300 rounded-md p-2"
          type="file"
          accept=".csv"
        onChange={handleFileUpload}
      />
      <button
        disabled={loading}
        className="bg-zinc-800 w-[170px] text-white p-2 rounded-md flex justify-center items-center cursor-pointer"
        onClick={handleCountDuplicates}
      >
        {loading ? <Loader className="animate-spin" /> : "Upload to Database"}
        </button>
      </div>

      {/* dialogs  */}
      <AlertDialog open={alertOpen} setOpen={setAlertOpen} count={duplicatesCount} setUpload={setUpload} />
    </>
  );
};

export default CsvUploader;
