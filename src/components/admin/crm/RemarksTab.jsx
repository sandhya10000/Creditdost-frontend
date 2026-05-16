import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { adminAPI } from "../../../services/api";

const RemarksTab = ({ customerRemark }) => {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState([]);

  const handleAddRemark = async () => {
    try {
      const payload = {
        customerId: customerRemark?._id,
        message: remark,
      };

      const res = await adminAPI.addRemarksforCustomer(payload);

      const newRemark = res.data.data;

      setRemarks((prev) => [newRemark, ...prev]);

      setRemark("");
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRemarks = async () => {
    try {
      const res = await adminAPI.getCustomerRemarks(customerRemark?._id);
      console.log(res, "res===============");
      setRemarks(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerRemark?._id) {
      fetchRemarks();
    }
  }, [customerRemark]);
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ADD REMARK */}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #d7dbea",
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#7c84a6",
            mb: 2,
          }}
        >
          ADD REMARK
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type your remark here... e.g. Sandy ko call karni hai evening mein"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          sx={{
            mb: 3,

            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              fontSize: 18,
            },
          }}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleAddRemark}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 3,
              textTransform: "none",
              fontSize: 18,
              fontWeight: 700,
              background: "linear-gradient(90deg, #6C3BFF 0%, #7B3FF2 100%)",
              boxShadow: "none",

              "&:hover": {
                background: "linear-gradient(90deg, #5d30ea 0%, #6e36de 100%)",
                boxShadow: "none",
              },
            }}
          >
            Add Remark
          </Button>
        </Box>
      </Paper>

      {/* REMARK HISTORY */}

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#7c84a6",
          mb: 3,
        }}
      >
        REMARK HISTORY
      </Typography>

      <Stack spacing={3}>
        {remarks.map((item) => (
          <Paper
            key={item.id}
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: "#f5f6fc",
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1.5}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#6C3BFF",
                  fontSize: 18,
                }}
              >
                {item?.createdBy?.name || "Admin"} (
                {item?.createdBy?.role || "admin"})
              </Typography>

              <Typography
                sx={{
                  color: "#7c84a6",
                  fontSize: 14,
                }}
              >
                {new Date(item.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 18,
                color: "#2c2f3a",
                lineHeight: 1.7,
              }}
            >
              {item.message}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default RemarksTab;
