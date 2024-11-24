import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Go to http://localhost:8080`);
}
bootstrap();
