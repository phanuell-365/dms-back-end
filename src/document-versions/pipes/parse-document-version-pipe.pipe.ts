import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { VersionStatus } from '../enum';

@Injectable()
export class ParseDocumentVersionPipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.transformDocumentVersion(value);
  }

  /**
   * @desc This method is called by the Nest framework to transform the value of the
   *      `documentVersion` parameter in the `DocumentVersionsController` methods.
   *      The `documentVersion` parameter is a string that represents a document version
   *      This method checks if the `documentVersion` parameter is a valid VersionStatus
   *      and returns the `documentVersion` parameter if it is valid.
   */
  async transformDocumentVersion(documentVersion: string) {
    const versionStatus = VersionStatus[documentVersion.toUpperCase()];
    if (versionStatus) {
      return versionStatus;
    }
    throw new NotFoundException(
      `The document version "${documentVersion}" is not valid.`,
    );
  }
}
