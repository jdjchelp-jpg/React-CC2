export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const scheduleNotification = (title: string, body: string, delay: number): void => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title,
      body,
      delay
    });
  }
};

export const checkAndScheduleNotifications = (
  daysUntilChristmas: number,
  enabled: boolean,
  customMessages?: {
    oneWeek?: string;
    threeDays?: string;
    oneDay?: string;
  }
): void => {
  if (!enabled || Notification.permission !== 'granted') {
    return;
  }

  const notificationKey = `notification-sent-${new Date().getFullYear()}`;
  const sentNotifications = JSON.parse(localStorage.getItem(notificationKey) || '{}');

  if (daysUntilChristmas === 7 && !sentNotifications.oneWeek) {
    const message = customMessages?.oneWeek || '🎄 Only 1 week until Christmas!';
    scheduleNotification('Christmas Countdown', message, 0);
    sentNotifications.oneWeek = true;
    localStorage.setItem(notificationKey, JSON.stringify(sentNotifications));
  }

  if (daysUntilChristmas === 3 && !sentNotifications.threeDays) {
    const message = customMessages?.threeDays || '🎅 Just 3 days left until Christmas!';
    scheduleNotification('Christmas Countdown', message, 0);
    sentNotifications.threeDays = true;
    localStorage.setItem(notificationKey, JSON.stringify(sentNotifications));
  }

  if (daysUntilChristmas === 1 && !sentNotifications.oneDay) {
    const message = customMessages?.oneDay || '🎁 Christmas is tomorrow!';
    scheduleNotification('Christmas Countdown', message, 0);
    sentNotifications.oneDay = true;
    localStorage.setItem(notificationKey, JSON.stringify(sentNotifications));
  }
};

export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};
