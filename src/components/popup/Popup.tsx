import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type JSX,
  type MouseEvent,
} from 'react';
import { DOM_TARGETS } from '@constants/dom-targets';
import { fetchDomTextContent } from '@services/dom-extractor';
import { createLogger } from '@utils/logger';
import { buildPopupSummary, resolveResultValue } from '@utils/popup-summary';
import { buildWhatsappUrl } from '@utils/whatsapp';
import type { DomTextResult } from '../../types/dom-target';
import type { PopupCopyStatus } from '../../types/popup-copy-status';
import { PopupContent } from './PopupContent';
import { CONTAINER_STYLE } from './popup.styles';

const logger = createLogger('popup');

const getExtensionName = (): string => chrome.runtime.getManifest().name ?? 'Extension';

export function Popup(): JSX.Element {
  const [results, setResults] = useState<DomTextResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryText, setSummaryText] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState<PopupCopyStatus>('idle');

  const copyResetTimeoutRef = useRef<number | null>(null);

  const clearCopyResetTimeout = (): void => {
    if (copyResetTimeoutRef.current !== null) {
      window.clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
  };

  const scheduleCopyStatusReset = (): void => {
    clearCopyResetTimeout();
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus('idle');
      copyResetTimeoutRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    let isActive = true;

    const loadDomText = async () => {
      try {
        const data = await fetchDomTextContent();

        if (!isActive) {
          return;
        }

        setResults(data);
      } catch (error) {
        if (!isActive) {
          return;
        }

        logger.error('Failed to load DOM text content', error);

        const message =
          error instanceof Error ? error.message : 'Unexpected error occurred';
        setErrorMessage(message);
      } finally {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      }
    };

    void loadDomText();

    return () => {
      isActive = false;
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
        copyResetTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (results.length === 0) {
      setSummaryText('');
      setCustomerPhone('');
      return;
    }

    setSummaryText(buildPopupSummary(results));
    setCustomerPhone(resolveResultValue(results, 'customer-phone') ?? '');
  }, [results]);

  const handleSummaryChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setSummaryText(event.target.value);
  };

  const handleSummaryCopy = async (
    event: MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!navigator.clipboard) {
      logger.error('Clipboard API is unavailable in this environment');
      setCopyStatus('error');
      scheduleCopyStatusReset();
      return;
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      logger.info('Summary text copied to clipboard');
      setCopyStatus('success');
      scheduleCopyStatusReset();
    } catch (error) {
      logger.error('Failed to copy summary text', error);
      setCopyStatus('error');
      scheduleCopyStatusReset();
    }
  };

  const handleWhatsappClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    const phone = customerPhone.trim();
    if (phone.length === 0) {
      logger.warn('Unable to send WhatsApp message: missing phone number');
      return;
    }

    const url = buildWhatsappUrl(phone, summaryText);

    if (!url) {
      logger.warn('Unable to send WhatsApp message: invalid phone number', {
        phone
      });
      return;
    }

    void chrome.tabs.create({ url });
  };

  return (
    <main style={CONTAINER_STYLE}>
      <header>
        <h1>{getExtensionName()}</h1>
      </header>
      <PopupContent
        copyStatus={copyStatus}
        errorMessage={errorMessage}
        isLoading={isLoading}
        onSummaryChange={handleSummaryChange}
        onSummaryCopy={handleSummaryCopy}
        onWhatsappClick={handleWhatsappClick}
        results={results}
        summaryText={summaryText}
        targets={DOM_TARGETS}
      />
    </main>
  );
}
