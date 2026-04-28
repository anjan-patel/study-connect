'use client'

import { useState } from 'react'
import { Camera, Upload, CheckCircle2 } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField, TextareaField } from './form-field'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { schoolInfo as initialSchoolInfo } from '@/lib/settings-data'
import type { SchoolInfo } from '@/lib/settings-types'

interface SchoolInfoScreenProps {
  onBack?: () => void
  onSave?: (data: SchoolInfo) => void
}

export function SchoolInfoScreen({ onBack, onSave }: SchoolInfoScreenProps) {
  const [formData, setFormData] = useState<SchoolInfo>(initialSchoolInfo)
  const [errors, setErrors] = useState<Partial<Record<keyof SchoolInfo, string>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const updateField = (field: keyof SchoolInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SchoolInfo, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'School name is required'
    }
    if (!formData.code.trim()) {
      newErrors.code = 'School code is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowSuccess(true)
    
    if (onSave) {
      onSave(formData)
    }

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <MobileShell
      title="School Information"
      subtitle="Basic school details"
      onBack={onBack}
      backHref="/settings"
    >
      <div className="px-4 py-4 space-y-6">
        {/* Logo Upload */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={formData.logo} alt="School Logo" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {formData.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
              aria-label="Upload logo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">Tap to change school logo</p>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-4">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h2>
            
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <FormField
                label="School Name"
                name="name"
                value={formData.name}
                onChange={(value) => updateField('name', value)}
                placeholder="Enter school name"
                required
                error={errors.name}
              />
              
              <FormField
                label="School Code"
                name="code"
                value={formData.code}
                onChange={(value) => updateField('code', value)}
                placeholder="e.g., DPS-001"
                required
                error={errors.code}
                hint="Unique identifier for your school"
              />
              
              <FormField
                label="Affiliation Number"
                name="affiliationNumber"
                value={formData.affiliationNumber}
                onChange={(value) => updateField('affiliationNumber', value)}
                placeholder="e.g., CBSE/2023/12345"
              />
              
              <FormField
                label="Established Year"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={(value) => updateField('establishedYear', value)}
                placeholder="e.g., 1995"
                type="number"
              />
              
              <FormField
                label="Principal Name"
                name="principalName"
                value={formData.principalName}
                onChange={(value) => updateField('principalName', value)}
                placeholder="Enter principal name"
              />
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h2>
            
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <FormField
                label="Email"
                name="email"
                value={formData.email}
                onChange={(value) => updateField('email', value)}
                placeholder="info@school.edu.in"
                type="email"
                required
                error={errors.email}
              />
              
              <FormField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={(value) => updateField('phone', value)}
                placeholder="+91 11 2345 6789"
                type="tel"
                required
                error={errors.phone}
              />
              
              <FormField
                label="Website"
                name="website"
                value={formData.website}
                onChange={(value) => updateField('website', value)}
                placeholder="www.school.edu.in"
                type="url"
              />
            </div>
          </section>

          {/* Address */}
          <section className="space-y-4">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Address
            </h2>
            
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <TextareaField
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={(value) => updateField('address', value)}
                placeholder="Enter full street address"
                rows={2}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={(value) => updateField('city', value)}
                  placeholder="City"
                />
                
                <FormField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={(value) => updateField('state', value)}
                  placeholder="State"
                />
              </div>
              
              <FormField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={(value) => updateField('pincode', value)}
                placeholder="110001"
                type="number"
                required
                error={errors.pincode}
              />
            </div>
          </section>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-12 rounded-xl text-base font-medium"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving...
              </span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Saved Successfully
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </MobileShell>
  )
}
