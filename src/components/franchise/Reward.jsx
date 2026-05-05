import React, { useEffect, useState } from "react";
import { franchiseAPI } from "../../services/api";
import { Card, CardContent, Typography, Box } from "@mui/material";

const FranchiseReward = () => {
  const [rewards, setRewards] = useState([]);

  //  SAME LOGIC AS MARKETING
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
    : "http://localhost:5000";

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const res = await franchiseAPI.getRewards();
      console.log(res.data, "rewards----------");

      setRewards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTimeLeft = (expiry) => {
    if (!expiry) return "No expiry";

    const diff = new Date(expiry) - new Date();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  return (
    <>
      {rewards?.length > 0 ? (
        rewards.map((r) => {
          //  DYNAMIC FILE URL (LIKE MARKETING)
          const fileUrl = r.fileUrl;

          const isImage =
            r.fileType?.includes("image") ||
            r.fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i);
          return (
            <Card key={r._id} sx={{ m: 2 }}>
              <CardContent>
                <Typography variant="h6">{r.title}</Typography>
                <Typography>{r.description}</Typography>

                {/*  IMAGE */}
                {isImage && (
                  <Box
                    component="img"
                    src={fileUrl}
                    alt="reward"
                    sx={{
                      width: 150,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 2,
                      mt: 1,
                      boxShadow: 2,
                    }}
                  />
                )}

                <Typography color="green" sx={{ mt: 1 }}>
                  {getTimeLeft(r.expiryDate)}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography sx={{ m: 2 }}>No rewards available</Typography>
      )}
    </>
  );
};

export default FranchiseReward;
