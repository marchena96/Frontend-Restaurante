import { toast } from 'react-toastify'

export const notify = {
  success: (msg: string) => toast.success(msg, { autoClose: 3000 }),
  error: (msg: string) => toast.error(msg, { autoClose: 5000 }),
  info: (msg: string) => toast.info(msg, { autoClose: 3000 }),
}

export function notifyConfirm(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
) {
  const id = toast(
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontSize: 14, lineHeight: 1.4 }}>{message}</span>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            toast.dismiss(id)
            onCancel?.()
          }}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--panel)',
            cursor: 'pointer',
            fontSize: 13,
            color: 'var(--text)',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            toast.dismiss(id)
            onConfirm()
          }}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #d32f2f',
            background: '#d32f2f',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Confirmar
        </button>
      </div>
    </div>,
    {
      autoClose: false,
      closeButton: false,
      draggable: false,
      style: { padding: 16 },
    },
  )
}
