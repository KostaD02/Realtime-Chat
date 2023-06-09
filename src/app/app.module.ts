import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { HomepageComponent, NotfoundComponent, AuthComponent } from './views';
import { AnchorComponent, ButtonComponent, SignInButtonsComponent } from './shared';
import { MaterialModule } from './module';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundComponent,
    ButtonComponent,
    AnchorComponent,
    AuthComponent,
    SignInButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase || "add your firebase creds")
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
