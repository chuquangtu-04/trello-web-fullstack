import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import Link from '@mui/material/Link'
import moment from 'moment'

function CardAttachmentSection({ cardAttachments, onDeleteCardAttachment }) {
  if (!cardAttachments || cardAttachments.length === 0) return null

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <AttachFileIcon />
        <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Attachments</Typography>
      </Box>

      <Stack spacing={1.5} sx={{ pl: 4 }}>
        {cardAttachments.map((attachment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                bgcolor: '#f1f2f4',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <InsertDriveFileIcon sx={{ color: '#42526e' }} />
            </Box>
            <Box>
              <Link
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{
                  color: 'primary.main',
                  fontWeight: '600',
                  wordBreak: 'break-all',
                  display: 'block'
                }}
              >
                {attachment.fileName}
              </Link>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {moment(attachment.addedAt).format('MMM D, YYYY [at] h:mm A')}
              </Typography>
              <Link 
                component="button"
                variant="caption"
                underline="always"
                onClick={() => onDeleteCardAttachment(attachment.url)}
                sx={{ ml: 2, color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'error.main' } }}
              >
                Delete
              </Link>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

export default CardAttachmentSection
