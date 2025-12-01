import { io, Socket } from 'socket.io-client';
import type { AnalysisProgress } from '../types/analysis';

class SocketService {
  private socket: Socket | null = null;
  private progressCallback: ((progress: AnalysisProgress) => void) | null = null;

  connect(): string {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('analysis:progress', (progress: AnalysisProgress) => {
      if (this.progressCallback) {
        this.progressCallback(progress);
      }
    });

    return this.socket.id || '';
  }

  getSocketId(): string {
    return this.socket?.id || '';
  }

  onProgress(callback: (progress: AnalysisProgress) => void): void {
    this.progressCallback = callback;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
