import {
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Divider,
} from "@mui/material";

const FranchiseInfoTab = ({ franchise }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Franchise Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Franchise ID</Typography>
            <Typography>{franchise?.franchiseCode || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Business Name</Typography>
            <Typography>{franchise?.businessName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Owner Name</Typography>
            <Typography>{franchise?.ownerName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Email</Typography>
            <Typography>{franchise?.email || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Phone</Typography>
            <Typography>
              {franchise?.userId?.phone || franchise?.phone || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">KYC Status</Typography>

            <Chip
              label={franchise?.kycStatus}
              color={
                franchise?.kycStatus === "approved"
                  ? "success"
                  : franchise?.kycStatus === "rejected"
                    ? "error"
                    : "warning"
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Credits</Typography>
            <Typography>{franchise?.credits}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Total Credits Purchased</Typography>
            <Typography>{franchise?.totalCreditsPurchased}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">AI Total</Typography>
            <Typography>{franchise?.aiTotal}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">AI Used</Typography>
            <Typography>{franchise?.aiUsed}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Agreement Signed</Typography>

            <Chip
              label={franchise?.agreementSigned ? "Signed" : "Pending"}
              color={franchise?.agreementSigned ? "success" : "warning"}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold">Registration Date</Typography>
            <Typography>
              {new Date(franchise?.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Package Information
        </Typography>

        {franchise?.assignedPackages?.map((pkg) => (
          <Card key={pkg._id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography fontWeight="bold">{pkg.name}</Typography>

              <Typography>Price: ₹{pkg.price}</Typography>

              <Typography>Credits: {pkg.creditsIncluded}</Typography>

              <Typography>GST: {pkg.gstPercentage}%</Typography>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default FranchiseInfoTab;
