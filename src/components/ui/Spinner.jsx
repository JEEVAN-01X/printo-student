/**
 * Spinner
 *
 * Accessible loading indicator.
 * size: 'sm' | 'md' | 'lg'
 * color: any Tailwind border color class
 */
export default function Spinner({ size = 'md', color = 'border-brand-orange', className = '' }) {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`
        inline-block rounded-full border-transparent
        ${sizeMap[size]} ${color}
        border-t-current animate-spin
        ${className}
      `}
    />
  )
}