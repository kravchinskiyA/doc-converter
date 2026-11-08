'use client';

import * as React from 'react';
import type { StaffRole, ServiceMetrics } from '@doc-converter/contracts';
import type {
  AdminTabKey,
  StaffSession,
  AdminUserItem,
  AdminJobItem,
  AdminPaymentItem,
  AdminAuditItem,
  EmergencyActionModalState,
} from './types';
import {
  initialStaffSession,
  initialMetrics,
  initialAdminUsers,
  initialAdminJobs,
  initialAdminPayments,
  initialAdminAuditLogs,
} from './mock-data';

export function useAdminState() {
  const [session, setSession] = React.useState<StaffSession | null>(initialStaffSession);
  const [activeTab, setActiveTab] = React.useState<AdminTabKey>('metrics');

  const [metrics, setMetrics] = React.useState<ServiceMetrics>(initialMetrics);
  const [users, setUsers] = React.useState<AdminUserItem[]>(initialAdminUsers);
  const [jobs, _setJobs] = React.useState<AdminJobItem[]>(initialAdminJobs);
  const [payments, setPayments] = React.useState<AdminPaymentItem[]>(initialAdminPayments);
  const [auditLogs, setAuditLogs] = React.useState<AdminAuditItem[]>(initialAdminAuditLogs);

  // Фильтры и поиск
  const [userSearch, setUserSearch] = React.useState('');
  const [userFilter, setUserFilter] = React.useState<'all' | 'active' | 'paused'>('all');
  const [jobSearch, setJobSearch] = React.useState('');
  const [jobFilter, setJobFilter] = React.useState<
    'all' | 'completed' | 'processing' | 'queued' | 'failed'
  >('all');

  // Состояние модального окна экстренного действия
  const [emergencyModal, setEmergencyModal] = React.useState<EmergencyActionModalState>({
    isOpen: false,
    type: 'global_pause',
  });

  // Уведомление об успешной операции
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Аутентификация
  const login = (email: string, role: StaffRole, twoFactorType: 'totp' | 'recovery_code' = 'totp') => {
    const newSession: StaffSession = {
      email,
      role,
      authenticatedAt: new Date().toISOString(),
      twoFactorType,
    };
    setSession(newSession);

    const newAudit: AdminAuditItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorEmail: email,
      actorRole: role,
      action: twoFactorType === 'totp' ? 'STAFF_LOGIN_TOTP' : 'STAFF_LOGIN_RECOVERY_CODE',
      target: 'admin_session',
      reason: 'Авторизация в закрытой панели управления персоналом',
      ip: '194.28.112.45',
      result: 'success',
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const logout = () => {
    if (session) {
      const newAudit: AdminAuditItem = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorEmail: session.email,
        actorRole: session.role,
        action: 'STAFF_LOGOUT',
        target: 'admin_session',
        reason: 'Завершение служебной сессии оператором',
        ip: '194.28.112.45',
        result: 'success',
      };
      setAuditLogs((prev) => [newAudit, ...prev]);
    }
    setSession(null);
  };

  const switchRole = (newRole: StaffRole) => {
    if (!session) return;
    setSession({
      ...session,
      role: newRole,
    });
    showToast(`Роль переключена на: ${newRole === 'admin' ? 'Администратор' : 'Поддержка'}`);
  };

  // Открытие модального диалога действия
  const openEmergencyModal = (
    type: EmergencyActionModalState['type'],
    targetUserId?: string,
    userEmail?: string
  ) => {
    setEmergencyModal({
      isOpen: true,
      type,
      targetUserId,
      userEmail,
    });
  };

  const closeEmergencyModal = () => {
    setEmergencyModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Подтверждение экстренного действия
  const handleConfirmEmergencyAction = (reason: string) => {
    if (!session) return;

    const actorEmail = session.email;
    const actorRole = session.role;
    const nowIso = new Date().toISOString();

    if (emergencyModal.type === 'global_pause') {
      setMetrics((prev) => ({
        ...prev,
        infrastructure: {
          ...prev.infrastructure,
          globalConversionsPaused: true,
          globalPauseReason: reason,
          globalPauseAt: nowIso,
          globalPauseBy: actorEmail,
        },
      }));
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: nowIso,
          actorEmail,
          actorRole,
          action: 'GLOBAL_PAUSE_CONVERSIONS',
          target: 'service_global',
          reason,
          ip: '194.28.112.45',
          result: 'success',
        },
        ...prev,
      ]);
      showToast('Глобальный прием конвертаций успешно ПРИОСТАНОВЛЕН');
    } else if (emergencyModal.type === 'global_resume') {
      setMetrics((prev) => ({
        ...prev,
        infrastructure: {
          ...prev.infrastructure,
          globalConversionsPaused: false,
          globalPauseReason: null,
          globalPauseAt: null,
          globalPauseBy: null,
        },
      }));
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: nowIso,
          actorEmail,
          actorRole,
          action: 'GLOBAL_RESUME_CONVERSIONS',
          target: 'service_global',
          reason,
          ip: '194.28.112.45',
          result: 'success',
        },
        ...prev,
      ]);
      showToast('Глобальный прием конвертаций ВОЗОБНОВЛЕН в штатном режиме');
    } else if (emergencyModal.type === 'user_pause' && emergencyModal.targetUserId) {
      const uId = emergencyModal.targetUserId;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === uId ? { ...u, isConversionsPaused: true, pauseReason: reason } : u
        )
      );
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: nowIso,
          actorEmail,
          actorRole,
          action: 'PAUSE_USER_CONVERSIONS',
          target: uId,
          reason,
          ip: '194.28.112.45',
          result: 'success',
        },
        ...prev,
      ]);
      showToast(`Конвертации пользователя ${uId} приостановлены`);
    } else if (emergencyModal.type === 'user_resume' && emergencyModal.targetUserId) {
      const uId = emergencyModal.targetUserId;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === uId ? { ...u, isConversionsPaused: false, pauseReason: null } : u
        )
      );
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: nowIso,
          actorEmail,
          actorRole,
          action: 'RESUME_USER_CONVERSIONS',
          target: uId,
          reason,
          ip: '194.28.112.45',
          result: 'success',
        },
        ...prev,
      ]);
      showToast(`Конвертации пользователя ${uId} возобновлены`);
    } else if (emergencyModal.type === 'revoke_api_key' && emergencyModal.targetUserId) {
      const uId = emergencyModal.targetUserId;
      setUsers((prev) =>
        prev.map((u) => (u.id === uId ? { ...u, apiKeyStatus: 'revoked' } : u))
      );
      setAuditLogs((prev) => [
        {
          id: `aud_${Date.now()}`,
          timestamp: nowIso,
          actorEmail,
          actorRole,
          action: 'REVOKE_API_KEY',
          target: uId,
          reason,
          ip: '194.28.112.45',
          result: 'success',
        },
        ...prev,
      ]);
      showToast(`API-ключ пользователя ${uId} отключен (значение скрыто)`);
    }

    closeEmergencyModal();
  };

  // Повтор неудачного возврата средств Stripe (ТЗ §11.10, без изменения суммы)
  const handleRetryRefund = async (paymentId: string) => {
    if (!session || session.role !== 'admin') return;

    const actorEmail = session.email;
    const actorRole = session.role;
    const nowIso = new Date().toISOString();

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: 'succeeded', refundFailureReason: undefined }
          : p
      )
    );

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        timestamp: nowIso,
        actorEmail,
        actorRole,
        action: 'RETRY_FAILED_REFUND',
        target: paymentId,
        reason: 'Повтор операции возврата Stripe по ТЗ §11.10 без изменения суммы',
        ip: '194.28.112.45',
        result: 'success',
      },
      ...prev,
    ]);

    showToast(`Возврат ${paymentId} успешно отправлен в Stripe (сумма сохранена)`);
  };

  // Фильтрованные списки
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.id.toLowerCase().includes(userSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (userFilter === 'active') return !u.isConversionsPaused;
      if (userFilter === 'paused') return u.isConversionsPaused;
      return true;
    });
  }, [users, userSearch, userFilter]);

  const filteredJobs = React.useMemo(() => {
    return jobs.filter((j) => {
      const matchesSearch =
        j.id.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.userId.toLowerCase().includes(jobSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (jobFilter !== 'all') return j.status === jobFilter;
      return true;
    });
  }, [jobs, jobSearch, jobFilter]);

  return {
    session,
    login,
    logout,
    switchRole,
    activeTab,
    setActiveTab,
    metrics,
    users: filteredUsers,
    rawUsers: users,
    userSearch,
    setUserSearch,
    userFilter,
    setUserFilter,
    jobs: filteredJobs,
    rawJobs: jobs,
    jobSearch,
    setJobSearch,
    jobFilter,
    setJobFilter,
    payments,
    auditLogs,
    emergencyModal,
    openEmergencyModal,
    closeEmergencyModal,
    handleConfirmEmergencyAction,
    handleRetryRefund,
    toastMessage,
  };
}
