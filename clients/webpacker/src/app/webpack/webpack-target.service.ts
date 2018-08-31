import { Injectable } from '@angular/core';
export interface WebpackTargetOption {
  code: TargetEnum;
  title: string;
}

export enum TargetEnum {
  web = 'web',
  webworker = 'webworker',
  node = 'node',
  electronRenderer = 'electron-renderer',
  electronMain = 'electron-main'
}

@Injectable({
  providedIn: 'root'
})
export class WebpackTargetService {
  targets: WebpackTargetOption[] = [{
    code: TargetEnum.web,
    title: "web"
  }, {
    code: TargetEnum.node,
    title: "node"
  }, {
    code: TargetEnum.webworker,
    title: "webworker"
  }, {
    code: TargetEnum.electronRenderer,
    title: "electron render"
  }, {
    code: TargetEnum.electronMain,
    title: "electron main"
  }];
  constructor() { }
}
