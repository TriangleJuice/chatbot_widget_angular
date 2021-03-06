import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@acpaas-ui/ngx-icon';

import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotService } from './chatbot/chatbot.service';
import { Components } from './components/root';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IconModule,
  ],
  exports: [
    ChatbotComponent,
    ...Components,
  ],
  declarations: [
    ChatbotComponent,
    ...Components,
  ],
  providers: [
    ChatbotService,
  ],
})
export class ChatbotModule { }
