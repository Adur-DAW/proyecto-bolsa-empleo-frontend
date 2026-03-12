import { Box, Skeleton, Stack } from '@mui/material'

type LoadingSkeletonProps = {
  type?: 'list' | 'card' | 'detail' | 'dashboard'
}

export default function LoadingSkeleton({
  type = 'list',
}: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="text" width="40%" />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    )
  }

  if (type === 'detail') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="text" height={40} width="50%" sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Box>
    )
  }

  if (type === 'dashboard') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 4, borderRadius: 2 }} />
        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="rectangular" height={120} width="100%" sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
        <Stack direction="row" spacing={3}>
          <Skeleton variant="rectangular" height={300} width="60%" sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" height={300} width="40%" sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
      ))}
    </Stack>
  )
}
