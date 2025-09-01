import { forwardRef, InputHTMLAttributes } from 'react'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      onChange?.(e)
    }
    
    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          onChange={handleChange}
          {...props}
        />
        <div className={`w-11 h-6 ${props.checked ? 'bg-blue-600' : 'bg-gray-200'} rounded-full relative transition-colors`}>
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${props.checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      </label>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }