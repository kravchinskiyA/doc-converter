'use client';

import * as React from 'react';
import { useRouter } from '@/shared/i18n';
import type {
  PlanTier,
  UserProfile,
  ApiKeyInfo,
  StorageQuota,
  SavedFile,
  SupportAccessRequest,
  SubscriptionDetails,
} from '@doc-converter/contracts';
import { STORAGE_LIMITS_BYTES } from '@doc-converter/contracts';
import type {
  AccountTabKey,
  PaymentTransactionItem,
  EmailChangeFlowState,
  PasswordChangeFlowState,
  ApiKeyRotateFlowState,
  RecoveryCodesFlowState,
  SupportAccessApprovalFlowState,
  CancelSubscriptionFlowState,
  ChangePlanFlowState,
  DeleteAccountFlowState,
} from './types';

// Демо-данные для начального состояния (соответствуют ТЗ)
const INITIAL_PROFILE: UserProfile = {
  id: 'usr_eu_987214',
  email: 'alexey.k@example.com',
  firstName: 'Алексей',
  lastName: 'Коваленко',
  emailVerified: true,
  createdAt: '2026-05-10T12:00:00Z',
};

const INITIAL_FILES: SavedFile[] = [
  {
    id: 'file_01',
    name: 'Audit_Report_2026_Q3.pdf',
    format: 'DOCX',
    sizeBytes: 14850000, // 14.85 MB
    createdAt: '2026-10-15T10:30:00Z',
    expiresAt: '2027-04-15T10:30:00Z', // 6 месяцев по ТЗ §10.1
    source: 'web',
    downloadUrl: '#',
  },
  {
    id: 'file_02',
    name: 'Technical_Specification_v1.docx',
    format: 'PDF',
    sizeBytes: 42300000, // 42.3 MB
    createdAt: '2026-10-20T14:15:00Z',
    expiresAt: '2027-04-20T14:15:00Z',
    source: 'web',
    downloadUrl: '#',
  },
  {
    id: 'file_03',
    name: 'Contracts_Batch_Archive.zip',
    format: 'PDF',
    sizeBytes: 89100000, // 89.1 MB
    createdAt: '2026-10-28T09:00:00Z',
    expiresAt: '2027-04-28T09:00:00Z',
    source: 'api',
    downloadUrl: '#',
  },
  {
    id: 'file_04',
    name: 'Scanned_Receipts_Oct.pdf',
    format: 'DOCX',
    sizeBytes: 31200000, // 31.2 MB
    createdAt: '2026-11-01T16:45:00Z',
    expiresAt: '2027-05-01T16:45:00Z',
    source: 'api',
    downloadUrl: '#',
  },
];

const INITIAL_TRANSACTIONS: PaymentTransactionItem[] = [
  {
    id: 'tx_stripe_9921',
    date: '2026-10-01T11:00:00Z',
    description: 'Pro Тариф (Месячная подписка)',
    amountEur: 5.0,
    type: 'charge',
    status: 'succeeded',
    invoiceUrl: '#',
  },
  {
    id: 'tx_stripe_8842',
    date: '2026-09-01T11:00:00Z',
    description: 'Pro Тариф (Месячная подписка)',
    amountEur: 5.0,
    type: 'charge',
    status: 'succeeded',
    invoiceUrl: '#',
  },
];

const INITIAL_SUPPORT_REQUESTS: SupportAccessRequest[] = [
  {
    id: 'supp_req_541',
    staffName: 'Елена Марченко (Support Tier 2)',
    staffEmail: 'e.marchenko@doc-converter.internal',
    reason:
      'Диагностика сбоя OCR при распознавании таблиц в сложном сканированном документе (Тикет #49281)',
    fileIds: ['file_01'],
    fileNames: ['Audit_Report_2026_Q3.pdf'],
    status: 'pending',
    requestedAt: '2026-11-06T12:00:00Z',
    expiresAt: '2026-11-07T12:00:00Z', // 24 часа по ТЗ §12.17
  },
];

