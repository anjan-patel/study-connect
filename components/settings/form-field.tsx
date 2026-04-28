'use client'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'url' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  success?: string
  hint?: string
  className?: string
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  disabled,
  error,
  success,
  hint,
  className
}: FormFieldProps) {
  const hasError = Boolean(error)
  const hasSuccess = Boolean(success)

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={name}
        className={cn(
          'text-sm font-medium',
          hasError && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'h-12 rounded-xl',
            hasError && 'border-destructive focus-visible:ring-destructive',
            hasSuccess && 'border-success focus-visible:ring-success'
          )}
        />
        
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError && <AlertCircle className="h-5 w-5 text-destructive" />}
            {hasSuccess && <CheckCircle2 className="h-5 w-5 text-success" />}
          </div>
        )}
      </div>
      
      {(error || success || hint) && (
        <p className={cn(
          'text-xs',
          hasError && 'text-destructive',
          hasSuccess && 'text-success',
          !hasError && !hasSuccess && 'text-muted-foreground'
        )}>
          {error || success || hint}
        </p>
      )}
    </div>
  )
}

interface TextareaFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rows?: number
  className?: string
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  error,
  rows = 3,
  className
}: TextareaFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={name}
        className={cn(
          'text-sm font-medium',
          hasError && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'rounded-xl resize-none',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  disabled,
  error,
  className
}: SelectFieldProps) {
  const hasError = Boolean(error)

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={name}
        className={cn(
          'text-sm font-medium',
          hasError && 'text-destructive'
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          className={cn(
            'h-12 rounded-xl',
            hasError && 'border-destructive focus:ring-destructive'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

interface ColorPickerFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  presets?: string[]
  className?: string
}

export function ColorPickerField({
  label,
  name,
  value,
  onChange,
  presets = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0d9488'],
  className
}: ColorPickerFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-xl border-2 border-border flex-shrink-0 cursor-pointer overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full cursor-pointer opacity-0"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'h-8 w-8 rounded-lg transition-all',
                value === preset && 'ring-2 ring-primary ring-offset-2'
              )}
              style={{ backgroundColor: preset }}
              aria-label={`Select color ${preset}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
