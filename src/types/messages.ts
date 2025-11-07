import { MESSAGE_TYPES } from '@constants/messaging';
import type { DomTarget, DomTextResult } from './dom-target';

export interface DomTextRequestMessage {
  type: (typeof MESSAGE_TYPES)['requestDomText'];
  targets: DomTarget[];
}

export interface DomTextResponseMessage {
  type: (typeof MESSAGE_TYPES)['respondDomText'];
  results: DomTextResult[];
}

export type RuntimeMessage = DomTextRequestMessage | DomTextResponseMessage;

