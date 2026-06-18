import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Card, CircularProgress } from "@mui/material";
import { adminAPI, franchiseAPI } from "../../services/api";
import FranchiseInfoTab from "../admin/Franchisecrm/FranchiseInfoTab";
import FranchiseBusinessTab from "../admin/Franchisecrm/FranchiseBusinessTab";
import FranchiseReportsTab from "../admin/Franchisecrm/FranchiseReportsTab";
import FranchiseAITab from "../admin/Franchisecrm/FranchiseAITab";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

const FranchiseTabs = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [franchiseInfo, setFranchiseInfo] = useState(null);
  const [businessForms, setBusinessForms] = useState([]);
  const [reports, setReports] = useState([]);
  const [aireports, setAiReports] = useState([]);
  const { franchiseCode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchFranchise();
  }, []);

  const fetchBusinessForms = async (franchiseId) => {
    try {
      console.log("Sending Franchise ID:", franchiseId);
      const res = await franchiseAPI.getBusinessFormsByFranchise(franchiseId);
      console.log("Business API Response:", res.data);
      setBusinessForms(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchFranchise = async () => {
    try {
      const res = await adminAPI.getSingleFranchise(franchiseCode);
      console.log(res, "response---franchise--crm");
      const franchise = res.data.data;
      console.log(franchise, "franchise----------");

      setFranchiseInfo(franchise);
      await fetchBusinessForms(franchise._id);
      await fetchFranchiseReports(franchise._id); //
      await fetchFranchiseAIDocuments(franchise._id);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchFranchiseReports = async (franchiseId) => {
    try {
      const res = await adminAPI.getFranchiseReport(franchiseId);

      console.log("Reports Response:", res.data);

      setReports(res.data.reports || []);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchFranchiseAIDocuments = async (franchiseId) => {
    try {
      const res = await adminAPI.getFranchiseAIDocuments(franchiseId);

      console.log("AI Reports:", res.data);

      setAiReports(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (!loading && !franchiseInfo) {
    return (
      <Box textAlign="center" mt={5}>
        Franchise not found
      </Box>
    );
  }
  return (
    <Card sx={{ p: 2 }}>
      <Box mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="scrollable"
      >
        <Tab label="Franchise Info" />
        <Tab label="Business" />
        <Tab label="Reports" />
        <Tab label="AI Reports" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && <FranchiseInfoTab franchise={franchiseInfo} />}

        {tab === 1 && (
          <FranchiseBusinessTab
            franchise={franchiseInfo}
            businessForms={businessForms}
          />
        )}

        {tab === 2 && (
          <FranchiseReportsTab franchise={franchiseInfo} reports={reports} />
        )}

        {tab === 3 && (
          <FranchiseAITab franchise={franchiseInfo} aireports={aireports} />
        )}
      </Box>
    </Card>
  );
};

export default FranchiseTabs;
