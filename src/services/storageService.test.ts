import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageServiceImpl } from './storageService';

describe('StorageService', () => {
  let service: StorageServiceImpl;

  beforeEach(() => {
    service = new StorageServiceImpl();
    service.resetCache();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('isPrivateMode debe retornar true si IndexedDB lanza SecurityError', async () => {
    const mockIndexedDB = { open: vi.fn() };
    Object.defineProperty(window, 'indexedDB', {
      value: mockIndexedDB,
      writable: true,
      configurable: true,
    });

    vi.spyOn(window.indexedDB, 'open').mockImplementation(() => {
      throw new DOMException('SecurityError', 'SecurityError');
    });

    const isPrivate = await service.isPrivateMode();
    expect(isPrivate).toBe(true);
  });

  it('isPrivateMode debe retornar false cuando IndexedDB y localStorage estan disponibles', async () => {
    const mockIndexedDB = {
      open: vi.fn().mockImplementation(() => {
        const req: any = {};
        setTimeout(() => {
          if (req.onsuccess) req.onsuccess();
        }, 0);
        return req;
      }),
    };

    Object.defineProperty(window, 'indexedDB', {
      value: mockIndexedDB,
      writable: true,
      configurable: true,
    });

    const isPrivate = await service.isPrivateMode();
    expect(isPrivate).toBe(false);
  });

  it('setItem debe usar fallback en memoria cuando el almacenamiento local falla', async () => {
    vi.spyOn(service, 'isPrivateMode').mockResolvedValue(false);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const testData = { draftId: '123', amount: 4500 };
    await service.setItem('budget_draft', testData);

    const result = await service.getItem<{ draftId: string; amount: number }>('budget_draft');
    expect(result).toEqual(testData);
  });

  it('debe almacenar y recuperar elementos correctamente en modo normal', async () => {
    vi.spyOn(service, 'isPrivateMode').mockResolvedValue(false);

    const testPatient = { id: 'p1', name: 'Juan Perez' };
    await service.setItem('patient_temp', testPatient);

    const retrieved = await service.getItem<{ id: string; name: string }>('patient_temp');
    expect(retrieved).toEqual(testPatient);
    expect(localStorage.getItem('patient_temp')).toBe(JSON.stringify(testPatient));
  });

  it('removeItem y clear deben eliminar elementos en memoria y localStorage', async () => {
    vi.spyOn(service, 'isPrivateMode').mockResolvedValue(false);

    await service.setItem('key1', 'val1');
    await service.setItem('key2', 'val2');

    await service.removeItem('key1');
    expect(await service.getItem('key1')).toBeNull();

    await service.clear();
    expect(await service.getItem('key2')).toBeNull();
  });
});
