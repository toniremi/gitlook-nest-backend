import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GithubModule } from './github/github.module'; // Import your GitHubModule
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [
    // Makes ConfigService available globally to all modules
    ConfigModule.forRoot({
      isGlobal: true,
      // You can add more configuration options here, e.g., validation schema
    }),
    GithubModule, // Include your GitHub module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
