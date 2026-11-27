// Shared building blocks for admin list pages, matching the Franchises page:
// a bordered card holding a toolbar (search + filter chips), a slim loading bar,
// a table with a muted uppercase header, and a "Showing x–y of n" footer.
import React from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { formatShortDate, formatTime } from "./tableStyles";

// Page title, one-line description and actions (buttons) on the right
export const PageHeader = ({ title, subtitle, actions }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {actions}
      </Stack>
    )}
  </Stack>
);

export const SectionCard = ({ children, sx, ...props }) => (
  <Paper
    elevation={0}
    sx={{ borderRadius: 3, border: 1, borderColor: "divider", overflow: "hidden", ...sx }}
    {...props}
  >
    {children}
  </Paper>
);

// Title row at the top of a SectionCard, with optional actions on the right
export const SectionHeader = ({ title, subtitle, actions }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={1.5}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: "divider" }}
  >
    <Box>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {actions}
      </Stack>
    )}
  </Stack>
);

export const TableToolbar = ({ children, sx }) => (
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    alignItems={{ xs: "stretch", md: "center" }}
    justifyContent="space-between"
    sx={{ p: 2, ...sx }}
  >
    {children}
  </Stack>
);

// Small search box with a search icon and a clear button. Enter calls onSubmit.
export const SearchField = ({ value, onChange, placeholder, onSubmit, sx }) => (
  <Box
    component="form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }}
    sx={{ flex: 1, maxWidth: { md: 520 }, ...sx }}
  >
    <TextField
      fullWidth
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" aria-label="Clear search" onClick={() => onChange("")}>
              <Close fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  </Box>
);

// Pick-one filter shown as chips: options = [{ value, label, count?, color? }]
export const FilterChips = ({ label, options, value, onChange }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
    {label && (
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    )}
    {options.map((option) => {
      const selected = value === option.value;
      const hasCount = option.count !== undefined && option.count !== null;
      return (
        <Chip
          key={option.value || "all"}
          clickable
          onClick={() => onChange(option.value)}
          color={selected ? option.color || "primary" : "default"}
          variant={selected ? "filled" : "outlined"}
          label={hasCount ? `${option.label} (${option.count})` : option.label}
        />
      );
    })}
  </Stack>
);

// Error / success messages under the toolbar, each dismissible
export const CardAlerts = ({ error, onCloseError, success, onCloseSuccess }) =>
  error || success ? (
    <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
      {error && (
        <Alert severity="error" onClose={onCloseError}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={onCloseSuccess}>
          {success}
        </Alert>
      )}
    </Stack>
  ) : null;

// Thin progress line that keeps its height, so rows don't jump while loading
export const LoadingBar = ({ loading }) => (
  <Box sx={{ height: 4 }}>{loading && <LinearProgress />}</Box>
);

// Spinner while the first page loads, otherwise a short empty-state message
export const EmptyRow = ({ colSpan, loading, title, hint }) => (
  <TableRow>
    <TableCell colSpan={colSpan} sx={{ py: 8, textAlign: "center", borderBottom: 0 }}>
      {loading ? (
        <CircularProgress size={28} />
      ) : (
        <>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          {hint && (
            <Typography variant="body2" color="text.secondary">
              {hint}
            </Typography>
          )}
        </>
      )}
    </TableCell>
  </TableRow>
);

// page is 1-based
export const TableFooter = ({ page, rowsPerPage, total, onPageChange }) => {
  const first = total ? (page - 1) * rowsPerPage + 1 : 0;
  const last = Math.min(page * rowsPerPage, total);
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: "divider" }}
    >
      <Typography variant="body2" color="text.secondary">
        {total ? `Showing ${first}–${last} of ${total}` : "No records"}
      </Typography>
      <Pagination
        count={Math.max(1, Math.ceil(total / rowsPerPage))}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        shape="rounded"
        size="small"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

// One line cut with "…"; the full text shows on hover
export const CellText = ({ children, ...props }) => (
  <Tooltip title={children || ""} placement="top-start" enterDelay={600}>
    <Typography noWrap {...props}>
      {children}
    </Typography>
  </Tooltip>
);

// Date on one line, time underneath
export const DateCell = ({ value, withTime = true }) => (
  <>
    <Typography variant="body2" noWrap>
      {formatShortDate(value)}
    </Typography>
    {withTime && value && (
      <Typography variant="caption" color="text.secondary">
        {formatTime(value)}
      </Typography>
    )}
  </>
);

// Credit score as a coloured chip: "782 · Excellent"
const scoreMeta = (score) => {
  if (score >= 750) return { label: "Excellent", color: "success" };
  if (score >= 700) return { label: "Good", color: "info" };
  if (score >= 650) return { label: "Fair", color: "warning" };
  return { label: "Poor", color: "error" };
};

export const ScoreChip = ({ score, size = "small", emptyLabel = "N/A" }) => {
  if (score === null || score === undefined) {
    return <Chip size={size} variant="outlined" label={emptyLabel} />;
  }
  const { label, color } = scoreMeta(score);
  return <Chip size={size} color={color} label={`${score} · ${label}`} sx={{ fontWeight: 600 }} />;
};

