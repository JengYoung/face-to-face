import { SocketIoAdapter } from './adapters/socket-io.adapter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('🚀 App');

  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);

  const socketIoAdapter = new SocketIoAdapter(app);
  app.useWebSocketAdapter(socketIoAdapter);

  app.listen(port, () => {
    logger.log(`${port} port listening...`);
  });
}
bootstrap();
