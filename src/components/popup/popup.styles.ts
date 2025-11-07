import type { CSSProperties } from 'react';

export const CONTAINER_STYLE: CSSProperties = {
  minWidth: 320,
  minHeight: 240,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  backgroundColor: '#ffffff',
  color: '#1f2933',
};

export const SUMMARY_SECTION_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

export const SUMMARY_HEADER_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const COPY_BUTTON_CONTAINER_STYLE: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const SUMMARY_LABEL_STYLE: CSSProperties = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#111827',
};

export const TEXTAREA_STYLE: CSSProperties = {
  width: '95%',
  minHeight: 160,
  padding: '10px',
  resize: 'vertical',
  borderRadius: '6px',
  border: '1px solid #d2d6dc',
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: '14px',
  lineHeight: 1.4,
  backgroundColor: '#f9fafb',
  color: '#1f2933',
};

export const LIST_STYLE: CSSProperties = {
  fontSize: '14px',
  marginLeft: '-25px',
  lineHeight: '18px',
  marginTop: '-15px',
};

export const ACTIONS_SECTION_STYLE: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
};

export const WHATSAPP_BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '6px',
  backgroundColor: '#21bf62',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  marginTop: '10px',
};

export const COPY_BUTTON_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  border: '1px solid #d2d6dc',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  fontSize: '16px',
  color: '#111827',
};

export const COPY_FEEDBACK_STYLE: CSSProperties = {
  position: 'absolute',
  top: '-32px',
  right: 0,
  backgroundColor: '#111827',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
  pointerEvents: 'none',
};
