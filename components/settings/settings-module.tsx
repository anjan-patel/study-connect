"use client"

import { useState, createContext, useContext } from "react"
import { SettingsHome } from "./settings-home"
import { SchoolInfoScreen } from "./school-info"
import { BrandingSettings } from "./branding-settings"
import { AcademicYear } from "./academic-year"
import { TermManagementScreen } from "./term-management"
import { GradingScale } from "./grading-scale"
import { GradeCalculator } from "./grade-calculator"
import { NotificationRules } from "./notification-rules"
import { EditNotificationRule } from "./edit-notification-rule"
import { QuietHoursScreen } from "./quiet-hours"
import { PaymentGateway } from "./payment-gateway"
import { PaymentKeysSetupScreen } from "./payment-keys-setup"
import { PaymentMethodsScreen } from "./payment-methods"
import { SMSProviderScreen } from "./sms-provider"
import { SMSTestScreen } from "./sms-test"
import { TransportRoutesScreen } from "./transport-routes"
import { RouteDetail } from "./route-detail"
import { AdminAccounts } from "./admin-accounts"
import { DataManagement } from "./data-management"
import type { UserRole, PaymentGateway as PaymentGatewayType } from "@/lib/settings-types"

// Define all possible screens
export type SettingsScreen =
  | "home"
  | "school-info"
  | "branding"
  | "academic-year"
  | "term-management"
  | "grading-scale"
  | "add-grade"
  | "edit-grade"
  | "grade-calculator"
  | "notification-rules"
  | "edit-notification"
  | "quiet-hours"
  | "payment-gateway"
  | "payment-keys"
  | "payment-methods"
  | "sms-provider"
  | "sms-test"
  | "transport-routes"
  | "route-detail"
  | "add-route"
  | "admin-accounts"
  | "data-management"

interface NavigationState {
  screen: SettingsScreen
  params?: Record<string, string>
}

interface SettingsContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
  navigate: (screen: SettingsScreen, params?: Record<string, string>) => void
  goBack: () => void
  navigationStack: NavigationState[]
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function useSettingsNavigation() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettingsNavigation must be used within SettingsModule")
  }
  return context
}

interface SettingsModuleProps {
  initialRole?: UserRole
}

export function SettingsModule({ initialRole = "admin" }: SettingsModuleProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole)
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([
    { screen: "home" }
  ])

  const currentState = navigationStack[navigationStack.length - 1]

  const navigate = (screen: SettingsScreen, params?: Record<string, string>) => {
    setNavigationStack(prev => [...prev, { screen, params }])
  }

  const goBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1))
    }
  }

  const contextValue: SettingsContextType = {
    currentRole,
    setCurrentRole,
    navigate,
    goBack,
    navigationStack
  }

  const renderScreen = () => {
    const { screen, params } = currentState

    switch (screen) {
      case "home":
        return (
          <SettingsHome
            role={currentRole}
            onNavigate={navigate}
            onRoleChange={setCurrentRole}
          />
        )

      case "school-info":
        return <SchoolInfoScreen onBack={goBack} />

      case "branding":
        return <BrandingSettings onBack={goBack} />

      case "academic-year":
        return (
          <AcademicYear 
            onBack={goBack}
            onManageTerms={() => navigate("term-management")}
          />
        )

      case "term-management":
        return <TermManagementScreen onBack={goBack} />

      case "grading-scale":
        return (
          <GradingScale
            onBack={goBack}
            onAddGrade={() => navigate("add-grade")}
            onEditGrade={(id) => navigate("edit-grade", { gradeId: id })}
            onCalculator={() => navigate("grade-calculator")}
          />
        )

      case "add-grade":
        return (
          <GradingScale
            onBack={goBack}
            onAddGrade={() => {}}
            onEditGrade={() => {}}
            onCalculator={() => navigate("grade-calculator")}
          />
        )

      case "edit-grade":
        return (
          <GradingScale
            onBack={goBack}
            onAddGrade={() => {}}
            onEditGrade={() => {}}
            onCalculator={() => navigate("grade-calculator")}
          />
        )

      case "grade-calculator":
        return <GradeCalculator onBack={goBack} />

      case "notification-rules":
        return (
          <NotificationRules
            onBack={goBack}
            onEditRule={(id) => navigate("edit-notification", { ruleId: id })}
            onQuietHours={() => navigate("quiet-hours")}
          />
        )

      case "edit-notification":
        return (
          <EditNotificationRule
            ruleId={params?.ruleId}
            onBack={goBack}
            onSave={goBack}
          />
        )

      case "quiet-hours":
        return <QuietHoursScreen onBack={goBack} />

      case "payment-gateway":
        return (
          <PaymentGateway
            onBack={goBack}
            onConfigureKeys={(gateway) => navigate("payment-keys", { gateway })}
            onManageMethods={() => navigate("payment-methods")}
          />
        )

      case "payment-keys":
        return (
          <PaymentKeysSetupScreen
            gatewayProvider={(params?.gateway || "razorpay")}
            gatewayName={params?.gateway === "paytm" ? "Paytm" : params?.gateway === "phonepe" ? "PhonePe" : "Razorpay"}
            onBack={goBack}
            onSave={goBack}
          />
        )

      case "payment-methods":
        return <PaymentMethodsScreen onBack={goBack} />

      case "sms-provider":
        return (
          <SmsProvider
            onBack={goBack}
            onTestSms={() => navigate("sms-test")}
          />
        )

      case "sms-test":
        return <SmsTest onBack={goBack} />

      case "transport-routes":
        return (
          <TransportRoutes
            onBack={goBack}
            onAddRoute={() => navigate("add-route")}
            onEditRoute={(id) => navigate("route-detail", { routeId: id })}
          />
        )

      case "add-route":
        return (
          <RouteDetail
            onBack={goBack}
            onSave={goBack}
          />
        )

      case "route-detail":
        return (
          <RouteDetail
            routeId={params?.routeId}
            onBack={goBack}
            onSave={goBack}
          />
        )

      case "admin-accounts":
        return <AdminAccounts onBack={goBack} />

      case "data-management":
        return <DataManagement onBack={goBack} />

      default:
        return (
          <SettingsHome
            role={currentRole}
            onNavigate={navigate}
            onRoleChange={setCurrentRole}
          />
        )
    }
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {renderScreen()}
      </div>
    </SettingsContext.Provider>
  )
}
