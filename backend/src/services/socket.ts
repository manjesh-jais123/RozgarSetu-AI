import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models';

export interface SocketWithUser extends Socket {
  user?: {
    _id: string;
    phone: string;
    role: string;
    name: string;
  };
}

export const setupSocketIO = (io: Server): void => {
  io.use(async (socket: SocketWithUser, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      next(new Error('Authentication error'));
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      const user = await User.findById(decoded.userId).select('phone name role isActive').lean();

      if (!user || !user.isActive) {
        next(new Error('User not found or inactive'));
        return;
      }

      socket.user = {
        _id: user._id.toString(),
        phone: user.phone,
        role: user.role,
        name: user.name,
      };

      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: SocketWithUser) => {
    const user = socket.user!;

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      socket.join('admin_room');
    }

    socket.on('join_user_room', (userId: string) => {
      if (userId === user._id) {
        socket.join(`user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${user.name} (${user._id}) disconnected`);
    });
  });

  console.log('Socket.IO initialized');
};

export const emitToAdmins = (io: Server, event: string, data: unknown): void => {
  io.to('admin_room').emit(event, data);
};

export const emitToUser = (io: Server, userId: string, event: string, data: unknown): void => {
  io.to(`user_${userId}`).emit(event, data);
};

export const emitToAll = (io: Server, event: string, data: unknown): void => {
  io.emit(event, data);
};
