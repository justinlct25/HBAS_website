export function setNotificationAction(showNotification: boolean) {
  return {
    type: "@@notification/setNotification" as const,
    showNotification,
  };
}
export function expandNotificationMessageAction(isOpen: boolean) {
  return {
    type: "@@notification/expandNotificationMessage" as const,
    isOpen,
  };
}
export function setNotificationMessage(message: {
  text: string;
  createdAt: string;
}) {
  return {
    type: "@@notification/setNotificationMessage" as const,
    message,
  };
}

type ActionCreators =
  | typeof setNotificationAction
  | typeof setNotificationMessage
  | typeof expandNotificationMessageAction;

export type SetNotificationAction = ReturnType<ActionCreators>;
