import { DOM_TARGETS } from '@constants/dom-targets';
import { MESSAGE_TYPES } from '@constants/messaging';
import type { DomTextResult } from '../types/dom-target';
import type { DomTextRequestMessage, DomTextResponseMessage } from '../types/messages';
import { createLogger } from '@utils/logger';

const logger = createLogger('dom-extractor');
const CONTENT_SCRIPT_FILE = 'content.js';

const queryActiveTabId = async (): Promise<number> => {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab?.id) {
    throw new Error('Active tab is unavailable');
  }

  return activeTab.id;
};

const sendRequest = async (tabId: number): Promise<DomTextResult[]> =>
  new Promise<DomTextResult[]>((resolve, reject) => {
    const request: DomTextRequestMessage = {
      type: MESSAGE_TYPES.requestDomText,
      targets: DOM_TARGETS
    };

    chrome.tabs.sendMessage(tabId, request, (response?: DomTextResponseMessage) => {
      const runtimeError = chrome.runtime.lastError;

      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      if (!response || response.type !== MESSAGE_TYPES.respondDomText) {
        reject(new Error('Unexpected response from content script'));
        return;
      }

      resolve(response.results);
    });
  });

const injectContentScript = async (tabId: number): Promise<void> => {
  if (!chrome.scripting?.executeScript) {
    throw new Error('Scripting API is unavailable in this context');
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [CONTENT_SCRIPT_FILE]
    });
    logger.info('Injected content script into tab', { tabId });
  } catch (error) {
    logger.error('Failed to inject content script', error);

    const message = error instanceof Error
      ? error.message
      : 'Unknown scripting injection error';

    throw new Error(`Unable to inject content script: ${message}`);
  }
};

const shouldAttemptInjection = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('Receiving end does not exist');

export const fetchDomTextContent = async (): Promise<DomTextResult[]> => {
  const tabId = await queryActiveTabId();
  try {
    return await sendRequest(tabId);
  } catch (error) {
    if (!shouldAttemptInjection(error)) {
      throw error instanceof Error ? error : new Error('Failed to reach content script');
    }

    await injectContentScript(tabId);
    return sendRequest(tabId);
  }
};

