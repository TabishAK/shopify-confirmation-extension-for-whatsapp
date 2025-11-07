export const MESSAGE_TYPES = {
  requestDomText: 'REQUEST_DOM_TEXT',
  respondDomText: 'RESPOND_DOM_TEXT'
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

