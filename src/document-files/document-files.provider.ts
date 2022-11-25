import { DOCUMENT_FILE_REPOSITORY } from './const';
import { DocumentFile } from './entities';

export const documentFilesProvider = [
  {
    provide: DOCUMENT_FILE_REPOSITORY,
    useValue: DocumentFile,
  },
];
