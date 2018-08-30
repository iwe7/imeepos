import { CloudRouterComponent } from './cloud-router/cloud-router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: "**",
  component: CloudRouterComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule],
  declarations: [CloudRouterComponent]
})
export class AppRoutingModule { }
