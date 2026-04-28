'use client'

import { useState } from 'react'
import { Plus, GraduationCap, MoreVertical, Pencil, Trash2, Calculator, ChevronRight } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField, SelectField } from './form-field'
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
import { gradeScales as initialGrades } from '@/lib/settings-data'
import type { GradeScale } from '@/lib/settings-types'
import { cn } from '@/lib/utils'

interface GradingScaleScreenProps {
  onBack?: () => void
  onOpenCalculator?: () => void
}

export function GradingScaleScreen({ onBack, onOpenCalculator }: GradingScaleScreenProps) {
  const [grades, setGrades] = useState<GradeScale[]>(initialGrades)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState<GradeScale | null>(null)
  const [deleteGrade, setDeleteGrade] = useState<GradeScale | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    minPercentage: '',
    maxPercentage: '',
    grade: '',
    gradePoint: '',
    remarks: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({
      name: '',
      minPercentage: '',
      maxPercentage: '',
      grade: '',
      gradePoint: '',
      remarks: ''
    })
    setErrors({})
  }

  const openAddDialog = () => {
    resetForm()
    setEditingGrade(null)
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (grade: GradeScale) => {
    setFormData({
      name: grade.name,
      minPercentage: grade.minPercentage.toString(),
      maxPercentage: grade.maxPercentage.toString(),
      grade: grade.grade,
      gradePoint: grade.gradePoint.toString(),
      remarks: grade.remarks
    })
    setEditingGrade(grade)
    setIsAddDialogOpen(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade is required'
    }
    if (!formData.minPercentage) {
      newErrors.minPercentage = 'Min percentage is required'
    }
    if (!formData.maxPercentage) {
      newErrors.maxPercentage = 'Max percentage is required'
    }
    if (Number(formData.minPercentage) > Number(formData.maxPercentage)) {
      newErrors.maxPercentage = 'Max must be greater than min'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (editingGrade) {
      setGrades((prev) =>
        prev.map((g) =>
          g.id === editingGrade.id
            ? {
                ...g,
                name: formData.name,
                minPercentage: Number(formData.minPercentage),
                maxPercentage: Number(formData.maxPercentage),
                grade: formData.grade,
                gradePoint: Number(formData.gradePoint),
                remarks: formData.remarks
              }
            : g
        )
      )
    } else {
      const newGrade: GradeScale = {
        id: Date.now().toString(),
        name: formData.name,
        minPercentage: Number(formData.minPercentage),
        maxPercentage: Number(formData.maxPercentage),
        grade: formData.grade,
        gradePoint: Number(formData.gradePoint),
        remarks: formData.remarks
      }
      setGrades((prev) => [...prev, newGrade].sort((a, b) => b.minPercentage - a.minPercentage))
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDelete = (grade: GradeScale) => {
    setGrades((prev) => prev.filter((g) => g.id !== grade.id))
    setDeleteGrade(null)
  }

  const getGradeColor = (gradePoint: number) => {
    if (gradePoint >= 9) return 'bg-green-500/10 text-green-600 border-green-200'
    if (gradePoint >= 7) return 'bg-blue-500/10 text-blue-600 border-blue-200'
    if (gradePoint >= 5) return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
    if (gradePoint >= 3) return 'bg-orange-500/10 text-orange-600 border-orange-200'
    return 'bg-red-500/10 text-red-600 border-red-200'
  }

  return (
    <MobileShell
      title="Grading Scale"
      subtitle="Configure grade boundaries"
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
          <span className="sr-only">Add grade</span>
        </Button>
      }
    >
      <div className="px-4 py-4 space-y-4">
        {/* Grade Calculator Link */}
        <button
          onClick={onOpenCalculator}
          className="w-full bg-primary/5 rounded-2xl border border-primary/20 p-4 flex items-center gap-4"
        >
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-foreground">Grade Calculator</h3>
            <p className="text-sm text-muted-foreground">Test grades with sample percentages</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Grades List */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-center gap-3 p-4"
              >
                <Badge
                  className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold border',
                    getGradeColor(grade.gradePoint)
                  )}
                >
                  {grade.grade}
                </Badge>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground text-sm">{grade.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      ({grade.gradePoint} GP)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {grade.minPercentage}% - {grade.maxPercentage}%
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(grade)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeleteGrade(grade)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {grades.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No grading scale</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define your grading scale to evaluate students
            </p>
            <Button onClick={openAddDialog} className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Grade
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGrade ? 'Edit Grade' : 'Add Grade'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <FormField
              label="Grade Name"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Outstanding"
              required
              error={errors.name}
            />
            
            <FormField
              label="Grade Symbol"
              name="grade"
              value={formData.grade}
              onChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
              placeholder="e.g., A1"
              required
              error={errors.grade}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Min %"
                name="minPercentage"
                type="number"
                value={formData.minPercentage}
                onChange={(value) => setFormData((prev) => ({ ...prev, minPercentage: value }))}
                placeholder="0"
                required
                error={errors.minPercentage}
              />
              
              <FormField
                label="Max %"
                name="maxPercentage"
                type="number"
                value={formData.maxPercentage}
                onChange={(value) => setFormData((prev) => ({ ...prev, maxPercentage: value }))}
                placeholder="100"
                required
                error={errors.maxPercentage}
              />
            </div>
            
            <FormField
              label="Grade Point"
              name="gradePoint"
              type="number"
              value={formData.gradePoint}
              onChange={(value) => setFormData((prev) => ({ ...prev, gradePoint: value }))}
              placeholder="e.g., 10"
            />
            
            <FormField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(value) => setFormData((prev) => ({ ...prev, remarks: value }))}
              placeholder="e.g., Excellent"
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
              {editingGrade ? 'Save Changes' : 'Add Grade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteGrade} onOpenChange={() => setDeleteGrade(null)}>
        <AlertDialogContent className="mx-4 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Grade?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the &quot;{deleteGrade?.grade}&quot; grade.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGrade && handleDelete(deleteGrade)}
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
