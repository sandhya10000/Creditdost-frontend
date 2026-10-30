import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import DetailsTab from "../../components/admin/crm/DetailsTab";
import ReportsTab from "../../components/admin/crm/ReportsTab";
import BureauTab from "../../components/admin/crm/BureauTab";
import RemarksTab from "../../components/admin/crm/RemarksTab";
import DocumentTab from "../../components/admin/crm/DocumentTab";
import FollowUpTab from "../../components/admin/crm/FollowUpTab";

import { adminAPI } from "../../services/api";
import PageHeader from "../ui/PageHeader";
import { LoadingState } from "../ui/StateViews";

const CustomerCRM = () => {
  const [tab, setTab] = useState(0);
  const { customerId } = useParams();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creditReports, setCreditReports] = useState([]);
  console.log(creditReports, "creditReports");

  const navigate = useNavigate();
  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await adminAPI.getSinglebusinessform(customerId);
      console.log(res, "response-----crm");
      setCustomerInfo(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading customer..." />;
  }

  return (
    <Box p={{ xs: 2, md: 3 }}>
      <Box mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
      <PageHeader title="Customer CRM" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              {/* TABS */}

              <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="Details" />

                <Tab label="Reports" />

                <Tab label="Bureau" />

                <Tab label="Remarks" />
                <Tab label="Follow Up" />
                <Tab label="Documents" />
              </Tabs>

              <Box mt={3}>
                {tab === 0 && (
                  <DetailsTab
                    customer={customerInfo?.customerData}
                    creditReport={customerInfo?.report[0]?.score || "NA"}
                    ifscDeatails={customerInfo?.bankInfo?.ifsc_details}
                  />
                )}

                {/* {tab === 1 && (
                  <ReportsTab
                    customerReport={customerInfo?.report}
                    creditReports={creditReports}
                  />
                )} */}
                {tab === 1 && (
                  <ReportsTab
                    customerReport={
                      Array.isArray(customerInfo?.report)
                        ? customerInfo.report
                        : customerInfo?.report
                          ? [customerInfo.report]
                          : []
                    }
                  />
                )}

                {tab === 2 && (
                  <BureauTab
                    customerBureau={customerInfo?.customerData}
                    setCreditReports={setCreditReports}
                    onSearchSucess={() => {
                      fetchCustomer;
                    }}
                    customer={customerInfo?.customerData}
                  />
                )}

                {tab === 3 && (
                  <RemarksTab customerRemark={customerInfo?.customerData} />
                )}
                {tab === 4 && (
                  <FollowUpTab
                    customer={customerInfo?.customerData}
                    onUpdated={fetchCustomer}
                  />
                )}
                {tab === 5 && (
                  <DocumentTab
                    customerId={customerInfo?.customerData?._id}
                    documents={customerInfo?.customerData?.documents}
                    onUpdated={fetchCustomer}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerCRM;
