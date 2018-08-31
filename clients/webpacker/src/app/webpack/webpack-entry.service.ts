import { RenderDialogService } from './../electron-render/dialog.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { Entry } from 'webpack';
@Injectable({
  providedIn: 'root'
})
export class WebpackEntryService {
  entry: Map<string, string[]> = new Map();

  update: BehaviorSubject<Entry> = new BehaviorSubject(this.get());

  constructor(
    public dialog: RenderDialogService
  ) { }

  addEntry(name: string) {
    return this.dialog.selectFile().pipe(
      tap(res => {
        this.entry.set(name, res);
        this._update();
      })
    );
  }

  private _update() {
    this.update.next(this.get());
  }

  get(): Entry {
    const entry: Entry = {};
    this.entry.forEach((item, index) => {
      entry[index] = item;
    });
    return entry;
  }
}
