'use client'

import { useState } from 'react'
import { Upload, X, CheckCircle2, Eye, Smartphone } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField, ColorPickerField } from './form-field'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { brandingSettings as initialBranding } from '@/lib/settings-data'
import type { BrandingSettings } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface BrandingSettingsScreenProps {
  onBack?: () => void
  onSave?: (data: BrandingSettings) => void
}

export function BrandingSettingsScreen({ onBack, onSave }: BrandingSettingsScreenProps) {
  const [formData, setFormData] = useState<BrandingSettings>(initialBranding)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('colors')

  const updateField = (field: keyof BrandingSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
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
      title="Branding"
      subtitle="Customize appearance"
      onBack={onBack}
      backHref="/settings"
    >
      <div className="px-4 py-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-11 rounded-xl bg-muted p-1">
            <TabsTrigger value="colors" className="rounded-lg text-sm">Colors</TabsTrigger>
            <TabsTrigger value="logo" className="rounded-lg text-sm">Logo</TabsTrigger>
            <TabsTrigger value="text" className="rounded-lg text-sm">Text</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="mt-4 space-y-6">
            {/* Color Settings */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-6">
              <ColorPickerField
                label="Primary Color"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={(value) => updateField('primaryColor', value)}
              />
              
              <ColorPickerField
                label="Secondary Color"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={(value) => updateField('secondaryColor', value)}
              />
              
              <ColorPickerField
                label="Accent Color"
                name="accentColor"
                value={formData.accentColor}
                onChange={(value) => updateField('accentColor', value)}
              />
            </div>

            {/* Preview */}
            <section className="space-y-3">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </h2>
              
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="space-y-4">
                  {/* Mini Preview UI */}
                  <div 
                    className="rounded-xl p-4 text-white"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{formData.appName}</div>
                        <div className="text-sm opacity-80">{formData.tagline}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      className="flex-1 h-10 rounded-lg text-white font-medium text-sm"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="flex-1 h-10 rounded-lg text-white font-medium text-sm"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      Secondary
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: formData.accentColor }}
                    />
                    <span className="text-xs text-muted-foreground">Accent</span>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="logo" className="mt-4 space-y-6">
            {/* Logo Upload */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <h3 className="font-medium text-foreground">App Logo</h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                {formData.logoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="h-24 w-24 object-contain mx-auto"
                    />
                    <button
                      onClick={() => updateField('logoUrl', '')}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Upload Logo</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 2MB</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <h3 className="font-medium text-foreground">Favicon</h3>
              
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                {formData.faviconUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon preview"
                      className="h-12 w-12 object-contain mx-auto"
                    />
                    <button
                      onClick={() => updateField('faviconUrl', '')}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-lg bg-muted mx-auto flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload Favicon</p>
                      <p className="text-xs text-muted-foreground">32x32 or 64x64 ICO/PNG</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-4 space-y-6">
            {/* Text Settings */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
              <FormField
                label="App Name"
                name="appName"
                value={formData.appName}
                onChange={(value) => updateField('appName', value)}
                placeholder="School Connect"
              />
              
              <FormField
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={(value) => updateField('tagline', value)}
                placeholder="Your school motto or tagline"
                hint="Displayed on login screen and app header"
              />
            </div>
          </TabsContent>
        </Tabs>

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
