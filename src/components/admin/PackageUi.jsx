import React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AddOutlined,
  BoltOutlined,
  CheckRounded,
  DeleteOutline,
  EditOutlined,
  Inventory2Outlined,
} from '@mui/icons-material';

// Shared presentation for the admin Franchise Packages and Customer Packages pages.
// Data handling stays in each page; this file only renders. Each page passes one
// accent colour; everything else is neutral with soft tints.

const MAX_VISIBLE_FEATURES = 4;
const HAIRLINE = 'rgba(15, 23, 42, 0.08)';

const tint = (hex, alpha) => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatINR = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return `₹${number.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

// Base price, GST amount and total for a package
const priceBreakdown = (price, gstPercentage) => {
  if (price === '' || price === null || price === undefined) return null;
  const base = Number(price);
  if (!Number.isFinite(base)) return null;
  const rate = Number(gstPercentage) || 0;
  const gst = (base * rate) / 100;
  return { base, rate, gst, total: base + gst };
};

export const PackageHeader = ({ title, subtitle, actionLabel, onAction, accent }) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h5" fontWeight={700} letterSpacing="-0.02em">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 640 }}>
        {subtitle}
      </Typography>
    </Box>
    <Button
      variant="contained"
      disableElevation
      startIcon={<AddOutlined />}
      onClick={onAction}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 2,
        bgcolor: accent,
        flexShrink: 0,
        '&:hover': { bgcolor: accent, filter: 'brightness(0.92)' },
      }}
    >
      {actionLabel}
    </Button>
  </Stack>
);

// Three soft tiles with the counts
export const PackageStats = ({ total, active, inactive, accent }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(3, 1fr)' },
      gap: 2,
      mb: 3,
    }}
  >
    {[
      { label: 'Total', value: total, color: accent },
      { label: 'Active', value: active, color: '#16a34a' },
      { label: 'Inactive', value: inactive, color: '#64748b' },
    ].map((item) => (
      <Box
        key={item.label}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: tint(item.color, 0.06),
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: item.color,
            boxShadow: `0 0 0 4px ${tint(item.color, 0.15)}`,
          }}
        />
        <Box>
          <Typography variant="h5" fontWeight={700} lineHeight={1.1}>
            {item.value}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {item.label}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

// One package card: name and status with edit/delete at the top, description, price with
// GST and credits chips, check-mark features, an optional tag and a visibility footer.
export const PackageCard = ({ pkg, accent, onEdit, onDelete, onToggle, busy, footer }) => {
  const price = priceBreakdown(pkg.price, pkg.gstPercentage);
  const features = pkg.features || [];
  const visibleFeatures = features.slice(0, MAX_VISIBLE_FEATURES);
  const hiddenCount = features.length - visibleFeatures.length;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: HAIRLINE,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        opacity: pkg.isActive ? 1 : 0.65,
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': { boxShadow: `0 12px 28px -18px ${tint(accent, 0.6)}`, borderColor: tint(accent, 0.3) },
      }}
    >
      <Box sx={{ p: 2.25, pb: 0, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
        {/* Title row */}
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ minWidth: 0, flex: 1 }}>
            {pkg.name}
          </Typography>
          <Chip
            size="small"
            label={pkg.isActive ? 'Active' : 'Inactive'}
            sx={{
              height: 22,
              fontWeight: 600,
              fontSize: 11,
              flexShrink: 0,
              bgcolor: pkg.isActive ? tint('#16a34a', 0.12) : 'grey.200',
              color: pkg.isActive ? '#15803d' : 'text.secondary',
            }}
          />
          <Tooltip title="Edit">
            <IconButton size="small" onClick={onEdit} disabled={busy} sx={{ '&:hover': { color: accent } }}>
              <EditOutlined sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete} disabled={busy} sx={{ '&:hover': { color: 'error.main' } }}>
              <DeleteOutline sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {pkg.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {pkg.description}
          </Typography>
        )}

        {/* Price row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
              {price ? formatINR(price.total) : '—'}
            </Typography>
            {price && (
              <Chip
                size="small"
                label={`+${price.rate}% GST`}
                sx={{ height: 20, fontSize: 11, fontWeight: 600, bgcolor: tint(accent, 0.1), color: accent }}
              />
            )}
          </Stack>
          <Chip
            size="small"
            label={`${pkg.creditsIncluded ?? 0} credits`}
            sx={{ height: 22, fontSize: 11, fontWeight: 600, bgcolor: 'grey.100', color: 'text.secondary', flexShrink: 0 }}
          />
        </Stack>

        {/* Features */}
        {features.length > 0 ? (
          <Stack spacing={0.5}>
            {visibleFeatures.map((feature) => (
              <Stack key={feature} direction="row" spacing={0.75} alignItems="center">
                <CheckRounded sx={{ fontSize: 14, color: accent, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  {feature}
                </Typography>
              </Stack>
            ))}
            {hiddenCount > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 2.25 }}>
                +{hiddenCount} more
              </Typography>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.disabled">
            No features listed
          </Typography>
        )}

        {footer && <Box>{footer}</Box>}
      </Box>

      {/* Footer: visibility */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ mt: 2, px: 1.5, py: 0.75, borderTop: '1px solid', borderColor: HAIRLINE }}
      >
        <Switch
          size="small"
          checked={Boolean(pkg.isActive)}
          onChange={onToggle}
          disabled={busy}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: accent },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: accent },
          }}
        />
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {pkg.isActive ? 'Visible to buyers' : 'Hidden from buyers'}
        </Typography>
      </Stack>
    </Box>
  );
};

// Small tag in a card's footer, e.g. availability on customer packages
export const PackageTag = ({ children, title, accent }) => (
  <Chip
    size="small"
    label={children}
    title={title}
    sx={{ bgcolor: tint(accent, 0.08), color: accent, fontWeight: 600, fontSize: 12 }}
  />
);

export const PackageGridEmpty = ({ message, actionLabel, onAction, accent }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 10,
      px: 3,
      borderRadius: 4,
      border: '1px dashed',
      borderColor: HAIRLINE,
      color: 'text.secondary',
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        mx: 'auto',
        mb: 2,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        bgcolor: tint(accent, 0.1),
        color: accent,
      }}
    >
      <Inventory2Outlined />
    </Box>
    <Typography>{message}</Typography>
    {actionLabel && (
      <Button sx={{ mt: 2, textTransform: 'none', fontWeight: 600, color: accent }} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export const PackageAlerts = ({ error, success }) => (
  <>
    {error && (
      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
        {error}
      </Alert>
    )}
    {success && (
      <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
        {success}
      </Alert>
    )}
  </>
);

// Titled group inside the package form
export const FormSection = ({ title, hint, children }) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={700}>
      {title}
    </Typography>
    {hint && (
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
        {hint}
      </Typography>
    )}
    <Box sx={{ mt: 1.5 }}>{children}</Box>
  </Box>
);

// Live price preview inside the form
export const PricePreview = ({ price, gstPercentage, accent }) => {
  const breakdown = priceBreakdown(price, gstPercentage);
  const cells = breakdown
    ? [
        { label: 'Base', value: formatINR(breakdown.base) },
        { label: `GST ${breakdown.rate}%`, value: formatINR(breakdown.gst) },
        { label: 'Customer pays', value: formatINR(breakdown.total), strong: true },
      ]
    : null;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: tint(accent, 0.06),
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
      }}
    >
      {cells ? (
        cells.map((cell) => (
          <Box key={cell.label}>
            <Typography variant="caption" color="text.secondary" display="block">
              {cell.label}
            </Typography>
            <Typography fontWeight={cell.strong ? 700 : 600} sx={{ color: cell.strong ? accent : 'text.primary' }}>
              {cell.value}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
          Enter a base price to see the total.
        </Typography>
      )}
    </Box>
  );
};

// Feature list editor: type, press Enter, remove with the chip's delete icon
export const FeatureEditor = ({ features, input, onInputChange, onAdd, onRemove, accent }) => (
  <>
    <TextField
      fullWidth
      size="small"
      label="Add feature"
      value={input}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onAdd();
        }
      }}
      helperText="Press Enter to add"
    />
    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
      {features.map((feature) => (
        <Chip
          key={feature}
          size="small"
          label={feature}
          onDelete={() => onRemove(feature)}
          sx={{ bgcolor: tint(accent, 0.08), color: 'text.primary' }}
        />
      ))}
    </Stack>
  </>
);
