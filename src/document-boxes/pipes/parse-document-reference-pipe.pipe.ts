import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { DocumentReferences } from '../const';

@Injectable()
export class ParseDocumentReferencePipePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return this.transformDocumentReference(value);
  }

  /**
   * @desc This method is called by the Nest framework to transform the value of the query string parameter `documentReference` in the `DocumentBoxesController` methods.
   *     The `documentReference` parameter is a string that represents a document reference.
   */
  async transformDocumentReference(documentReference: string) {
    const documentRef = DocumentReferences[documentReference.toUpperCase()];
    if (documentRef) {
      return documentRef;
    }
    throw new NotFoundException(
      `The document reference "${documentReference}" is not valid.`,
    );
  }
}
