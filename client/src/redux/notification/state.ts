export interface NotificationData {
  showNotification: boolean;
  message: { text: string; createdAt: string }[];
  expandNotification: boolean;
}
export interface NotificationState {
  notification: NotificationData;
}
