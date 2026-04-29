import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import StarIcon from '@mui/icons-material/Star'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { fetchBoardsAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

export function StarredView() {
  const currentUser = useSelector(selectCurrentUser)
  const [starredBoards, setStarredBoards] = useState(null)

  useEffect(() => {
    if (currentUser?.starredBoardIds?.length > 0) {
      // Fetch boards by IDs
      // Ở đây ta dùng cấu trúc query q[_id][]=... để gửi mảng ID lên backend
      const query = currentUser.starredBoardIds.map(id => `q[_id]=${id}`).join('&')
      fetchBoardsAPI(`?${query}`).then(res => {
        setStarredBoards(res.boards || [])
      })
    } else {
      setStarredBoards([])
    }
  }, [currentUser?.starredBoardIds])

  if (!starredBoards) {
    return <PageLoadingSpinner caption="Loading Starred Boards..." />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <StarIcon sx={{ color: '#f1c40f' }} />
        <Typography variant="h4" fontWeight="bold">
          Starred Boards
        </Typography>
      </Box>

      {starredBoards.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          You haven't starred any boards yet. Star a board to see it here!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {starredBoards.map(b => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={b._id}
              sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <Card
                sx={{
                  width: 280,
                  minWidth: 280,
                  maxWidth: 280,
                  height: 190,
                  minHeight: 190,
                  maxHeight: 190,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box
                  sx={{
                    height: 64,
                    backgroundImage: b?.background ? `url(${b.background})` : 'none',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: b?.background ? 'transparent' : 'primary.light'
                  }}
                />
                <CardContent
                  sx={{
                    p: 1.5,
                    '&:last-child': { p: 1.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      minHeight: 32,
                      maxWidth: '100%'
                    }}
                  >
                    {b?.title}
                  </Typography>
                  <Box
                    component={Link}
                    to={`/boards/${b._id}`}
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.light' }
                    }}>
                    Go to board <ArrowRightIcon fontSize="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
