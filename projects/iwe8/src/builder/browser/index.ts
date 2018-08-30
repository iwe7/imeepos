import { Builder, BuilderContext, BuilderConfiguration, BuildEvent } from '@angular-devkit/architect';
import { BrowserBuilder } from '@angular-devkit/build-angular/src/browser';
import { BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
import { Observable, of } from 'rxjs';

export class Iwe8BrowserBuilder implements Builder<BrowserBuilderSchema>{
    browser: BrowserBuilder;
    constructor(public context: BuilderContext) {
        this.browser = new BrowserBuilder(context);
    }
    run(builderConfig: BuilderConfiguration<BrowserBuilderSchema>): Observable<BuildEvent> {
        return of({ success: true });
    }
}
