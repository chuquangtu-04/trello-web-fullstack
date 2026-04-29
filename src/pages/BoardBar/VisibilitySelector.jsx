import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { capitalizeFirstLetter } from '~/utils/formatters'
import { updateBoardVisibilityAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'

import { selectCurrentUser } from '~/redux/user/userSlice'

const MENU_STYLE = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    backgroundColor: 'primary.50'
  }
}

function VisibilitySelector({ board }) {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const isOwner = board?.ownerIds?.includes(currentUser?._id)

  const [anchorEl, setAnchorEl] = useState(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [pendingVisibility, setPendingVisibility] = useState(null)

  const handleClick = (event) => {
    if (!isOwner) return
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'visibility-popover' : undefined

  const handleChange = (event) => {
    const newVisibility = event.target.value
    if (newVisibility === board.visibility) return

    if (newVisibility === 'public') {
      setPendingVisibility(newVisibility)
      setOpenConfirm(true)
    } else {
      updateVisibility(newVisibility)
    }
  }

  const updateVisibility = (visibility) => {
    updateBoardVisibilityAPI(board._id, visibility)
      .then((updatedBoard) => {
        dispatch(updateCurrentActiveBoard(updatedBoard))
        toast.success(`Board is now ${visibility}!`)
        handleClose()
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const handleConfirmPublic = () => {
    updateVisibility(pendingVisibility)
    setOpenConfirm(false)
  }

  const visibilityIcon = board.visibility === 'public' ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />

  return (
    <Box>
      <Tooltip title={isOwner ? `Change Visibility: ${capitalizeFirstLetter(board?.visibility || board?.type)}` : `Visibility: ${capitalizeFirstLetter(board?.visibility || board?.type)} (Owner only)`}>
        <Chip
          sx={{
            ...MENU_STYLE,
            cursor: isOwner ? 'pointer' : 'default',
            '&:hover': {
              backgroundColor: isOwner ? 'primary.50' : 'white'
            }
          }}
          icon={visibilityIcon}
          label={capitalizeFirstLetter(board?.visibility || board?.type)}
          onClick={handleClick}
        />
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 2, minWidth: '250px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Board Visibility
          </Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="visibility-radio-group"
              name="visibility"
              value={board.visibility || board.type}
              onChange={handleChange}
            >
              <FormControlLabel
                value="private"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LockIcon fontSize="inherit" /> Private
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Only board members can see and edit this board.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', mb: 1 }}
              />
              <FormControlLabel
                value="public"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PublicIcon fontSize="inherit" /> Public
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Anyone on the internet can see this board. Only members can edit.
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Popover>

      {/* Confirm Public Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Make Board Public?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anyone with the link will be able to view this board and it may appear in search engines. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmPublic} color="warning" autoFocus variant="contained">
            Make Public
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default VisibilitySelector