export function useAccountState() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<AccountTabKey>('profile');

  // Состояние пользователя
  const [userProfile, setUserProfile] = React.useState<UserProfile>(INITIAL_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
  });

  // Состояние подписки
  const [subscription, setSubscription] = React.useState<SubscriptionDetails>({
    plan: 'pro',
    billingPeriod: 'monthly',
    priceEur: 5.0,
    autoRenew: false, // По умолчанию выключено по ТЗ §11.1
    currentPeriodEnd: '2026-11-20T23:59:59Z',
    cancelAtPeriodEnd: false,
    status: 'active',
  });
  const [transactions, setTransactions] =
    React.useState<PaymentTransactionItem[]>(INITIAL_TRANSACTIONS);

  // Сохраненные файлы
  const [files, setFiles] = React.useState<SavedFile[]>(INITIAL_FILES);
  const [selectedFileIds, setSelectedFileIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sourceFilter, setSourceFilter] = React.useState<'all' | 'web' | 'api'>('all');

  // API-ключ
  const [apiKey, setApiKey] = React.useState<ApiKeyInfo>({
    hasKey: true,
    keyPreview: 'dc_live_7c4a••••••••••••••••9e21',
    createdAt: '2026-06-15T08:30:00Z',
    hasActiveConversions: false, // ТЗ §7: запрет замены при активных конвертациях
  });
  const [isApiKeyRevealed, setIsApiKeyRevealed] = React.useState(false);
  const [rawApiKeyValue, setRawApiKeyValue] = React.useState(
    'dc_live_7c4af9801be9d150247659ba34e9e21'
  );

  // Служебный доступ поддержки (ТЗ §12.17)
  const [supportRequests, setSupportRequests] =
    React.useState<SupportAccessRequest[]>(INITIAL_SUPPORT_REQUESTS);

  // Резервные коды (ТЗ §6.5)
  const [recoveryCodesCount, setRecoveryCodesCount] = React.useState<number>(10);
  const [generatedCodesList, setGeneratedCodesList] = React.useState<string[]>([]);

  // Двухэтапная смена email (ТЗ §6.2)
  const [emailChangeFlow, setEmailChangeFlow] = React.useState<EmailChangeFlowState>({
    isOpen: false,
    step: 'init',
    newEmail: '',
    oldEmailCode: '',
    newEmailCode: '',
    terminateSessionsAndApiKey: true, // Включен по умолчанию по ТЗ §6.2
    timeLeftSeconds: 1200, // 20 минут
    isSubmitting: false,
  });

  // Таймер смены email
  React.useEffect(() => {
    if (!emailChangeFlow.isOpen || emailChangeFlow.step === 'completed') return;
    const interval = setInterval(() => {
      setEmailChangeFlow((prev) => {
        if (prev.timeLeftSeconds <= 1) {
          return {
            ...prev,
            isOpen: false,
            step: 'init',
            error: 'Срок действия операции (20 минут) истек. Начните заново.',
          };
        }
        return { ...prev, timeLeftSeconds: prev.timeLeftSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [emailChangeFlow.isOpen, emailChangeFlow.step]);

  // Смена пароля (ТЗ §6.3)
  const [passwordChangeFlow, setPasswordChangeFlow] =
    React.useState<PasswordChangeFlowState>({
      isOpen: false,
      step: 'input',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      emailCode: '',
      isSubmitting: false,
    });

  // Ротация API-ключа (ТЗ §7)
  const [apiKeyRotateFlow, setApiKeyRotateFlow] =
    React.useState<ApiKeyRotateFlowState>({
      isOpen: false,
      step: 'confirm',
      emailCode: '',
      isSubmitting: false,
    });

  // Резервные коды (ТЗ §6.5)
  const [recoveryCodesFlow, setRecoveryCodesFlow] =
    React.useState<RecoveryCodesFlowState>({
      isOpen: false,
      step: 'request_code',
      emailCode: '',
      codes: [],
      hasConfirmedSaved: false,
      isSubmitting: false,
    });

  // Служебный доступ (ТЗ §12.17)
  const [supportApprovalFlow, setSupportApprovalFlow] =
    React.useState<SupportAccessApprovalFlowState>({
      isOpen: false,
      request: null,
      emailCode: '',
      isSubmitting: false,
    });

  // Отмена подписки (ТЗ §11.2)
  const [cancelSubscriptionFlow, setCancelSubscriptionFlow] =
    React.useState<CancelSubscriptionFlowState>({
      isOpen: false,
      calculatedRefundEur: 2.5, // Половина месяца (5 EUR / 2)
      daysRemaining: 15,
      isSubmitting: false,
    });

  // Смена тарифа (ТЗ §11.3)
  const [changePlanFlow, setChangePlanFlow] = React.useState<ChangePlanFlowState>({
    isOpen: false,
    targetPlan: 'max',
    billingPeriod: 'monthly',
    isUpgrade: true,
    differenceEur: 2.5, // Разница с Pro до Max на остаток месяца
    isSubmitting: false,
  });

  // Удаление аккаунта (ТЗ §6.4)
  const [deleteAccountFlow, setDeleteAccountFlow] =
    React.useState<DeleteAccountFlowState>({
      isOpen: false,
      emailCode: '',
      confirmedCheckbox: false,
      isSubmitting: false,
    });

  // Очистка всего хранилища
  const [isClearStorageOpen, setIsClearStorageOpen] = React.useState(false);

  // Вычисление занятого объема хранилища (ТЗ §10.3)
  const totalLimitBytes = STORAGE_LIMITS_BYTES[subscription.plan];
  const usedBytes = React.useMemo(() => {
    return files.reduce((acc, file) => acc + file.sizeBytes, 0);
  }, [files]);
  const warningThresholdBytes = totalLimitBytes * 0.75;
  const isOver75 = usedBytes >= warningThresholdBytes;
  const isOver100 = usedBytes >= totalLimitBytes;

  const storageQuota: StorageQuota = {
    usedBytes,
    totalBytes: totalLimitBytes,
    plan: subscription.plan,
    warningThresholdBytes,
    isOver75,
    isOver100,
    fileCount: files.length,
  };

  // Методы управления профилем
  const handleUpdateProfile = () => {
    setUserProfile((prev) => ({
      ...prev,
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
    }));
    setIsEditingProfile(false);
  };

  // Методы смены email
  const handleStartEmailChange = () => {
    setEmailChangeFlow({
      isOpen: true,
      step: 'init',
      newEmail: '',
      oldEmailCode: '',
      newEmailCode: '',
      terminateSessionsAndApiKey: true,
      timeLeftSeconds: 1200,
      isSubmitting: false,
    });
  };

  const handleInitEmailSubmit = (newEmail: string) => {
    if (newEmail.toLowerCase() === userProfile.email.toLowerCase()) {
      setEmailChangeFlow((prev) => ({
        ...prev,
        error: 'Новый адрес совпадает с текущим.',
      }));
      return;
    }
    // Симуляция отправки первого кода на старую почту
    setEmailChangeFlow((prev) => ({
      ...prev,
      newEmail,
      step: 'step1_old_email',
      error: undefined,
    }));
  };

  const handleVerifyOldEmailCode = (code: string) => {
    if (code.length !== 6) {
      setEmailChangeFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    // Симуляция отправки второго кода на новую почту
    setEmailChangeFlow((prev) => ({
      ...prev,
      oldEmailCode: code,
      step: 'step2_new_email',
      error: undefined,
    }));
  };

  const handleCompleteEmailChange = (code: string) => {
    if (code.length !== 6) {
      setEmailChangeFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      email: emailChangeFlow.newEmail,
    }));
    if (emailChangeFlow.terminateSessionsAndApiKey) {
      setApiKey((prev) => ({ ...prev, hasKey: false, keyPreview: undefined }));
    }
    setEmailChangeFlow((prev) => ({
      ...prev,
      step: 'completed',
      error: undefined,
    }));
  };

  // Методы смены пароля
  const handleStartPasswordChange = () => {
    setPasswordChangeFlow({
      isOpen: true,
      step: 'input',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      emailCode: '',
      isSubmitting: false,
    });
  };

  const handlePasswordInputSubmit = (curr: string, newP: string, confP: string) => {
    if (newP.length < 8 || newP.length > 128) {
      setPasswordChangeFlow((prev) => ({
        ...prev,
        error: 'Пароль должен содержать от 8 до 128 символов.',
      }));
      return;
    }
    if (newP !== confP) {
      setPasswordChangeFlow((prev) => ({
        ...prev,
        error: 'Пароли не совпадают.',
      }));
      return;
    }
    setPasswordChangeFlow((prev) => ({
      ...prev,
      currentPassword: curr,
      newPassword: newP,
      confirmNewPassword: confP,
      step: 'verify_code',
      error: undefined,
    }));
  };

  const handleCompletePasswordChange = (code: string) => {
    if (code.length !== 6) {
      setPasswordChangeFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    // ТЗ §6.3: завершение всех сессий и отключение API-ключа
    setApiKey((prev) => ({ ...prev, hasKey: false, keyPreview: undefined }));
    setPasswordChangeFlow((prev) => ({
      ...prev,
      step: 'completed',
      error: undefined,
    }));
  };

  // Методы API-ключа
  const handleCreateApiKey = () => {
    if (apiKey.hasActiveConversions) return;
    const newKey =
      'dc_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setRawApiKeyValue(newKey);
    setApiKey({
      hasKey: true,
      keyPreview: `dc_live_${newKey.slice(8, 12)}••••••••••••••••${newKey.slice(-4)}`,
      createdAt: new Date().toISOString(),
      hasActiveConversions: false,
    });
  };

  const handleRotateApiKeySubmit = (code: string) => {
    if (code.length !== 6) {
      setApiKeyRotateFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    handleCreateApiKey();
    setApiKeyRotateFlow({
      isOpen: false,
      step: 'confirm',
      emailCode: '',
      isSubmitting: false,
    });
  };

  // Методы файлов
  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSelectedFileIds((prev) => prev.filter((id) => id !== fileId));
  };

  const handleDeleteSelectedFiles = () => {
    setFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
    setSelectedFileIds([]);
  };

  const handleClearAllStorage = () => {
    setFiles([]);
    setSelectedFileIds([]);
    setIsClearStorageOpen(false);
  };

  const handleDownloadSingleFileZip = (file: SavedFile) => {
    // Симуляция скачивания ZIP по ТЗ §10.2
    const dummyContent = `Doc-Converter Result\nFile: ${file.name}\nFormat: ${file.format}\nSize: ${file.sizeBytes} bytes\nCreated: ${file.createdAt}`;
    const blob = new Blob([dummyContent], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_converted.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSelectedZip = () => {
    const selected = files.filter((f) => selectedFileIds.includes(f.id));
    if (selected.length === 0) return;
    const summary = selected.map((f) => `${f.name} (${f.format})`).join('\n');
    const blob = new Blob([summary], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doc_converter_batch_${selected.length}_files.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Методы подписки
  const handleToggleAutoRenew = () => {
    setSubscription((prev) => ({ ...prev, autoRenew: !prev.autoRenew }));
  };

  const handleCancelSubscriptionSubmit = () => {
    // ТЗ §11.2: немедленный переход на Basic и возврат на карту
    setSubscription((prev) => ({
      ...prev,
      plan: 'basic',
      autoRenew: false,
      status: 'canceled',
    }));
    setTransactions((prev) => [
      {
        id: `tx_refund_${Date.now()}`,
        date: new Date().toISOString(),
        description: `Возврат за неиспользованный остаток периода (${cancelSubscriptionFlow.calculatedRefundEur.toFixed(2)} €)`,
        amountEur: -cancelSubscriptionFlow.calculatedRefundEur,
        type: 'refund',
        status: 'succeeded',
      },
      ...prev,
    ]);
    setCancelSubscriptionFlow((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChangePlanSubmit = (newPlan: PlanTier) => {
    setSubscription((prev) => ({
      ...prev,
      plan: newPlan,
      priceEur: newPlan === 'max' ? 10.0 : newPlan === 'pro' ? 5.0 : 0,
    }));
    setTransactions((prev) => [
      {
        id: `tx_prorate_${Date.now()}`,
        date: new Date().toISOString(),
        description: `Смена тарифа на ${newPlan.toUpperCase()} (доплата/перерасчет)`,
        amountEur: 2.5,
        type: 'upgrade_proration',
        status: 'succeeded',
      },
      ...prev,
    ]);
    setChangePlanFlow((prev) => ({ ...prev, isOpen: false }));
  };

  // Методы резервных кодов (ТЗ §6.5)
  const handleGenerateRecoveryCodes = (code: string) => {
    if (code.length !== 6) {
      setRecoveryCodesFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    // Генерация 10 случайных кодов вида "A7X9-4K2P-9M3L"
    const newCodes = Array.from({ length: 10 }, () => {
      const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const seg3 = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `${seg1}-${seg2}-${seg3}`;
    });
    setGeneratedCodesList(newCodes);
    setRecoveryCodesCount(10);
    setRecoveryCodesFlow({
      isOpen: true,
      step: 'display_codes',
      emailCode: '',
      codes: newCodes,
      hasConfirmedSaved: false,
      isSubmitting: false,
    });
  };

  // Методы служебного доступа (ТЗ §12.17)
  const handleApproveSupportAccess = (requestId: string, code: string) => {
    if (code.length !== 6) {
      setSupportApprovalFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    setSupportRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'active' as const } : r
      )
    );
    setSupportApprovalFlow({
      isOpen: false,
      request: null,
      emailCode: '',
      isSubmitting: false,
    });
  };

  const handleRevokeSupportAccess = (requestId: string) => {
    setSupportRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'revoked' as const } : r
      )
    );
  };

  // Удаление аккаунта (ТЗ §6.4)
  const handleDeleteAccountSubmit = (code: string) => {
    if (code.length !== 6) {
      setDeleteAccountFlow((prev) => ({
        ...prev,
        error: 'Введите корректный 6-значный код.',
      }));
      return;
    }
    // Симуляция удаления
    setFiles([]);
    setApiKey((prev) => ({ ...prev, hasKey: false, keyPreview: undefined }));
    setDeleteAccountFlow((prev) => ({ ...prev, isOpen: false }));
    router.push('/');
  };

  // Фильтрация файлов
  const filteredFiles = React.useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSource =
        sourceFilter === 'all' || file.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [files, searchQuery, sourceFilter]);

  return {
    // Вкладки
    activeTab,
    setActiveTab,

    // Профиль
    userProfile,
    isEditingProfile,
    setIsEditingProfile,
    profileForm,
    setProfileForm,
    handleUpdateProfile,

    // Смена email
    emailChangeFlow,
    setEmailChangeFlow,
    handleStartEmailChange,
    handleInitEmailSubmit,
    handleVerifyOldEmailCode,
    handleCompleteEmailChange,

    // Смена пароля
    passwordChangeFlow,
    setPasswordChangeFlow,
    handleStartPasswordChange,
    handlePasswordInputSubmit,
    handleCompletePasswordChange,

    // Хранилище и файлы
    storageQuota,
    files: filteredFiles,
    allFilesCount: files.length,
    selectedFileIds,
    setSelectedFileIds,
    searchQuery,
    setSearchQuery,
    sourceFilter,
    setSourceFilter,
    handleDeleteFile,
    handleDeleteSelectedFiles,
    handleClearAllStorage,
    handleDownloadSingleFileZip,
    handleDownloadSelectedZip,
    isClearStorageOpen,
    setIsClearStorageOpen,

    // API-ключ
    apiKey,
    rawApiKeyValue,
    isApiKeyRevealed,
    setIsApiKeyRevealed,
    handleCreateApiKey,
    apiKeyRotateFlow,
    setApiKeyRotateFlow,
    handleRotateApiKeySubmit,

    // Подписка
    subscription,
    transactions,
    handleToggleAutoRenew,
    cancelSubscriptionFlow,
    setCancelSubscriptionFlow,
    handleCancelSubscriptionSubmit,
    changePlanFlow,
    setChangePlanFlow,
    handleChangePlanSubmit,

    // Резервные коды
    recoveryCodesCount,
    generatedCodesList,
    recoveryCodesFlow,
    setRecoveryCodesFlow,
    handleGenerateRecoveryCodes,

    // Служебный доступ
    supportRequests,
    supportApprovalFlow,
    setSupportApprovalFlow,
    handleApproveSupportAccess,
    handleRevokeSupportAccess,

    // Удаление аккаунта
    deleteAccountFlow,
    setDeleteAccountFlow,
    handleDeleteAccountSubmit,
  };
}

