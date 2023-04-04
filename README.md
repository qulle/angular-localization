# Angular Localization

## About
Easy localization with JSON files that can also be updated and added at runtime.

## Usage
This example is built around the `ngx-translate/core` package. It uses JSON files to dynamically load the language files and applies them without a reload of the page. 

This repository only shows some configuration options, the full documentation can be found at [github.com/ngx-translate/core](https://github.com/ngx-translate/core).

Install the module.
```
$ npm install @ngx-translate/core --save
```

Install a loader.
```
$ npm install @ngx-translate/http-loader --save
```

Configure the `app.module.ts`.
```typescript
export function createTranslateLoader(http: HttpClient) {
    // The ?cache parameter is used to always send the request and not return [HTTP/1.1 304 Not Modified]
    const timestamp = Date.now().toString();
    return new TranslateHttpLoader(http, './assets/language-files/', `.json?cache=${timestamp}`);
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ]
})
export class AppModule {}
```

Configure the `app.component.ts`.
```typescript
ngOnInit(): void {
    // Fallback language
    this.translate.setDefaultLang('sv-se');

    // Selected language
    this.translate.use('en-us');
}
```

When using `Tippy.js` the translated value is trapped inside each Tippy instance. One way to get the correct language is to replace the `title` attribute when a new language is selected. Then use events in Tippy to always fetch the current value stored in the title attribute. 
```typescript
this.tippy = delegate(document.body, {
    target: '.app-tippy',
    placement: 'right',
    appendTo: document.body,
    touch: false,
    onShow: (instance: any) => {
        const element = <HTMLElement>instance.reference;
        const title = (
            element.getAttribute('title') || 
            element.getAttribute('data-tippy-value') || ''
        );

        // Store the title to not have multiple tooltips
        element.setAttribute('data-tippy-value', title);
        element.removeAttribute('title');

        // Apply title in the custom tooltip
        instance.setContent(title);
    },
    onHidden: (instance: any) => {
        const element = <HTMLElement>instance.reference;
        const title = (
            element.getAttribute('data-tippy-value') || 
            element.getAttribute('title') || ''
        );

        // Add back the title as pure title attribute for next time it will be displayed
        element.setAttribute('title', title);
        element.removeAttribute('data-tippy-value');

        // Remove title from the custom tooltip
        instance.setContent('');
    }
});
```

The translations are now redy to use. Examples that follows shows how to handle translations in the view (html) and the controller (ts). It is important to use the same hierarchical structure used in the JSON file when you drill down to the desired value in the namespace.

Component View.
```html
<p [innerHTML]="'components.app.view.description' | translate"></p>
```

Component Controller. 
```typescript
onSelectLanguage(): void {
    this.translate
        .get('components.appMenu.controller.selectLanguage')
        .subscribe((result: any) => {
            const currentLang = this.translate.currentLang;
            const languages = this.appConfig.getConfig().locale.supported;
            this.dialog.createSelectDialog({
                title: result.title,
                content: result.content,
                yesButtonText: result.yesButton,
                cancelButtonText: result.cancelButton,
                options: languages,
                value: currentLang,
                onYes: (value: string) => {
                    this.translate.use(value);
                }
            });
        });
    }
```

Note that we fetch an objet here, not individual values. The JSON should look something like this.
```json
{
    "components": {
        "appMenu": {
            "controller": {
                "selectLanguage": {
                    "title": "Language selection",
                    "content": "Select language for the application",
                    "yesButton": "Apply language",
                    "cancelButton": "Abort"
                }
            }
        }
    }
}
```

As the above example shows, the handling of languages can be made very dynamic. Check out my other example [github.com/qulle/angular-dynamic-runtime-config](https://github.com/qulle/angular-dynamic-runtime-config) on how to load settings that handles the application without building a new release.
```json
{
    "locale": {
        "default": "sv-se",
        "selected": "en-us",
        "supported": [
            {
                "key": "English (en-us)",
                "value": "en-us"
            },
            {
                "key": "Swedish (sv-se)",
                "value": "sv-se"
            },
            {
                "key": "Chinese (zn-zh)",
                "value": "zn-zh"
            }
        ]
    },
}
```

## Author
[Qulle](https://github.com/qulle/)
