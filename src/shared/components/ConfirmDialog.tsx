import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  confirmLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  confirmLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={confirmLoading ? undefined : onCancel} maxWidth='xs' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={onCancel} color='inherit' disabled={confirmLoading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color={destructive ? 'error' : 'primary'}
          disabled={confirmLoading}
          startIcon={confirmLoading ? <CircularProgress size={16} color='inherit' /> : undefined}
        >
          {confirmLoading ? 'Procesando…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
