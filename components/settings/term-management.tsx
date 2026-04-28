'use client'

import { useState } from 'react'
import { Plus, CalendarDays, CheckCircle, Circle, MoreVertical, Pencil, Trash2 } from 'lucide-react'
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
import { terms as initialTerms } from '@/lib/settings-data'
import type { Term } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface TermManagementScreenProps {
  academicYearId?: string
  academicYearName?: string
  onBack?: () => void
}

export function TermManagementScreen({ 
  academicYearId = '1',
  academicYearName = '2024-25',
  onBack 
}: TermManagementScreenProps) {
  const [terms, setTerms] = useState<Term[]>(
    initialTerms.filter((t) => t.academicYearId === academicYearId)
  )
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [deleteTerm, setDeleteTerm] = useState<Term | null>(null)
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
    setEditingTerm(null)
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (term: Term) => {
    setFormData({
      name: term.name,
      startDate: term.startDate,
      endDate: term.endDate
    })
    setEditingTerm(term)
    setIsAddDialogOpen(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Term name is required'
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

    if (editingTerm) {
      setTerms((prev) =>
        prev.map((t) =>
          t.id === editingTerm.id
            ? { ...t, name: formData.name, startDate: formData.startDate, endDate: formData.endDate }
            : t
        )
      )
    } else {
      const newTerm: Term = {
        id: Date.now().toString(),
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        academicYearId,
        isActive: false
      }
      setTerms((prev) => [...prev, newTerm])
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDelete = (term: Term) => {
    setTerms((prev) => prev.filter((t) => t.id !== term.id))
    setDeleteTerm(null)
  }

  const handleSetActive = (termId: string) => {
    setTerms((prev) =>
      prev.map((t) => ({ ...t, isActive: t.id === termId }))
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getDurationWeeks = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return diffWeeks
  }

  return (
    <MobileShell
      title="Term Management"
      subtitle={`Academic Year ${academicYearName}`}
      onBack={onBack}
      backHref="/settings/academic-year"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={openAddDialog}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add term</span>
        </Button>
      }
    >
      <div className="px-4 py-4 space-y-3">
        {/* Timeline View */}
        <div className="relative">
          {terms.map((term, index) => (
            <div
              key={term.id}
              className={cn(
                'relative pl-8 pb-6',
                index === terms.length - 1 && 'pb-0'
              )}
            >
              {/* Timeline Line */}
              {index < terms.length - 1 && (
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-border" />
              )}
              
              {/* Timeline Dot */}
              <button
                onClick={() => handleSetActive(term.id)}
                className={cn(
                  'absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center transition-colors',
                  term.isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {term.isActive ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              
              {/* Term Card */}
              <div
                className={cn(
                  'bg-card rounded-2xl border shadow-sm overflow-hidden',
                  term.isActive ? 'border-primary' : 'border-border'
                )}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{term.name}</h3>
                      {term.isActive && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(term.startDate)} - {formatDate(term.endDate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getDurationWeeks(term.startDate, term.endDate)} weeks
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(term)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {!term.isActive && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTerm(term)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {terms.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No terms defined</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add terms to organize your academic year
            </p>
            <Button onClick={openAddDialog} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Term
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTerm ? 'Edit Term' : 'Add Term'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <FormField
              label="Term Name"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Term 1, Semester 1"
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
              {editingTerm ? 'Save Changes' : 'Add Term'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTerm} onOpenChange={() => setDeleteTerm(null)}>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Term?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTerm?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTerm && handleDelete(deleteTerm)}
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
