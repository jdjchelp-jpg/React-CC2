import { Bell, BellOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '../lib/notifications';

interface NotificationSettingsProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  customMessages: {
    oneWeek: string;
    threeDays: string;
    oneDay: string;
  };
  onCustomMessagesChange: (messages: { oneWeek: string; threeDays: string; oneDay: string }) => void;
}

export default function NotificationSettings({
  enabled,
  onEnabledChange,
  customMessages,
  onCustomMessagesChange
}: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleToggle = async () => {
    if (!enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPermission('granted');
        onEnabledChange(true);
      }
    } else {
      onEnabledChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2" htmlFor="notifications-toggle">
          {enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          Push Notifications
        </Label>
        <Button
          id="notifications-toggle"
          variant={enabled ? 'default' : 'outline'}
          size="sm"
          onClick={handleToggle}
          aria-label={enabled ? 'Disable notifications' : 'Enable notifications'}
        >
          {enabled ? 'Enabled' : 'Disabled'}
        </Button>
      </div>

      {permission === 'denied' && (
        <p className="text-sm text-muted-foreground">
          Notifications are blocked. Please enable them in your browser settings.
        </p>
      )}

      {enabled && permission === 'granted' && (
        <div className="space-y-3 pl-6 border-l-2 border-muted">
          <div>
            <Label htmlFor="oneWeek" className="text-xs">1 Week Before</Label>
            <input
              id="oneWeek"
              type="text"
              value={customMessages.oneWeek}
              onChange={(e) => onCustomMessagesChange({ ...customMessages, oneWeek: e.target.value })}
              placeholder="🎄 Only 1 week until Christmas!"
              className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
              aria-label="Custom message for 1 week notification"
            />
          </div>
          <div>
            <Label htmlFor="threeDays" className="text-xs">3 Days Before</Label>
            <input
              id="threeDays"
              type="text"
              value={customMessages.threeDays}
              onChange={(e) => onCustomMessagesChange({ ...customMessages, threeDays: e.target.value })}
              placeholder="🎅 Just 3 days left until Christmas!"
              className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
              aria-label="Custom message for 3 days notification"
            />
          </div>
          <div>
            <Label htmlFor="oneDay" className="text-xs">1 Day Before</Label>
            <input
              id="oneDay"
              type="text"
              value={customMessages.oneDay}
              onChange={(e) => onCustomMessagesChange({ ...customMessages, oneDay: e.target.value })}
              placeholder="🎁 Christmas is tomorrow!"
              className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
              aria-label="Custom message for 1 day notification"
            />
          </div>
        </div>
      )}
    </div>
  );
}
