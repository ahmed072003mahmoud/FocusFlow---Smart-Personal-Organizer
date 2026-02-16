
export class NotificationService {
  /**
   * Checks if the current browser supports the Notification API
   */
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Requests user permission to show notifications
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    // Check current status
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Triggers a system-level browser notification
   */
  static sendNotification(title: string, body: string) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.warn('Notifications not enabled or supported');
      return;
    }

    try {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Productivity icon
        badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        tag: 'focusflow-reminder', // Groups notifications
        silent: false,
      });
    } catch (e) {
      console.error('Failed to dispatch notification:', e);
    }
  }
}
