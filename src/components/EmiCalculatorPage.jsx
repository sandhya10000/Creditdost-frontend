import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  styled,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download, Calculate } from "@mui/icons-material";
import { emiAPI } from "../services/api";
import Header from "./homepage/Header";
import HomePageFooter from "./homepage/HomePageFooter";

const EmiBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0a1929 0%, #1a2744 50%, #0d2847 100%)",
  minHeight: "100vh",
  padding: theme.spacing(4, 0),
  display: "flex",
  flexDirection: "column",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "1rem",
  textTransform: "none",
  transition: "all 0.3s ease",
  background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0ea5e9)",
  backgroundSize: "200% 200%",
  animation: "gradientShift 3s ease infinite",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(14, 165, 233, 0.4)",
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(3),
  textAlign: "center",
}));

const EmiCalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emiResult, setEmiResult] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);

  const validateForm = () => {
    if (!loanAmount || loanAmount <= 0) {
      setError("Please enter a valid loan amount");
      return false;
    }
    if (!interestRate || interestRate <= 0) {
      setError("Please enter a valid interest rate");
      return false;
    }
    if (!loanTenure || loanTenure <= 0) {
      setError("Please enter a valid loan tenure");
      return false;
    }
    return true;
  };

  const calculateEMI = async () => {
    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call the backend API to calculate EMI
      const response = await emiAPI.calculateEMI({
        loanAmount: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        loanTenure: parseFloat(loanTenure),
      });

      setEmiResult(response.data);

      // Generate EMI schedule
      const scheduleResponse = await emiAPI.generateEmiSchedule({
        loanAmount: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        loanTenure: parseFloat(loanTenure),
      });

      setEmiSchedule(scheduleResponse.data.schedule);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error calculating EMI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadSchedule = () => {
    if (emiSchedule.length === 0) {
      setError("No EMI schedule to download. Please calculate EMI first.");
      return;
    }

    // Create CSV content
    let csvContent = "Month,EMI,Interest,Principal,Outstanding Balance\n";
    emiSchedule.forEach((row) => {
      csvContent += `${row.month},${row.emi},${row.interest},${row.principal},${row.balance}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "emi_schedule.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header />
      <EmiBackground>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              EMI Calculator
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Calculate your monthly loan payments and view the complete
              repayment schedule
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Grid item xs={12} md={6} style={{ flex: "1" }}>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      mb: 3,
                      textAlign: "center",
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Loan Details
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Loan Amount (₹)"
                      name="loanAmount"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      required
                      variant="outlined"
                      type="number"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Interest Rate (%)"
                      name="interestRate"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      required
                      variant="outlined"
                      type="number"
                      step="0.01"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Loan Tenure (Years)"
                      name="loanTenure"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      required
                      variant="outlined"
                      type="number"
                      step="0.5"
                      InputProps={{
                        sx: {
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(14, 165, 233, 0.5)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#0ea5e9",
                          },
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "rgba(255, 255, 255, 0.7)",
                          "&.Mui-focused": {
                            color: "#0ea5e9",
                          },
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          color: "white",
                        },
                        "& .MuiFormLabel-root": {
                          color: "rgba(255, 255, 255, 0.7)",
                        },
                      }}
                    />

                    <StyledButton
                      variant="contained"
                      onClick={calculateEMI}
                      disabled={loading}
                      fullWidth
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <Calculate />
                      }
                      sx={{ mt: 2, py: 1.5 }}
                    >
                      {loading ? "Calculating..." : "Calculate EMI"}
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6} style={{ flex: "1" }}>
              {emiResult && (
                <Box>
                  <ResultCard>
                    <Typography
                      variant="h5"
                      sx={{ mb: 3, color: "white", fontWeight: 600 }}
                    >
                      EMI Summary
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Monthly EMI
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ color: "#0ea5e9", fontWeight: 700 }}
                        >
                          ₹{emiResult.emi}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Total Interest
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ color: "#f59e0b", fontWeight: 700 }}
                        >
                          ₹{emiResult.totalInterest}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Principal Amount
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ color: "white", fontWeight: 600 }}
                        >
                          ₹{emiResult.principal}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body1"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Total Payment
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ color: "#10b981", fontWeight: 600 }}
                        >
                          ₹{emiResult.totalPayment}
                        </Typography>
                      </Grid>
                    </Grid>

                    <StyledButton
                      variant="contained"
                      onClick={() => setShowSchedule(!showSchedule)}
                      sx={{ mt: 3 }}
                    >
                      {showSchedule ? "Hide Schedule" : "View EMI Schedule"}
                    </StyledButton>

                    <Tooltip title="Download EMI Schedule">
                      <IconButton
                        onClick={downloadSchedule}
                        sx={{
                          mt: 3,
                          ml: 2,
                          color: "white",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </ResultCard>
                </Box>
              )}
            </Grid>
          </Grid>

          {showSchedule && emiSchedule.length > 0 && (
            <StyledCard>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    EMI Schedule
                  </Typography>
                  <Tooltip title="Download EMI Schedule">
                    <IconButton
                      onClick={downloadSchedule}
                      sx={{
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>

                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    maxHeight: 400,
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          Month
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          EMI
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          Interest
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          Principal
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          Balance
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emiSchedule.map((row) => (
                        <TableRow
                          key={row.month}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "rgba(255, 255, 255, 0.03)",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          <TableCell sx={{ color: "white" }}>
                            {row.month}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ₹{row.emi}
                          </TableCell>
                          <TableCell sx={{ color: "#f59e0b" }}>
                            ₹{row.interest}
                          </TableCell>
                          <TableCell sx={{ color: "#10b981" }}>
                            ₹{row.principal}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            ₹{row.balance}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </StyledCard>
          )}
        </Container>
      </EmiBackground>
      <HomePageFooter />
    </>
  );
};

export default EmiCalculatorPage;
