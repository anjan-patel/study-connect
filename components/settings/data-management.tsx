"use client"

import { useState } from "react"
import { MobileShell } from "./mobile-shell"
import { SettingsCard, SettingsRow } from "./settings-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Database, 
  Download,
  Upload,
  Trash2,
  HardDrive,
  Cloud,
  Clock,
  FileArchive,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Shield,
  History
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { FormInput, FormSelect } from "./form-field"

interface Backup {
  id: string
  name: string
  date: string
  size: string
  type: "auto" | "manual"
  status: "completed" | "in-progress" | "failed"
}

const mockBackups: Backup[] = [
  { id: "1", name: "Daily Backup", date: "Today, 2:00 AM", size: "245 MB", type: "auto", status: "completed" },
  { id: "2", name: "Weekly Backup", date: "Apr 21, 2024", size: "1.2 GB", type: "auto", status: "completed" },
  { id: "3", name: "Pre-Update Backup", date: "Apr 18, 2024", size: "238 MB", type: "manual", status: "completed" },
  { id: "4", name: "Monthly Backup", date: "Apr 1, 2024", size: "1.1 GB", type: "auto", status: "completed" },
]

interface DataManagementProps {
  onBack: () => void
}

export function DataManagement({ onBack }: DataManagementProps) {
  const [backups, setBackups] = useState<Backup[]>(mockBackups)
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [retentionPeriod, setRetentionPeriod] = useState("30")
  const [showExportSheet, setShowExportSheet] = useState(false)
  const [showImportSheet, setShowImportSheet] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [backingUp, setBackingUp] = useState(false)

  const storageUsed = 2.4 // GB
  const storageTotal = 10 // GB
  const storagePercentage = (storageUsed / storageTotal) * 100

  const handleBackupNow = async () => {
    setBackingUp(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newBackup: Backup = {
      id: Date.now().toString(),
      name: "Manual Backup",
      date: "Just now",
      size: "240 MB",
      type: "manual",
      status: "completed"
    }
    setBackups(prev => [newBackup, ...prev])
    setBackingUp(false)
  }

  const handleExport = async () => {
    setExporting(true)
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setExportProgress(i)
    }
    setExporting(false)
    setExportProgress(0)
    setShowExportSheet(false)
  }

  const deleteBackup = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id))
  }

  return (
    <MobileShell
      title="Data Management"
      onBack={onBack}
    >
      <div className="space-y-4">
        {/* Storage Overview */}
        <SettingsCard
          title="Storage Usage"
          icon={<HardDrive className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {storageUsed} GB of {storageTotal} GB used
              </span>
              <span className="text-sm font-medium">{storagePercentage.toFixed(0)}%</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-muted/50 rounded-xl p-3">
                <Database className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">1.8 GB</p>
                <p className="text-xs text-muted-foreground">Database</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <FileArchive className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">0.6 GB</p>
                <p className="text-xs text-muted-foreground">Files & Media</p>
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Backup Settings */}
        <SettingsCard
          title="Backup Settings"
          icon={<Cloud className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <SettingsRow
              icon={<RefreshCw className="h-5 w-5" />}
              title="Automatic Backups"
              description="Schedule regular data backups"
              action={
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              }
            />
            
            {autoBackup && (
              <>
                <FormSelect
                  label="Backup Frequency"
                  value={backupFrequency}
                  onChange={setBackupFrequency}
                  options={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                />
                <FormSelect
                  label="Retention Period"
                  value={retentionPeriod}
                  onChange={setRetentionPeriod}
                  options={[
                    { value: "7", label: "7 days" },
                    { value: "30", label: "30 days" },
                    { value: "90", label: "90 days" },
                    { value: "365", label: "1 year" },
                  ]}
                />
              </>
            )}

            <Button 
              className="w-full" 
              onClick={handleBackupNow}
              disabled={backingUp}
            >
              {backingUp ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-2" />
                  Backup Now
                </>
              )}
            </Button>
          </div>
        </SettingsCard>

        {/* Recent Backups */}
        <SettingsCard
          title="Recent Backups"
          icon={<History className="h-5 w-5" />}
          description={`${backups.length} backups available`}
        >
          <div className="space-y-3">
            {backups.map((backup) => (
              <div 
                key={backup.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl"
              >
                <div className={`p-2 rounded-lg ${
                  backup.status === "completed" ? "bg-success/10" : 
                  backup.status === "failed" ? "bg-destructive/10" : "bg-primary/10"
                }`}>
                  {backup.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : backup.status === "failed" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{backup.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {backup.type === "auto" ? "Auto" : "Manual"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{backup.date}</span>
                    <span>•</span>
                    <span>{backup.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[340px] rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Backup</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this backup? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteBackup(backup.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </SettingsCard>

        {/* Data Export/Import */}
        <SettingsCard
          title="Data Transfer"
          icon={<Database className="h-5 w-5" />}
        >
          <div className="space-y-2">
            <SettingsRow
              icon={<Download className="h-5 w-5" />}
              title="Export Data"
              description="Download all school data"
              showArrow
              onClick={() => setShowExportSheet(true)}
            />
            <SettingsRow
              icon={<Upload className="h-5 w-5" />}
              title="Import Data"
              description="Restore from backup file"
              showArrow
              onClick={() => setShowImportSheet(true)}
            />
          </div>
        </SettingsCard>

        {/* Danger Zone */}
        <SettingsCard
          title="Danger Zone"
          icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          className="border-destructive/20"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              These actions are irreversible. Please proceed with caution.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[340px] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL school data including students, staff, grades, and records. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    Yes, Clear Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                  <Shield className="h-4 w-4 mr-2" />
                  Reset to Factory Settings
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[340px] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset to Factory Settings</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all configurations to their default values. Your data will be preserved but all customizations will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                    Yes, Reset Settings
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </SettingsCard>
      </div>

      {/* Export Sheet */}
      <Sheet open={showExportSheet} onOpenChange={setShowExportSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Export Data</SheetTitle>
            <SheetDescription>
              Download a complete backup of your school data
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div>
                  <p className="font-medium text-sm">Student Records</p>
                  <p className="text-xs text-muted-foreground">All student profiles and enrollment data</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div>
                  <p className="font-medium text-sm">Staff Records</p>
                  <p className="text-xs text-muted-foreground">Teacher and admin profiles</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div>
                  <p className="font-medium text-sm">Academic Data</p>
                  <p className="text-xs text-muted-foreground">Grades, attendance, and reports</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <div>
                  <p className="font-medium text-sm">Financial Records</p>
                  <p className="text-xs text-muted-foreground">Fee payments and transactions</p>
                </div>
              </label>
            </div>

            {exporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowExportSheet(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleExport} disabled={exporting}>
              {exporting ? "Exporting..." : "Export as ZIP"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Import Sheet */}
      <Sheet open={showImportSheet} onOpenChange={setShowImportSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Import Data</SheetTitle>
            <SheetDescription>
              Restore data from a backup file
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Drop your backup file here</p>
              <p className="text-sm text-muted-foreground mb-3">or click to browse</p>
              <Button variant="outline" size="sm">Select File</Button>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Warning</p>
                  <p className="text-xs text-muted-foreground">
                    Importing data will overwrite existing records. Make sure to backup current data first.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowImportSheet(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled>
              Import
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </MobileShell>
  )
}
