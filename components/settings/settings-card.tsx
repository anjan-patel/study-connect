'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

interface SettingsCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  rightContent?: React.ReactNode
  showArrow?: boolean
  className?: string
  children?: React.ReactNode
}

export function SettingsCard({
  title,
  description,
  icon,
  href,
  onClick,
  badge,
  badgeVariant = 'secondary',
  rightContent,
  showArrow = true,
  className,
  children
}: SettingsCardProps) {
  const isClickable = href || onClick
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      window.location.href = href
    }
  }

  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border shadow-sm overflow-hidden',
        isClickable && 'cursor-pointer active:bg-accent/50 transition-colors',
        className
      )}
      onClick={isClickable ? handleClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="flex items-center gap-4 p-4">
        {icon && (
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{title}</h3>
            {badge && (
              <Badge variant={badgeVariant} className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        {rightContent}
        
        {isClickable && showArrow && !rightContent && (
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </div>
      
      {children && (
        <div className="border-t border-border px-4 py-3">
          {children}
        </div>
      )}
    </div>
  )
}

interface SettingsToggleCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function SettingsToggleCard({
  title,
  description,
  icon,
  checked,
  onCheckedChange,
  disabled,
  className
}: SettingsToggleCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl border border-border shadow-sm overflow-hidden',
        className
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {icon && (
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

interface SettingsGroupProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function SettingsGroup({ title, children, className }: SettingsGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-3">
          {title}
        </h2>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

interface SettingsRowProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  showArrow?: boolean
  onClick?: () => void
  className?: string
}

export function SettingsRow({
  icon,
  title,
  description,
  action,
  showArrow,
  onClick,
  className
}: SettingsRowProps) {
  const isClickable = !!onClick
  
  return (
    <div
      className={cn(
        'flex items-center gap-4 py-3',
        isClickable && 'cursor-pointer active:bg-accent/50 transition-colors rounded-xl px-2 -mx-2',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {icon && (
        <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      
      {action}
      
      {isClickable && showArrow && !action && (
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      )}
    </div>
  )
}
