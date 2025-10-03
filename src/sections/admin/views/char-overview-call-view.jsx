import { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';
import { useTheme } from '@mui/material/styles';
import { Chart, useChart, ChartLegends } from 'src/components/chart';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';
import Typography from '@mui/material/Typography';

export function CharOverviewDispositionCallView({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const chartColors = chart.colors ?? [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.secondary.main
  ];
  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: chart.categories },
    chart: {
      toolbar: {
        show: true,
        tools: {
          pan: false,
          download: false,
        },
        export: {
          csv: { show: false },
          svg: { show: false },
          png: { show: false },
        },
      },
      zoom: {
        enabled: true,
        type: 'xy',
      },
    },
    ...chart.options,
  });
  const currentSeries = chart.series[0];
  return (
    <Card {...other}>
      <ChartLegends
        colors={chartOptions?.colors}
        labels={chart.series[0].data.map((item) => item.name)}
        values={[
          fShortenNumber(1234),
          fShortenNumber(6789),
          fShortenNumber(1234),
          fShortenNumber(6789),
          fShortenNumber(1234),
          fShortenNumber(6789),
        ]}
        sx={{ px: 3, gap: 3, paddingTop: 3 }}
      />
      <Chart
        type="area"
        series={currentSeries?.data}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}

export function CharOverviewTypeCallView({ title, percent, total, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.primary.main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: { formatter: (value) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
    ...chart.options,
  });

  const renderTrending = (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      <Iconify
        width={24}
        icon={
          percent < 0
            ? 'solar:double-alt-arrow-down-bold-duotone'
            : 'solar:double-alt-arrow-up-bold-duotone'
        }
        sx={{ flexShrink: 0, color: 'success.main', ...(percent < 0 && { color: 'error.main' }) }}
      />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
      <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
        last 7 days
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        alignItems: 'center',
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1, display: "fex", gap: 30, width: "100%" }}>
        <Box sx={{ width: "100%"}}>
          <Box sx={{ typography: 'subtitle2' }}>{title}</Box>
         <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1}}>
           <Box sx={{ mt: 1.5, mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
             <Typography sx={{ typography: 'h3' }}>
               {fNumber(total)}
             </Typography>
             <Iconify
               width={24}
               icon={
                 percent < 0
                   ? 'solar:double-alt-arrow-down-bold-duotone'
                   : 'solar:double-alt-arrow-up-bold-duotone'
               }
               sx={{ flexShrink: 0, color: 'success.main', ...(percent < 0 && { color: 'error.main' }) }}
             />
             <Typography sx={{ typography: 'h7' }}>
               123
             </Typography>
           </Box>
           <Box sx={{}}>
             <Chart
               type="bar"
               series={[{ data: chart.series }]}
               options={chartOptions}
               width={60}
               height={40}
             />
           </Box>
         </Box>
        </Box>
      </Box>
      <Box>
        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center",  flex: 1, gap: 10 }}>
          <Typography sx={{ mt: 1.5, mb: 1, typography: 'h7', }}>
            Tổng thời gian đàm thoại (phút)
          </Typography>
          <Typography sx={{ mt: 1.5, mb: 1, typography: 'h7', }}>
            2000
          </Typography>
        </Box>
        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center",  flex: 1, gap: 10}}>
          <Typography sx={{ mt: 1.5, mb: 1, typography: 'h7',   }}>
            Tổng thời gian đàm thoại (giây)
          </Typography>
          <Typography sx={{ mt: 1.5, mb: 1, typography: 'h7', }}>
            20
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
