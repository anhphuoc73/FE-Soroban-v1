import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function GridSkeleton() {
  return (
    <Box
      sx={{
        height: 'max-content',
        px: 1,
      }}
    >
      {Array(20)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rectangular"
            height={50}
            sx={{ mt: 0.5 }}
          />
        ))}
    </Box>
  );
}
