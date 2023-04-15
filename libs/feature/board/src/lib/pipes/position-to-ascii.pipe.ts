import { inject, Pipe, PipeTransform } from '@angular/core';
import { Position, StoreService } from '@chess/core';
import { Observable } from 'rxjs';

@Pipe({
  standalone: true,
  name: 'positionToAscii$'
})
export class PositionToAsciiPipe implements PipeTransform {

  private store = inject(StoreService);

  transform(position: Position): Observable<string> {
    return this.store.getPieceAscii$(position);
  }

}