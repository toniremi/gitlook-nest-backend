import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <-- REVISED: Import HttpModule from @nestjs/axios
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule, // Now correctly imported from @nestjs/axios
    ConfigModule, // Needed for ConfigService to access environment variables
  ],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
