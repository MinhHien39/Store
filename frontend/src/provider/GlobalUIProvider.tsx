"use client";

// src/provider/GlobalUIProvider.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import AlertComponent, { AlertConfig, AlertType } from "@/core/base/BaseAlert";
import DialogComponent, { DialogConfig } from "@/core/base/BaseDialog";
import BaseLoading from "@/core/base/BaseLoading";
import BaseProcessLoading from "@/core/base/BaseProcessLoading";
import { t } from "@/core/localized";
import ApiError from "@/core/api/ApiError";

interface GlobalUIContextType {
  // Alert methods
  showAlert: (config: AlertConfig) => void;

  // Dialog methods
  showDialog: (config: DialogConfig) => void;
  closeDialog: () => void;

  // Loading methods
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: boolean;

  // Process Loading methods
  showProcessLoading: () => void;
  hideProcessLoading: () => void;
  isProcessLoading: boolean;

  // Helper methods
  showSuccessAlert: (message: string, duration?: number) => void;
  showErrorAlert: (message: string, duration?: number) => void;
  showWarningAlert: (message: string, duration?: number) => void;
  showInfoAlert: (message: string, duration?: number) => void;

  // API Error Handler
  handleApiError: (error: ApiError) => void;

  // Async wrapper with loading
  withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(
  undefined,
);

const normalizeApiErrorMessage = (message?: string): string => {
  if (!message) return t.message.errorOccur();

  const normalized = message.trim();
  const messageMap: Record<string, string> = {
    "パスワードが正しくありません。": t.auth.loginError(),
    "ユーザー情報が見つかりません。": t.auth.loginError(),
    "Token情報が存在しません。": t.auth.sessionExpired(),
    "招待リンクが無効または期限切れです": t.auth.changePassword.tokenExpired(),
  };

  return messageMap[normalized] ?? normalized;
};

export const GlobalUIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Alert state
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [alertKey, setAlertKey] = useState<number>(0);

  // Dialog state
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [isProcessLoading, setIsProcessLoading] = useState(false);

  // Alert methods
  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(null);
    setTimeout(() => {
      setAlertKey(Date.now());
      setAlertConfig(config);
    }, 0);
  }, []);

  const showSuccessAlert = useCallback(
    (message: string, duration: number = 3000) => {
      showAlert({
        type: AlertType.success,
        title: t.common.inform(),
        content: message,
      });
    },
    [showAlert],
  );

  const showErrorAlert = useCallback(
    (message: string, duration: number = 5000) => {
      showAlert({
        type: AlertType.error,
        title: t.common.inform(),
        content: message,
      });
    },
    [showAlert],
  );

  const showWarningAlert = useCallback(
    (message: string, duration: number = 4000) => {
      showAlert({
        type: AlertType.warning,
        title: t.common.inform(),
        content: message,
      });
    },
    [showAlert],
  );

  const showInfoAlert = useCallback(
    (message: string, duration: number = 3000) => {
      showAlert({
        type: AlertType.info,
        title: t.common.inform(),
        content: message,
      });
    },
    [showAlert],
  );

  // Dialog methods
  const showDialog = useCallback((config: DialogConfig) => {
    setDialogConfig(config);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    dialogConfig?.onClose?.();
  }, [dialogConfig]);

  // Loading methods
  const showLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const newCount = prev + 1;
      setIsLoading(true);
      return newCount;
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  }, []);

  const showProcessLoading = useCallback(() => {
    setIsProcessLoading(true);
  }, []);

  const hideProcessLoading = useCallback(() => {
    setIsProcessLoading(false);
  }, []);

  // Helper methods
  const handleApiError = useCallback(
    (error: ApiError) => {
      try {
        const statusCode = error.statusCode;
        const message = normalizeApiErrorMessage(error.getMessage());
        const props = {
          title: t.common.error(),
          content: message,
          onAgree: () => { },
          onClose: () => { },
          isOneButton: true,
        };
        showDialog(props);
      } catch (e) {
        console.warn("handleApiError fallback", e);
      } finally {
        hideLoading();
        hideProcessLoading();
      }
    },
    [showDialog, hideLoading, hideProcessLoading],
  );

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>, _message?: string): Promise<T> => {
      showLoading();
      try {
        return await promise;
      } catch (error) {
        handleApiError(error as ApiError);
        throw error;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading, handleApiError],
  );

  return (
    <GlobalUIContext.Provider
      value={{
        // Alert
        showAlert,
        showSuccessAlert,
        showErrorAlert,
        showWarningAlert,
        showInfoAlert,
        // Dialog
        showDialog,
        closeDialog,
        // Loading
        showLoading,
        hideLoading,
        isLoading,
        showProcessLoading,
        hideProcessLoading,
        isProcessLoading,
        // Helpers
        handleApiError,
        withLoading,
      }}
    >
      {children}

      {/* Render Alert */}
      {alertConfig && <AlertComponent key={alertKey} config={alertConfig} />}

      {/* Render Dialog */}
      {dialogConfig && (
        <DialogComponent
          config={{
            ...dialogConfig,
            onClose: closeDialog,
          }}
          isOpen={isDialogOpen}
        />
      )}

      {/* Render Loading */}
      {isLoading && <BaseLoading />}
      {isProcessLoading && <BaseProcessLoading />}
    </GlobalUIContext.Provider>
  );
};

export const useGlobalUI = (): GlobalUIContextType => {
  const context = useContext(GlobalUIContext);
  if (!context) {
    throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  }
  return context;
};

// Backward compatibility - export individual hooks
export const useGlobalAlert = () => {
  const {
    showAlert,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
  } = useGlobalUI();
  return {
    showAlert,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
  };
};

export const useGlobalDialog = () => {
  const { showDialog, closeDialog } = useGlobalUI();
  return { showDialog, closeDialog };
};

export const useGlobalLoading = () => {
  const {
    showLoading,
    hideLoading,
    isLoading,
    showProcessLoading,
    hideProcessLoading,
    isProcessLoading,
  } = useGlobalUI();
  return {
    showLoading,
    hideLoading,
    isLoading,
    showProcessLoading,
    hideProcessLoading,
    isProcessLoading,
  };
};
