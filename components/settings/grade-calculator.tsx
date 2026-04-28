'use client'

import { useState, useMemo } from 'react'
import { Calculator, RotateCcw } from 'lucide-react'
import { MobileShell } from './mobile-shell'
import { FormField } from './form-field'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { gradeScales } from '@/lib/settings-data'
import { cn } from '@/lib/utils'

interface GradeCalculatorScreenProps {
  onBack?: () => void
}

export function GradeCalculatorScreen({ onBack }: GradeCalculatorScreenProps) {
  const [percentage, setPercentage] = useState(75)
  const [manualInput, setManualInput] = useState('75')

  const calculatedGrade = useMemo(() => {
    return gradeScales.find(
      (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage
    )
  }, [percentage])

  const handleSliderChange = (value: number[]) => {
    setPercentage(value[0])
    setManualInput(value[0].toString())
  }

  const handleInputChange = (value: string) => {
    setManualInput(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setPercentage(num)
    }
  }

  const handleReset = () => {
    setPercentage(75)
    setManualInput('75')
  }

  const getGradeColor = (gradePoint: number) => {
    if (gradePoint >= 9) return 'bg-green-500 text-white'
    if (gradePoint >= 7) return 'bg-blue-500 text-white'
    if (gradePoint >= 5) return 'bg-yellow-500 text-white'
    if (gradePoint >= 3) return 'bg-orange-500 text-white'
    return 'bg-red-500 text-white'
  }

  const getProgressColor = (gradePoint: number) => {
    if (gradePoint >= 9) return 'bg-green-500'
    if (gradePoint >= 7) return 'bg-blue-500'
    if (gradePoint >= 5) return 'bg-yellow-500'
    if (gradePoint >= 3) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <MobileShell
      title="Grade Calculator"
      subtitle="Test your grading scale"
      onBack={onBack}
      backHref="/settings/grading"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleReset}
        >
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">Reset</span>
        </Button>
      }
    >
      <div className="px-4 py-4 space-y-6">
        {/* Result Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 text-center">
          <div className="mb-4">
            <span className="text-6xl font-bold text-foreground">
              {percentage.toFixed(1)}%
            </span>
          </div>
          
          {calculatedGrade ? (
            <div className="space-y-3">
              <Badge
                className={cn(
                  'h-14 w-14 rounded-xl text-2xl font-bold mx-auto flex items-center justify-center',
                  getGradeColor(calculatedGrade.gradePoint)
                )}
              >
                {calculatedGrade.grade}
              </Badge>
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {calculatedGrade.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Grade Point: {calculatedGrade.gradePoint}
                </p>
                <p className="text-sm text-muted-foreground">
                  {calculatedGrade.remarks}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No matching grade found</p>
          )}
        </div>

        {/* Slider Input */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Adjust Percentage
            </label>
            <Slider
              value={[percentage]}
              onValueChange={handleSliderChange}
              min={0}
              max={100}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="relative">
            <FormField
              label="Or enter manually"
              name="percentage"
              type="number"
              value={manualInput}
              onChange={handleInputChange}
              placeholder="Enter percentage"
            />
          </div>
        </div>

        {/* Grade Scale Reference */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Grade Scale Reference
          </h2>
          
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {gradeScales.map((grade) => {
                const isActive = calculatedGrade?.id === grade.id
                return (
                  <div
                    key={grade.id}
                    className={cn(
                      'flex items-center gap-3 p-3 transition-colors',
                      isActive && 'bg-primary/5'
                    )}
                  >
                    <Badge
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold',
                        isActive
                          ? getGradeColor(grade.gradePoint)
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {grade.grade}
                    </Badge>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          'text-sm font-medium',
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {grade.minPercentage}% - {grade.maxPercentage}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {grade.gradePoint} GP
                        </span>
                      </div>
                      
                      {/* Mini progress bar showing range */}
                      <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            isActive ? getProgressColor(grade.gradePoint) : 'bg-muted-foreground/30'
                          )}
                          style={{
                            marginLeft: `${grade.minPercentage}%`,
                            width: `${grade.maxPercentage - grade.minPercentage}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  )
}
