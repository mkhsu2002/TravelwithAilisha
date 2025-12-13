import { describe, it, expect, vi } from 'vitest';
import { ErrorHandler, ApiError, NetworkError, ValidationError, StorageError } from './errorHandler';

describe('ErrorHandler', () => {
  describe('錯誤類型', () => {
    it('ApiError 應該有正確的屬性', () => {
      const error = new ApiError('測試錯誤', 'TEST_CODE', 400);
      expect(error.message).toBe('測試錯誤');
      expect(error.code).toBe('TEST_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ApiError');
    });

    it('NetworkError 應該有預設訊息', () => {
      const error = new NetworkError();
      expect(error.message).toBe('網路連線錯誤');
      expect(error.name).toBe('NetworkError');
    });

    it('ValidationError 應該有正確的訊息', () => {
      const error = new ValidationError('驗證失敗');
      expect(error.message).toBe('驗證失敗');
      expect(error.name).toBe('ValidationError');
    });

    it('StorageError 應該有正確的訊息', () => {
      const error = new StorageError('儲存失敗');
      expect(error.message).toBe('儲存失敗');
      expect(error.name).toBe('StorageError');
    });
  });

  describe('ErrorHandler.handle', () => {
    it('應該處理 ApiError', () => {
      const error = new ApiError('API 錯誤', 'API_ERROR', 500);
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.handle(error, 'test', mockShowToast);
      
      expect(result.message).toBe('API 錯誤');
      expect(result.type).toBe('error');
      expect(result.code).toBe('API_ERROR');
      expect(mockShowToast).toHaveBeenCalledWith('API 錯誤', 'error');
    });

    it('應該處理 NetworkError', () => {
      const error = new NetworkError();
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.handle(error, 'test', mockShowToast);
      
      expect(result.message).toBe('網路連線錯誤，請檢查您的網路連線');
      expect(result.type).toBe('error');
      expect(mockShowToast).toHaveBeenCalled();
    });

    it('應該處理標準 Error', () => {
      const error = new Error('標準錯誤');
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.handle(error, 'test', mockShowToast);
      
      expect(result.message).toBe('標準錯誤');
      expect(result.type).toBe('error');
    });

    it('應該處理字串錯誤', () => {
      const error = '字串錯誤';
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.handle(error, 'test', mockShowToast);
      
      expect(result.message).toBe('字串錯誤');
      expect(result.type).toBe('error');
    });

    it('應該處理未知錯誤', () => {
      const error = { someProperty: 'value' };
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.handle(error, 'test', mockShowToast);
      
      expect(result.message).toBe('發生未知錯誤，請稍後再試');
      expect(result.type).toBe('error');
    });
  });

  describe('ErrorHandler.logOnly', () => {
    it('應該只記錄錯誤，不顯示 Toast', () => {
      const error = new Error('測試錯誤');
      const mockShowToast = vi.fn();
      
      const result = ErrorHandler.logOnly(error, 'test');
      
      expect(result.message).toBe('測試錯誤');
      expect(mockShowToast).not.toHaveBeenCalled();
    });
  });
});

