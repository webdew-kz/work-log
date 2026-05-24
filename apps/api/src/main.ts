import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

function getPort(): number {
  const env = process.env.PORT;
  if (!env) return 3001;
  const parsed = parseInt(env, 10);
  if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
    console.warn(`Invalid PORT "${env}", falling back to 3001`);
    return 3001;
  }
  return parsed;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = getPort();
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}
bootstrap();