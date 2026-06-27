interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export function SkeletonRow() {
  return (
    <div className="skeleton-row">
      <Skeleton style={{ height: '14px', width: '40%' }} />
      <Skeleton style={{ height: '14px', width: '25%' }} />
      <Skeleton style={{ height: '14px', width: '20%' }} />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton style={{ height: '12px', width: '50%' }} />
      <Skeleton style={{ height: '28px', width: '30%', marginTop: '8px' }} />
      <Skeleton style={{ height: '11px', width: '65%', marginTop: '6px' }} />
    </div>
  )
}
