import { createContext, useContext, useState, ReactNode } from 'react'

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a Dialog')
  }
  return context
}

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

const Dialog = ({ open: controlledOpen, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  asChild?: boolean
  children: ReactNode
}

const DialogTrigger = ({ children }: DialogTriggerProps) => {
  const { onOpenChange } = useDialog()
  
  return (
    <div onClick={() => onOpenChange(true)}>
      {children}
    </div>
  )
}

interface DialogContentProps {
  className?: string
  children: ReactNode
}

const DialogContent = ({ className = '', children }: DialogContentProps) => {
  const { open, onOpenChange } = useDialog()
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className={`relative bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4 ${className}`}>
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
)

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle }