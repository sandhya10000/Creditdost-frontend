import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Card, CircularProgress, Alert, Chip } from "@mui/material";
import { adminAPI, franchiseAPI } from "../../services/api";
import FranchiseInfoTab from "../admin/Franchisecrm/FranchiseInfoTab";
import FranchiseBusinessTab from "../admin/Franchisecrm/FranchiseBusinessTab";
import FranchiseReportsTab from "../admin/Franchisecrm/FranchiseReportsTab";
import FranchiseAITab from "../admin/Franchisecrm/FranchiseAITab";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import PageHeader from "../ui/PageHeader";
import { EmptyState, LoadingState } from "../ui/StateViews";

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

  if (loading) {
    return <LoadingState label="Loading franchise..." />;
  }

  if (!franchiseInfo) {
    return <EmptyState title="Franchise not found" />;
  }
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Box mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
      <PageHeader title="Franchise CRM" />
      {franchiseInfo?.isDeleted && (
        <Box mb={2}>
          <Alert severity="error">
            This franchise user is deleted. Data below is preserved and
            read-only. <Chip label="User Deleted" color="error" size="small" sx={{ ml: 1 }} />
          </Alert>
        </Box>
      )}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
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
