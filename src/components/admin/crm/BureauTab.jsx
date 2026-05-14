import React, { useState } from "react";

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

const BureauTab = ({ customerBureau, setCreditReports, onSearchSucess }) => {
  const fullName = customerBureau?.customerName || "";
  const pan = customerBureau?.panNumber || "";
  //API Type SELECT
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
  const handleChange = (bureau, field, value) => {
    setBureauData((prev) => ({
      ...prev,
      [bureau]: {
        ...prev[bureau],
        [field]: value,
      },
    }));
  };
  const getPayload = () => ({
    name: fullName,
    pan,
    mobile: bureauData.cibil.mobile,
    bureau: "cibil",
    cibilApiType,
  });

  //COMMON CIBIL CHECK
  const handleCheckCibil = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = getPayload();

      const response = await adminAPI.checkCreditV2(payload);

      console.log(response.data);

      // RESPONSE DATA
      const responseData = response.data;

      // SAVE REPORT DATA
      const reportData = {
        pan,
        bureau: "cibil",
        score: responseData.score,
        reportUrl: responseData.reportUrl,
        apiType: responseData.apiType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log(reportData, "reportData=====================");

      // SAVE IN STATE
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

  //SAVE BUREAU DATA
  const handleSaveBureauData = async () => {
    try {
      setLoading(true);

      setError("");

      setSuccess("");
      const payload = {
        bureauCredentials: bureauData,
      };
      const response = await adminAPI.saveBureauData(
        customerBureau?._id,
        payload,
      );

      setSuccess(
        response?.data?.message || "All Bureau Data Saved Successfully",
      );
    } catch (error) {
      console.log(error);

      setError(error?.response?.data?.message || "Failed To Save Bureau Data");
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
              type="password"
              value={bureauData[keyName].password}
              onChange={(e) =>
                handleChange(keyName, "password", e.target.value)
              }
            />
          </Grid>

          {/* MOBILE */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mobile"
              value={bureauData[keyName].mobile}
              onChange={(e) => handleChange(keyName, "mobile", e.target.value)}
            />
          </Grid>

          {/* API TYPE SELECT */}
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

        {/* BUTTON */}
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              if (keyName === "cibil") {
                handleCheckCibil();
              }
            }}
            disabled={loading}
          >
            {loading ? "Checking..." : `Check ${title}`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
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

      {/* SAVE BUTTON */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={handleSaveBureauData}
          disabled={loading}
        >
          {loading ? "Saving..." : "Auto Save All"}
        </Button>
      </Box>
    </Box>
  );
};

export default BureauTab;
