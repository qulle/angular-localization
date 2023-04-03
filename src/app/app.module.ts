import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppMenuComponent } from './app-menu/app-menu.component';

export function createTranslateLoader(http: HttpClient) {
    // The ?cache parameter is used to always send the request and not return [HTTP/1.1 304 Not Modified]
    const timestamp = Date.now().toString();
    return new TranslateHttpLoader(http, './assets/language-files/', `.json?cache=${timestamp}`);
}

@NgModule({
    declarations: [AppComponent, AppMenuComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
