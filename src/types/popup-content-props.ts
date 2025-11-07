import type { ChangeEvent, MouseEvent } from 'react';
import type { DomTarget, DomTextResult } from './dom-target';
import type { PopupCopyStatus } from './popup-copy-status';

export interface PopupContentProps {
  copyStatus: PopupCopyStatus;
  errorMessage: string | null;
  isLoading: boolean;
  onSummaryChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSummaryCopy: (event: MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  onWhatsappClick: (event: MouseEvent<HTMLButtonElement>) => void;
  results: DomTextResult[];
  summaryText: string;
  targets: DomTarget[];
}

