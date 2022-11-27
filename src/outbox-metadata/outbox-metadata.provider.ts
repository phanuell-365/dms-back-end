import { OUTBOX_METADATA_REPOSITORY } from './const';
import { OutboxMetadata } from './entities';

export const outboxMetadataProvider = [
  {
    provide: OUTBOX_METADATA_REPOSITORY,
    useValue: OutboxMetadata,
  },
];
