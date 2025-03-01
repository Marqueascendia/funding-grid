import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import gsap from "gsap";

const StorageStats = () => {
  const [storageStats, setStorageStats] = useState(null);
  const [totalStorageUsed, setTotalStorageUsed] = useState(0);
  const [flag, setFlag] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const totalStorage = 512;
  const token = localStorage.getItem("fundingGridToken");


  async function getStorageStats() {
    try {
      const response = await axios.get(`${baseUrl}/api/db`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setStorageStats(response.data.stats);
      } else {
        toast.error(response.data.msg || "Failed to fetch storage stats");
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Failed to fetch storage stats");
    }
  }

  useEffect(() => {
    getStorageStats();
  }, []);

  useEffect(() => {
    const storageUsed =
      Number(storageStats?.totalStorageUsed?.split(" ")[0]) /
      totalStorage.toFixed(3);
    // const storageUsed = 50
    setTotalStorageUsed(storageUsed);
    setFlag(true);
  }, [storageStats]);

  useEffect(() => {
    if (!flag) {
      return;
    }

    gsap.to(".storage", {
      width: `${totalStorageUsed}%`,
      duration: 0.5,
    });
  }, [totalStorageUsed]);

  return (
    <>
      <div className="px-4 flex gap-3">
        <div className="h-7 w-[400px] rounded-full relative shadow-md shadow-slate-300 overflow-hidden bg-gray-200">
          <div
            // style={{ width: `${totalStorageUsed}%` }}
            className="absolute top-0 left-0 w-0 storage h-full bg-transparent rounded-full z-30 overflow-hidden shadow-md shadow-slate-300 "
          >
            <div className=" gradient w-[400px] h-full rounded-full z-10 relative"></div>
          </div>
        </div>
        <div>{totalStorageUsed.toFixed(3)}% Used</div>
      </div>
    </>
  );
};

export default StorageStats;
