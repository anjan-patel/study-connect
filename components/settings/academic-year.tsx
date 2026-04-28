'use client'

import { useState } from 'react'
import { Plus, Calendar, CheckCircle, Circle, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField } from './form-field'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { academicYears as initialYears } from '@/lib/settings-data'
import type { AcademicYear } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface AcademicYearScreenProps {
  onBack?: () => void
  onNavigateToTerms?: (yearId: string) => void
}

export function AcademicYearScreen({ onBack, onNavigateToTerms }: AcademicYearScreenProps) {
  const [years, setYears] = useState<AcademicYear[]>(initialYears)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [deleteYear, setDeleteYear] = useState<AcademicYear | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({ name: '', startDate: '', endDate: '' })
    setErrors({})
  }

  const openAddDialog = () => {
    resetForm()
    setEditingYear(null)
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (year: AcademicYear) => {
    setFormData({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate
    })
    setEditingYear(year)
    setIsAddDialogOpen(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Year name is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (editingYear) {
      setYears((prev) =>
        prev.map((y) =>
          y.id === editingYear.id
            ? { ...y, name: formData.name, startDate: formData.startDate, endDate: formData.endDate }
            : y
        )
      )
    } else {
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: false
      }
      setYears((prev) => [newYear, ...prev])
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDelete = (year: AcademicYear) => {
    setYears((prev) => prev.filter((y) => y.id !== year.id))
    setDeleteYear(null)
  }

  const handleSetActive = (yearId: string) => {
    setYears((prev) =>
      prev.map((y) => ({ ...y, isActive: y.id === yearId }))
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <MobileShell
      title="Academic Year"
      subtitle="Manage academic sessions"
      onBack={onBack}
      backHref="/settings"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={openAddDialog}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add year</span>
        </Button>
      }
    >
      <div className="px-4 py-4 space-y-3">
        {years.map((year) => (
          <div
            key={year.id}
            className={cn(
              'bg-card rounded-2xl border shadow-sm overflow-hidden',
              year.isActive ? 'border-primary' : 'border-border'
            )}
          >
            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => handleSetActive(year.id)}
                className="flex-shrink-0"
              >
                {year.isActive ? (
                  <CheckCircle className="h-6 w-6 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </button>
              
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onNavigateToTerms?.(year.id)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{year.name}</h3>
                  {year.isActive && (
                    <Badge className="bg-primary/10 text-primary border-0 text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatDate(year.startDate)} - {formatDate(year.endDate)}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(year)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigateToTerms?.(year.id)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Terms
                  </DropdownMenuItem>
                  {!year.isActive && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteYear(year)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {years.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No academic years</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first academic year to get started
            </p>
            <Button onClick={openAddDialog} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <FormField
              label="Year Name"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., 2024-25"
              required
              error={errors.name}
            />
            
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(value) => setFormData((prev) => ({ ...prev, startDate: value }))}
              required
              error={errors.startDate}
            />
            
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={(value) => setFormData((prev) => ({ ...prev, endDate: value }))}
              required
              error={errors.endDate}
            />
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 rounded-xl">
              {editingYear ? 'Save Changes' : 'Add Year'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteYear} onOpenChange={() => setDeleteYear(null)}>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Academic Year?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteYear?.name}&quot; and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteYear && handleDelete(deleteYear)}
              className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  )
}
