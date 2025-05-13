import { NextResponse } from 'next/server';
import { GroupedNotifications } from '@/types/notification';
import { isToday, isYesterday, subDays } from 'date-fns';

// Store notifications in memory (replace with database in production)
let mockNotifications = [
  {
    id: '1',
    type: 'follow',
    users: [
      {
        id: '1',
        name: 'Dean Winchester',
        image: '/images/users/dean.jpg'
      }
    ],
    timestamp: new Date().toISOString(),
    isRead: false,
    message: 'Dean Winchester is now following you',
    userId: '1'
  },
  {
    id: '2',
    type: 'like',
    users: [
      {
        id: '2',
        name: 'John Steve',
        image: ''
      },
      {
        id: '3',
        name: 'Sam Winchester',
        image: '/images/users/sam.jpg'
      }
    ],
    timestamp: subDays(new Date(), 1).toISOString(),
    recipeId: '123',
    recipeImage: '/images/recipes/recipe1.jpg',
    isRead: false
  },
  {
    id: '3',
    type: 'comment',
    users: [
      {
        id: '4',
        name: 'Anonymous User',
        image: null
      }
    ],
    timestamp: subDays(new Date(), 2).toISOString(),
    recipeId: '124',
    recipeImage: '/images/recipes/recipe2.jpg',
    isRead: true
  }
];

export async function GET() {
  // Group notifications by time
  const groupedNotifications: GroupedNotifications = {
    new: [],
    today: [],
    yesterday: [],
    older: []
  };

  mockNotifications.forEach(notification => {
    const date = new Date(notification.timestamp);
    
    if (!notification.isRead) {
      groupedNotifications.new.push(notification);
    } else if (isToday(date)) {
      groupedNotifications.today.push(notification);
    } else if (isYesterday(date)) {
      groupedNotifications.yesterday.push(notification);
    } else {
      groupedNotifications.older.push(notification);
    }
  });

  return NextResponse.json(groupedNotifications);
}

export async function PUT(request: Request) {
  const { markAllAsRead } = await request.json();
  
  if (markAllAsRead) {
    // Mark all unread notifications as read
    mockNotifications = mockNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
  }

  // Return updated notifications
  const groupedNotifications: GroupedNotifications = {
    new: [],
    today: [],
    yesterday: [],
    older: []
  };

  mockNotifications.forEach(notification => {
    const date = new Date(notification.timestamp);
    
    if (!notification.isRead) {
      groupedNotifications.new.push(notification);
    } else if (isToday(date)) {
      groupedNotifications.today.push(notification);
    } else if (isYesterday(date)) {
      groupedNotifications.yesterday.push(notification);
    } else {
      groupedNotifications.older.push(notification);
    }
  });

  return NextResponse.json(groupedNotifications);
} 