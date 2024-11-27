import React, { useState } from 'react'
import { Button, Grid, TextField, Typography, Divider, CardContent, Card, Tabs, Tab, Box, Tooltip } from '@mui/material'
import { CommentMultipleOutline } from 'mdi-material-ui'

// import EcommerceActivityTimeline from '../ecommerce/EcommerceActivityTimeline'
import { useAuth } from 'src/hooks/useAuth'
import { AggregatorService } from 'src/service'
import { status } from 'src/context/common'
import { successToast } from 'src/components/Toast'

const CommentComponent = ({ data, getCorporateStudentsDetailById }: any) => {
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  const formatDateTime = (date: string | any) => {
    const now = new Date(date)
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return `${formattedDate}, ${formattedTime}`
  }

  const handleAddComment = async () => {
    console.log(data)
    const trimmedComment = newComment.trim()
    if (trimmedComment.length <= 250) {
      const response = await AggregatorService.addComment(data?.applicationCode, trimmedComment)
      if (response?.status == status.successCodeOne) {
        setNewComment('')
        successToast('Comment Added')
        getCorporateStudentsDetailById()
      }
    }
  }
  const handleCancel = () => {
    setNewComment('')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^\s+/g, '')
    setNewComment(value)
  }

  return (
    <Box>
      <form
        noValidate
        autoComplete='off'
        style={{ marginTop: '16px' }}
        onSubmit={e => {
          e.preventDefault()
          handleAddComment()
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={data?.application?.comments?.length === 0 ? 4 : 1}
          label='Add a comment'
          value={`${newComment}`}
          variant='outlined'
          spellCheck={false}
          onChange={handleChange}
          helperText={newComment.length > 250 && `Comment should be less than 250 characters`}
          error={newComment.length > 250}
          style={{ marginBottom: '16px' }}
        />
        <Grid container spacing={2} justifyContent='flex-end'>
          <Grid item>
            <Button variant='outlined' color='secondary' onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={newComment.trim().length > 250 || newComment == ''}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Divider style={{ marginTop: '32px' }} />
      <Box sx={{ mt: 4, maxHeight: '600px', overflowY: 'auto' }}>
        {data?.comments?.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CommentMultipleOutline sx={{ height: 50 }} />
            <Typography variant='h6'>No comments Yet</Typography>
            <Typography variant='body2'>
              Give feedback, ask questions, or start a discussion in the comments.
            </Typography>
          </Box>
        ) : (
          data?.comments &&
          data?.comments.map((comment: any) => (
            <Box
              key={comment.id}
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems:
                  comment?.user?.code === user?.code || comment?.user?.email === user?.email ? 'flex-end' : 'flex-start'
              }}
            >
              <Tooltip
                title={`${comment?.user?.firstName} ${comment?.user?.lastName} - ${formatDateTime(comment.createdAt)}`}
              >
                <Typography
                  variant='body2'
                  sx={{ mb: 0.5, maxWidth: '80%' }}
                  noWrap
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <strong>{`${comment?.user?.firstName} ${comment?.user?.lastName}`}</strong> -{' '}
                  {formatDateTime(comment.createdAt)}
                </Typography>
              </Tooltip>
              <Box
                sx={{
                  maxWidth: '80%',
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    comment?.user?.code === user?.code || comment?.user?.email === user?.email ? '#eefbe5' : '#f5f5f5',
                  color:
                    comment?.user?.code === user?.code || comment?.user?.email === user?.email
                      ? 'primary.contrastText'
                      : 'text.primary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant='body2'>{comment.title}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

export default CommentComponent

export const CommonActivityTab = ({ data, getCorporateStudentsDetailById }: any) => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Card sx={{ mt: 2 }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label='tabs'>
        <Tab label='Comments' sx={{ width: '100%' }} />
        {/* <Tab label='Activity Timeline' /> */}
      </Tabs>
      <CardContent>
        {tabValue === 0 && (
          <Box>
            <CommentComponent data={data} getCorporateStudentsDetailById={getCorporateStudentsDetailById} />
          </Box>
        )}
        {/* {tabValue === 1 && (
          <Box>
            <EcommerceActivityTimeline data={data} />
          </Box>
        )} */}
      </CardContent>
    </Card>
  )
}
