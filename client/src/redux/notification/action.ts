import { NotificationMessage } from "./state";

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
export function setNotificationMessage(data: NotificationMessage[]) {
  return {
    type: "@@notification/setNotificationMessage" as const,
    data,
  };
}

type ActionCreators =
  | typeof setNotificationAction
  | typeof expandNotificationMessageAction
  | typeof setNotificationMessage;

export type SetNotificationAction = ReturnType<ActionCreators>;
