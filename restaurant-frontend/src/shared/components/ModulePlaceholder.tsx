import { Button } from './Button'

interface ModulePlaceholderProps {
  description: string
  eyebrow: string
  primaryAction: string
  title: string
}

export function ModulePlaceholder({
  description,
  eyebrow,
  primaryAction,
  title,
}: ModulePlaceholderProps) {
  return (
    <section className="module-placeholder">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Button>{primaryAction}</Button>
    </section>
  )
}
