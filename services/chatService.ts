
export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system' | 'location' | 'image';
  venueId: string;
}

export interface ChatRoom {
  id: string;
  venueId: string;
  venueName: string;
  participants: number;
  lastMessage: ChatMessage | null;
  isActive: boolean;
  messages: ChatMessage[];
}

// Mock data storage
const mockChatRooms: ChatRoom[] = [
  {
    id: 'room_sandton_city',
    venueId: '1',
    venueName: 'Sandton City Mall',
    participants: 156,
    isActive: true,
    lastMessage: {
      id: 'msg_1',
      userId: 'user_1',
      username: 'Sarah',
      message: 'Anyone know if the Apple Store is still having a sale?',
      timestamp: new Date().toISOString(),
      type: 'text',
      venueId: '1',
    },
    messages: [
      {
        id: 'msg_1',
        userId: 'user_1',
        username: 'Sarah',
        message: 'Anyone know if the Apple Store is still having a sale?',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'text',
        venueId: '1',
      },
      {
        id: 'msg_2',
        userId: 'user_2',
        username: 'Mike',
        message: 'Yes! 20% off MacBooks until tomorrow.',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'text',
        venueId: '1',
      },
      {
        id: 'msg_3',
        userId: 'system',
        username: 'System',
        message: 'John joined the chat',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'system',
        venueId: '1',
      },
    ],
  },
  {
    id: 'room_or_tambo',
    venueId: '2',
    venueName: 'OR Tambo International Airport',
    participants: 89,
    isActive: true,
    lastMessage: {
      id: 'msg_4',
      userId: 'user_3',
      username: 'Lisa',
      message: 'Flight delays on domestic terminal?',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'text',
      venueId: '2',
    },
    messages: [
      {
        id: 'msg_4',
        userId: 'user_3',
        username: 'Lisa',
        message: 'Flight delays on domestic terminal?',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        type: 'text',
        venueId: '2',
      },
      {
        id: 'msg_5',
        userId: 'user_4',
        username: 'David',
        message: 'Some delays due to weather. Check with your airline.',
        timestamp: new Date(Date.now() - 540000).toISOString(),
        type: 'text',
        venueId: '2',
      },
    ],
  },
];

const currentUserId = 'current_user';
const currentUsername = 'You';

export const getChatRoomsForVenue = async (venueId: string): Promise<ChatRoom[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChatRooms.filter(room => room.venueId === venueId);
  } catch (error) {
    throw new Error('Failed to fetch chat rooms');
  }
};

export const getChatRoom = async (roomId: string): Promise<ChatRoom | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockChatRooms.find(room => room.id === roomId) || null;
  } catch (error) {
    throw new Error('Failed to fetch chat room');
  }
};

export const sendMessage = async (
  roomId: string, 
  message: string, 
  type: 'text' | 'location' | 'image' = 'text'
): Promise<ChatMessage> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUserId,
      username: currentUsername,
      message,
      timestamp: new Date().toISOString(),
      type,
      venueId: '',
    };

    const room = mockChatRooms.find(r => r.id === roomId);
    if (room) {
      newMessage.venueId = room.venueId;
      room.messages.push(newMessage);
      room.lastMessage = newMessage;
    }

    return newMessage;
  } catch (error) {
    throw new Error('Failed to send message');
  }
};

export const joinChatRoom = async (venueId: string): Promise<ChatRoom> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let room = mockChatRooms.find(r => r.venueId === venueId);
    
    if (!room) {
      // Create new room if it doesn't exist
      room = {
        id: `room_${venueId}_${Date.now()}`,
        venueId,
        venueName: `Venue ${venueId}`,
        participants: 1,
        isActive: true,
        lastMessage: null,
        messages: [],
      };
      mockChatRooms.push(room);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: 'system',
        username: 'System',
        message: `${currentUsername} created the chat room`,
        timestamp: new Date().toISOString(),
        type: 'system',
        venueId,
      };
      
      room.messages.push(systemMessage);
      room.lastMessage = systemMessage;
    } else {
      room.participants++;
      
      // Add join message
      const joinMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: 'system',
        username: 'System',
        message: `${currentUsername} joined the chat`,
        timestamp: new Date().toISOString(),
        type: 'system',
        venueId,
      };
      
      room.messages.push(joinMessage);
      room.lastMessage = joinMessage;
    }

    return room;
  } catch (error) {
    throw new Error('Failed to join chat room');
  }
};

export const leaveChatRoom = async (roomId: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const room = mockChatRooms.find(r => r.id === roomId);
    if (room && room.participants > 0) {
      room.participants--;
      
      const leaveMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        userId: 'system',
        username: 'System',
        message: `${currentUsername} left the chat`,
        timestamp: new Date().toISOString(),
        type: 'system',
        venueId: room.venueId,
      };
      
      room.messages.push(leaveMessage);
      room.lastMessage = leaveMessage;
    }
  } catch (error) {
    throw new Error('Failed to leave chat room');
  }
};

export const getActiveRooms = async (): Promise<ChatRoom[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockChatRooms
      .filter(room => room.isActive && room.participants > 0)
      .sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
      });
  } catch (error) {
    throw new Error('Failed to fetch active rooms');
  }
};

export const markRoomAsRead = async (roomId: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    // In a real implementation, this would mark messages as read
    console.log(`Marked room ${roomId} as read`);
  } catch (error) {
    throw new Error('Failed to mark room as read');
  }
};
