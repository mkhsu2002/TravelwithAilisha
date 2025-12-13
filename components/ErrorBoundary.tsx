import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('錯誤邊界捕獲到錯誤', 'ErrorBoundary', { error, errorInfo });
    
    // 生產環境可整合錯誤追蹤服務
    if (import.meta.env.PROD) {
      // TODO: 整合錯誤追蹤服務（如 Sentry）
      // errorTrackingService.captureException(error, {
      //   contexts: { react: errorInfo }
      // });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              發生錯誤
            </h1>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || '應用程式發生未預期的錯誤'}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReset}>
                重新載入應用程式
              </Button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                返回上一頁
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

