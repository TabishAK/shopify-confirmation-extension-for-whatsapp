import { STORAGE_KEYS } from '@constants/storage';
import type { CreationOrderRecord } from '@types/storage';
import { createLogger } from '@utils/logger';

const logger = createLogger('storage-service');

const handleChromeError = (reject: (reason?: unknown) => void): boolean => {
  const runtimeError = chrome.runtime.lastError;
  if (!runtimeError) {
    return false;
  }

  reject(new Error(runtimeError.message));
  return true;
};

const readValue = async <T>(key: string): Promise<T | undefined> =>
  new Promise<T | undefined>((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (handleChromeError(reject)) {
        return;
      }

      resolve(result[key] as T | undefined);
    });
  });

const writeValue = async <T>(key: string, value: T): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (handleChromeError(reject)) {
        return;
      }

      resolve();
    });
  });

const removeValue = async (key: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    chrome.storage.local.remove([key], () => {
      if (handleChromeError(reject)) {
        return;
      }

      resolve();
    });
  });

export const readCreationOrder = async (): Promise<CreationOrderRecord | null> => {
  const record = await readValue<CreationOrderRecord>(STORAGE_KEYS.CREATION_ORDER);

  if (record) {
    logger.debug('Loaded creation order', record);
  } else {
    logger.debug('No creation order found');
  }

  return record ?? null;
};

export const writeCreationOrder = async (record: CreationOrderRecord): Promise<void> => {
  logger.debug('Persisting creation order', record);
  await writeValue(STORAGE_KEYS.CREATION_ORDER, record);
};

export const clearCreationOrder = async (): Promise<void> => {
  logger.info('Clearing stored creation order');
  await removeValue(STORAGE_KEYS.CREATION_ORDER);
};

