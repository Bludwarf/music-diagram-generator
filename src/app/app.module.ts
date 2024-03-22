import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {ConvertComponent} from "./convert/convert.component";
import {SongComponent} from "./song/song.component";
import {IndexComponent} from "./index/index.component";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: IndexComponent },
      { path: 'morceaux/:songName', component: SongComponent },
      { path: 'convert', component: ConvertComponent },
    ])
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
