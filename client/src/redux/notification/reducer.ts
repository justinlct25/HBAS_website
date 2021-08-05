import { NotificationState } from "./state";
import { SetNotificationAction } from "./action";

export const initialState: NotificationState = {
  notification: {
    showNotification: false,
    message: [
      {
        text: "",
        createdAt: "",
      },
    ],
    expandNotification: false,
  },
};

export const notificationReducer = (
  state: NotificationState = initialState,
  action: SetNotificationAction
): NotificationState => {
  switch (action.type) {
    case "@@notification/setNotification":
      return {
        ...state,
        notification: {
          ...state.notification,
          showNotification: action.showNotification,
        },
      };
    case "@@notification/expandNotificationMessage":
      return {
        ...state,
        notification: {
          ...state.notification,
          expandNotification: action.isOpen,
        },
      };
    case "@@notification/setNotificationMessage":
      return {
        ...state,
        notification: {
          ...state.notification,
          message: [...state.notification.message, action.message],
        },
      };

    default:
      return state;
  }
};
