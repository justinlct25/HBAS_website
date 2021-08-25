export interface NotificationMessage {
  id: number;
  deviceEui: string;
  deviceName: string;
  date: string;
}

export interface NotificationData {
  showNotification: boolean;
  message: NotificationMessage[];
  expandNotification: boolean;
}
export interface NotificationState {
  notification: NotificationData;
}
