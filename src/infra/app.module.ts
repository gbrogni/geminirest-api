import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { GeminiModule } from './gemini/gemini.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'temp-images'),
      serveRoot: '/temp-images',
    }),
    HttpModule,
    EnvModule,
    GeminiModule
  ]
})
export class AppModule { }