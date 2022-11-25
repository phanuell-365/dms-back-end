import { DOCUMENT_VERSIONS_REPOSITORY } from "./const";
import { DocumentVersion } from './entities';

export const documentVersionsProvider = [
  {
    provide: DOCUMENT_VERSIONS_REPOSITORY,
    useValue: DocumentVersion,
  },
];
