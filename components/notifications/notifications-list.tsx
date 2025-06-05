'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  ExternalLink,
  MoreHorizontal 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  actionUrl: string | null;
  createdAt: Date;
  readAt: Date | null;
  expiresAt: Date | null;
}

interface NotificationsListProps {
  notifications: Notification[];
  userId: string;
}

export function NotificationsList({ notifications, userId }: NotificationsListProps) {
  const [optimisticNotifications, setOptimisticNotifications] = useState(notifications);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-5 w-5 ${
      priority === 'urgent' ? 'text-red-500' :
      priority === 'high' ? 'text-orange-500' :
      priority === 'normal' ? 'text-blue-500' :
      'text-gray-500'
    }`;

    switch (type) {
      case 'assessment_reminder':
        return <Clock className={iconClass} />;
      case 'report_ready':
        return <CheckCircle className={iconClass} />;
      case 'system_update':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'default',
      normal: 'secondary',
      low: 'outline'
    } as const;

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'secondary'} className="text-xs">
        {priority}
      </Badge>
    );
  };

  const markAsRead = async (notificationId: string) => {
    // Optimistic update
    setOptimisticNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true, readAt: new Date() }
          : notif
      )
    );

    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert optimistic update on error
      setOptimisticNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: false, readAt: null }
            : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = optimisticNotifications.filter(n => !n.isRead);
    
    // Optimistic update
    setOptimisticNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
    );

    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Revert optimistic update on error
      setOptimisticNotifications(prev => 
        prev.map(notif => {
          const wasUnread = unreadNotifications.find(un => un.id === notif.id);
          return wasUnread ? { ...notif, isRead: false, readAt: null } : notif;
        })
      );
    }
  };

  const unreadCount = optimisticNotifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
          <Button onClick={markAllAsRead} size="sm" variant="outline">
            Mark all as read
          </Button>
        </div>
      )}

      {/* Notifications */}
      <div className="space-y-3">
        {optimisticNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-200 hover:shadow-md ${
              !notification.isRead ? 'border-blue-200 bg-blue-50/50' : 'bg-white'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-medium text-sm ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getPriorityBadge(notification.priority)}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>

                    <div className="flex items-center gap-2">
                      {notification.actionUrl && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={notification.actionUrl}>
                            View
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button 
                          onClick={() => markAsRead(notification.id)}
                          size="sm" 
                          variant="ghost"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
