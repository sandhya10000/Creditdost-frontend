import React, { useState, useEffect } from "react";

import {
  Box,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Alert,
  MenuItem,
} from "@mui/material";
import { adminAPI } from "../../../services/api";

const BureauTab = ({
  customerBureau,
  setCreditReports,
  onSearchSucess,
  customer,
}) => {
  const fullName = customerBureau?.customerName || "";
  const pan = customerBureau?.panNumber || "";
  const [cibilApiType, setCibilApiType] = useState("ongrid");
  const [bureauData, setBureauData] = useState({
    cibil: {
      userId: "",
      password: "",
      mobile: "",
    },

    crif: {
      userId: "",
      password: "",
      mobile: "",
    },

    experian: {
      userId: "",
      password: "",
      mobile: "",
    },

    equifax: {
      userId: "",
      password: "",
      mobile: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  //HANDLE INPUT
  const handleChange = async (bureau, field, value) => {
    const updatedData = {
      ...bureauData,
      [bureau]: {
        ...bureauData[bureau],
        [field]: value,
      },
    };

    // State update
    setBureauData(updatedData);

    // Auto save API
    try {
      const payload = {
        bureauCredentials: updatedData,
      };

      await adminAPI.saveBureauData(customerBureau?._id, payload);
    } catch (error) {
      console.log(error);
    }
  };
  const getPayload = (bureau) => {
    const dob = customer?.dob
      ? new Date(customer.dob).toISOString().split("T")[0]
      : "";

    if (bureau === "equifax") {
      return {
        name: customer?.customerName,
        pan: customer?.panNumber,
        mobile: customer?.customerPhone,
        gender: customer?.gender?.toLowerCase(),
        dob,
        bureau: "equifax",
        cibilApiType: "surepass",
      };
    }

    return {
      name: customer?.customerName,
      pan: customer?.panNumber,
      mobile: customer?.customerPhone,
      bureau,
      cibilApiType: bureau !== "cibil" ? "surepass" : cibilApiType,
    };
  };

  //COMMON CIBIL CHECK
  const handleCheckCibil = async (bureau) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const payload = getPayload(bureau);
      const response = await adminAPI.checkCreditV2(payload);
      const responseData = response.data;
      const reportData = {
        pan,
        bureau: bureau,
        score: responseData.score,
        reportUrl: responseData.reportUrl,
        apiType: responseData.apiType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCreditReports((prev) => [reportData, ...prev]);
      setSuccess(responseData?.message);
      onSearchSucess();
    } catch (error) {
      console.log(error);

      setError(error?.response?.data?.message || "CIBIL Check Failed");
    } finally {
      setLoading(false);
    }
  };

  const renderBureauSection = (title, keyName) => (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>

        <Grid container spacing={2}>
          {/* USER ID */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="User ID"
              value={bureauData[keyName].userId}
              onChange={(e) => handleChange(keyName, "userId", e.target.value)}
            />
          </Grid>

          {/* PASSWORD */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Password"
              type="text"
              value={bureauData[keyName].password}
              onChange={(e) =>
                handleChange(keyName, "password", e.target.value)
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mobile"
              value={bureauData[keyName].mobile}
              onChange={(e) => handleChange(keyName, "mobile", e.target.value)}
            />
          </Grid>

          {keyName === "cibil" && (
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Select API"
                value={cibilApiType}
                onChange={(e) => setCibilApiType(e.target.value)}
              >
                <MenuItem value="ongrid">Ongrid</MenuItem>

                <MenuItem value="surepass">Surepass</MenuItem>
              </TextField>
            </Grid>
          )}
        </Grid>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              handleCheckCibil(keyName);
            }}
            disabled={loading}
          >
            {loading ? "Checking..." : `Check ${title}`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
  useEffect(() => {
    fetchSavedBureauData();
  }, []);
  const fetchSavedBureauData = async () => {
    try {
      const response = await adminAPI.getBureauData(customerBureau?._id);
      if (response?.data.data.bureauCredentials) {
        setBureauData(response?.data.data.bureauCredentials);
      }
    } catch (error) {
      console.log(error, "errrr");
    }
  };
  return (
    <Box>
      {/* USER DETAILS */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">User Details</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography>
            <strong>Name:</strong> {fullName}
          </Typography>

          <Typography>
            <strong>PAN:</strong> {pan}
          </Typography>
        </CardContent>
      </Card>

      {/* ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* SUCCESS */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* BUREAUS */}
      {renderBureauSection("CIBIL", "cibil")}

      {renderBureauSection("CRIF", "crif")}

      {renderBureauSection("EXPERIAN", "experian")}

      {renderBureauSection("EQUIFAX", "equifax")}
    </Box>
  );
};

export default BureauTab;
