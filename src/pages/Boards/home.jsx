import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Unstable_Grid2'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'
import DashboardIcon from '@mui/icons-material/Dashboard'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Avatar from '@mui/material/Avatar'

export function HomeView({ setActiveSidebar }) {
  const currentUser = useSelector(selectCurrentUser)
  const [recentBoards, setRecentBoards] = useState([])

  useEffect(() => {
    const boards = JSON.parse(localStorage.getItem('recentBoards') || '[]')
    setRecentBoards(boards)
  }, [])

  return (
    <Box>
      {/* Welcome Banner */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 4,
        p: 3,
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'primary.50',
        color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'primary.main',
      }}>
        <Avatar
          src={currentUser?.avatar}
          alt={currentUser?.displayName}
          sx={{ width: 64, height: 64 }}
        />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Welcome back, {currentUser?.displayName}!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Here is your workspace overview. Manage your boards and tasks efficiently.
          </Typography>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<DashboardIcon />}
          onClick={() => setActiveSidebar('boards')}
          sx={{ borderRadius: 2 }}
        >
          View All Boards
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setActiveSidebar('templates')}
          sx={{ borderRadius: 2 }}
        >
          Browse Templates
        </Button>
      </Box>

      {/* Recently Viewed Boards */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AccessTimeIcon fontSize="small" color="action" />
        <Typography variant="h6" fontWeight="bold">
          Recently Viewed
        </Typography>
      </Box>

      {recentBoards.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          You haven't viewed any boards recently.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {recentBoards.map(b => (
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

export default HomeView
