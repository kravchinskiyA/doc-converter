'use client';

import * as React from 'react';
import {
  AdminHeader,
  AdminNavTabs,
  AdminMetricsSection,
  AdminUsersSection,
  AdminJobsSection,
  AdminBillingSection,
  AdminEmergencySection,
  AdminAuditSection,
  EmergencyActionDialog,
  StaffLoginForm,
  useAdminState,
} from '@/features/admin';

export function AdminPage() {
  const admin = useAdminState();

  if (!admin.session) {
    return (
      <div className="min-h-screen bg-[#f2f2f4] text-off-black flex items-center justify-center px-4 pb-20">
        <StaffLoginForm onSuccess={admin.login} />
      </div>
    );
  }

  const failedJobsCount = admin.rawJobs.filter((j) => j.status === 'failed').length;
  const isGlobalPaused = admin.metrics.infrastructure.globalConversionsPaused;

  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Шапка административной панели */}
        <AdminHeader
          session={admin.session}
          onLogout={admin.logout}
          onSwitchRole={admin.switchRole}
          globalPauseActive={isGlobalPaused}
        />

        {/* Навигационная панель вкладок */}
        <div className="sticky top-20 z-20 pt-1 pb-2 bg-[#f2f2f4]/90 backdrop-blur-md">
          <AdminNavTabs
            activeTab={admin.activeTab}
            onTabChange={admin.setActiveTab}
            failedJobsCount={failedJobsCount}
            globalPaused={isGlobalPaused}
          />
        </div>

        {/* Уведомление об операции */}
        {admin.toastMessage && (
          <div className="rounded-[20px] bg-off-black text-pure-white px-5 py-3 text-[14px] font-book flex items-center justify-between shadow-none animate-in fade-in slide-in-from-top-2">
            <span>{admin.toastMessage}</span>
          </div>
        )}

        {/* Контент активной вкладки */}
        <div className="pt-2">
          {admin.activeTab === 'metrics' && (
            <AdminMetricsSection metrics={admin.metrics} />
          )}

          {admin.activeTab === 'users' && (
            <AdminUsersSection
              users={admin.users}
              userSearch={admin.userSearch}
              setUserSearch={admin.setUserSearch}
              userFilter={admin.userFilter}
              setUserFilter={admin.setUserFilter}
              staffRole={admin.session.role}
              onOpenEmergencyModal={admin.openEmergencyModal}
            />
          )}

          {admin.activeTab === 'jobs' && (
            <AdminJobsSection
              jobs={admin.jobs}
              jobSearch={admin.jobSearch}
              setJobSearch={admin.setJobSearch}
              jobFilter={admin.jobFilter}
              setJobFilter={admin.setJobFilter}
            />
          )}

          {admin.activeTab === 'billing' && (
            <AdminBillingSection
              payments={admin.payments}
              staffRole={admin.session.role}
              onRetryRefund={admin.handleRetryRefund}
            />
          )}

          {admin.activeTab === 'emergency' && (
            <AdminEmergencySection
              metrics={admin.metrics}
              staffRole={admin.session.role}
              onOpenEmergencyModal={admin.openEmergencyModal}
            />
          )}

          {admin.activeTab === 'audit' && (
            <AdminAuditSection auditLogs={admin.auditLogs} />
          )}
        </div>

        {/* Модальный диалог подтверждения экстренного действия с обязательной причиной */}
        <EmergencyActionDialog
          modal={admin.emergencyModal}
          onClose={admin.closeEmergencyModal}
          onConfirm={admin.handleConfirmEmergencyAction}
        />
      </div>
    </div>
  );
}

