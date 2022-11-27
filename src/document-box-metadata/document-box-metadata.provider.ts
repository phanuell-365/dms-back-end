import { OUTBOX_METADATA_REPOSITORY } from './const';
import { OutboxMetadata } from './entities';

export const documentBoxMetadataProvider = [
  {
    provide: OUTBOX_METADATA_REPOSITORY,
    useValue: OutboxMetadata,
  },
];
