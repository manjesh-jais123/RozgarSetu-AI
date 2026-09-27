import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../hooks/useStores';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

type SocketEventCallback = (...args: unknown[]) => void;

export function useSocket() {
  const { accessToken } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, SocketEventCallback>>(new Map());

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket: Socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.io.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  const subscribe = (event: string, callback: SocketEventCallback) => {
    listenersRef.current.set(event, callback);
    socketRef.current?.on(event, callback);
  };

  const unsubscribe = (event: string) => {
    const callback = listenersRef.current.get(event);
    if (callback) {
      socketRef.current?.off(event, callback);
      listenersRef.current.delete(event);
    }
  };

  return { connected, subscribe, unsubscribe, getSocket: () => socketRef.current };
}
