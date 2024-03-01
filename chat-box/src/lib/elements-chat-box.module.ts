import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ElementsPopoverModule} from '@v-one/elements/popover';
import { NgxMdModule } from 'ngx-md';

import { ChatBoxComponent } from './chat-box/chat-box.component';

@NgModule({
    declarations: [
        ChatBoxComponent
    ],
    exports: [
        ChatBoxComponent
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        NgxMdModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ElementsPopoverModule
    ]
})
export class ElementsChatBoxModule { }
