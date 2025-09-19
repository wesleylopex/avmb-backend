import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:3000', 'https://avmb-frontend.vercel.app'], // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    credentials: true // Allow cookies to be sent
  })

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
