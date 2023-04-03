import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DelegateInstance, Props, delegate } from 'tippy.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'angular-localization';
    private tippy: DelegateInstance<Props> | undefined;

    constructor(private readonly translate: TranslateService) {}

    private initTranslations(): void {
        // Fallback language
        this.translate.setDefaultLang('sv-se');

        // Selected language
        this.translate.use('en-us');
    }

    private initTippyDelegate(): void {
        // Global Tippy instance
        this.tippy = delegate(document.body, {
            target: '.app-tippy',
            placement: 'right',
            appendTo: document.body,
            touch: false,
            onShow: (instance: any) => {
                const element = <HTMLElement>instance.reference;
                const title =
                    element.getAttribute('title') || element.getAttribute('data-tippy-value') || '';

                // Store the title to not have multiple tooltips
                element.setAttribute('data-tippy-value', title);
                element.removeAttribute('title');

                // Apply title in the custom tooltip
                instance.setContent(title);
            },
            onHidden: (instance: any) => {
                const element = <HTMLElement>instance.reference;
                const title =
                    element.getAttribute('data-tippy-value') || element.getAttribute('title') || '';

                // Add back the title as pure title attribute for next time it will be displayed
                element.setAttribute('title', title);
                element.removeAttribute('data-tippy-value');

                // Remove title from the custom tooltip
                instance.setContent('');
            },
        });
    }

    ngOnInit(): void {
        this.initTranslations();
        this.initTippyDelegate();
    }

    onLanguageChange(event: Event): void {
        const language = (<HTMLSelectElement>event.target).value;
        this.translate.use(language);
    }
}
