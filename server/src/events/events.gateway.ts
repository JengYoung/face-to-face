// events.gateway.ts
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

/**
 * @see: https://docs.nestjs.com/websockets/gateways#gateways
 */
@WebSocketGateway(2462, {
  transports: ['websocket'],
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  nspServer: Namespace;

  private readonly logger = new Logger('📢 EventsGateway');

  /**
   * INFO: Room events
   * @see: https://socket.io/docs/v3/rooms/#room-events
   */
  afterInit() {
    this.nspServer.adapter.on('create-room', (room) => {
      this.logger.verbose(`"Room:${room}"이 생성되었습니다.`);
    });

    this.nspServer.adapter.on('join-room', (room, id) => {
      this.logger.verbose(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    });

    this.nspServer.adapter.on('leave-room', (room, id) => {
      this.logger.verbose(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    });

    this.nspServer.adapter.on('delete-room', (roomName) => {
      this.logger.verbose(`"Room:${roomName}"이 삭제되었습니다.`);
    });

    this.logger.log('웹소켓 서버를 열었어요. 🥰');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓을 연결했어요 🥰`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결을 끊습니다 😎`);
  }

  @SubscribeMessage('chat')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    this.logger.log(`💬 ${socket.id}: ${data}`);
    this.nspServer.emit('chat', { message: data });
  }
}
