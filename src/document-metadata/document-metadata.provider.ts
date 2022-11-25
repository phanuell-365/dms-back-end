import { DOCUMENT_METADATA_REPOSITORY } from './const';
import { DocumentMetadata } from './entities';

export const documentMetadataProvider = [
  {
    provide: DOCUMENT_METADATA_REPOSITORY,
    useValue: DocumentMetadata,
  },
];
