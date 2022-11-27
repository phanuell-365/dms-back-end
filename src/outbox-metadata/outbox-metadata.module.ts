import { Module } from '@nestjs/common';
import { OutboxMetadataService } from './outbox-metadata.service';
import { outboxMetadataProvider } from './outbox-metadata.provider';

@Module({
  providers: [OutboxMetadataService, ...outboxMetadataProvider],
})
export class OutboxMetadataModule {}
