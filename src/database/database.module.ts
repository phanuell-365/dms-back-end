import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { databaseProvider } from './database.provider';

@Module({
  providers: [DatabaseService, ...databaseProvider],
})
export class DatabaseModule {}
