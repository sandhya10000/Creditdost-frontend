import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { adminAPI } from "../../../services/api";
import { LoadingState } from "../../ui/StateViews";

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
    return <LoadingState label="Loading remarks..." />;
  }

  return (
    <Box>
      {/* ADD REMARK */}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 2,
            color: "text.secondary",
            mb: 2,
          }}
        >
          ADD REMARK
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Type your remark here..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleAddRemark}
            sx={{ px: 4, textTransform: "none", fontWeight: 700 }}
          >
            Add Remark
          </Button>
        </Box>
      </Paper>

      {/* REMARK HISTORY */}

      <Typography
        component="h2"
        sx={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 2,
          color: "text.secondary",
          mb: 3,
        }}
      >
        REMARK HISTORY
      </Typography>

      <Stack spacing={2}>
        {remarks.map((item) => (
          <Paper
            key={item.id}
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              bgcolor: "background.default",
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              mb={1.5}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {item?.createdBy?.name || "Admin"} (
                {item?.createdBy?.role || "admin"})
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
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
                color: "text.primary",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
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
