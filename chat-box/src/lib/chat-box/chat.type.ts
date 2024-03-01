import { TemplateRef } from '@angular/core';

export interface Chat {
    content?: any;
    role: string;
    message?: string;
    template?: TemplateRef<any>;
    data?: any;
    bubbleStyle?: any;
    hidden?: boolean;
}
