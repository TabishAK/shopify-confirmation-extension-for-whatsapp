import type { JSX } from 'react';
import type { PopupContentProps } from '../../types/popup-content-props';
import {
  ACTIONS_SECTION_STYLE,
  COPY_BUTTON_CONTAINER_STYLE,
  COPY_BUTTON_STYLE,
  COPY_FEEDBACK_STYLE,
  LIST_STYLE,
  SUMMARY_HEADER_STYLE,
  SUMMARY_LABEL_STYLE,
  SUMMARY_SECTION_STYLE,
  TEXTAREA_STYLE,
  WHATSAPP_BUTTON_STYLE,
} from './popup.styles';

export function PopupContent({
  copyStatus,
  errorMessage,
  isLoading,
  onSummaryChange,
  onSummaryCopy,
  onWhatsappClick,
  results,
  summaryText,
  targets,
}: PopupContentProps): JSX.Element {
  if (isLoading) {
    return <p>Fetching content…</p>;
  }

  if (errorMessage) {
    return <p role='alert'>Unable to load content: {errorMessage}</p>;
  }

  if (targets.length === 0) {
    return (
      <p>
        No targets configured. Update `DOM_TARGETS` to fetch page content.
      </p>
    );
  }

  const itemsToRender = targets.map((target) => {
    const match = results.find((result) => result.id === target.id);
    return {
      id: target.id,
      label: target.label,
      textContent: match?.textContent ?? null,
    };
  });

  return itemsToRender.length === 0 ? (
    <p>No matching elements were found on this page.</p>
  ) : (
    <section>
      <ul style={LIST_STYLE}>
        {itemsToRender.map((item) => (
          <li key={item.id}>
            <strong>{item.label}:</strong> {item.textContent ?? 'Not found'}
          </li>
        ))}
      </ul>

      <section style={SUMMARY_SECTION_STYLE}>
        <div style={SUMMARY_HEADER_STYLE}>
          <label htmlFor='popup-summary' style={SUMMARY_LABEL_STYLE}>
            Editable summary
          </label>
          <div style={COPY_BUTTON_CONTAINER_STYLE}>
            <button
              type='button'
              style={COPY_BUTTON_STYLE}
              onClick={onSummaryCopy}
              aria-label='Copy summary to clipboard'
              title='Copy summary'
            >
              <span aria-hidden='true'>📋</span>
            </button>
            {copyStatus !== 'idle' ? (
              <span
                role='status'
                style={{
                  ...COPY_FEEDBACK_STYLE,
                  backgroundColor:
                    copyStatus === 'error' ? '#b91c1c' : '#111827',
                }}
              >
                {copyStatus === 'error' ? 'Copy failed' : 'Copied!'}
              </span>
            ) : null}
          </div>
        </div>
        <textarea
          id='popup-summary'
          value={summaryText}
          onChange={onSummaryChange}
          style={TEXTAREA_STYLE}
          aria-label='Editable summary'
        />
      </section>

      <section style={ACTIONS_SECTION_STYLE}>
        <button
          type='button'
          style={WHATSAPP_BUTTON_STYLE}
          onClick={onWhatsappClick}
          aria-label='Send summary via WhatsApp'
        >
          <span aria-hidden='true'>💬</span>
          Send via WhatsApp
        </button>
      </section>
    </section>
  );
}

