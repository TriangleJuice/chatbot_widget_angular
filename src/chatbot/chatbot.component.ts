import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatbotService } from './chatbot.service';
import {
  ChatbotMessage,
  ChatbotConversation,
} from './chatbot.types';

@Component({
  selector: 'aui-chatbot',
  styleUrls: ['./chatbot.component.scss'],
  templateUrl: './chatbot.component.html',
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messageInput') messageInput: ElementRef;

  // BFF URL
  @Input() url: string;

  // Required session ID to easily retrieve the chat history if necessary
  @Input() session: string;

  // Title above the chat window
  @Input() title = '';

  // Whether the chatbot is inline or pinned to the bottom of the application
  @Input() pinned = false;

  // Placeholder string in the chat input field
  @Input() placeholder = '';

  // Delay between multiple messages received from the chatbot engine
  @Input() delay = 400;

  // Height of the chatbot in pixels, only to use when the chatbot is not pinned
  @Input() height = 400;

  // Width of the chatbot in pixels, only to use when the chatbot is pinned
  @Input() width = 288;

  public data: ChatbotConversation = [];
  public message: ChatbotMessage;
  public isLoading = false;
  public isOpen = false;

  constructor(
    private chatbotService: ChatbotService,
  ) {}

  public ngOnInit(): void {
    this.message = {
      session_id: this.session,
      message: 'STARTCOMMANDO',
      type: 'text',
      send: true,
    };

    // Request opening message from chatbot
    // This can not be empty, so we trigger it by sending the special message 'STARTCOMMANDO'
    this.sendMessage(true);
  }

  public sendMessage(hide = false): void {
    if (!this.message.message) { return; }

    // Start loader
    this.isLoading = true;

    // Add to data
    if (!hide) {
      this.addToChat(this.message);
    }

    // Send new data
    this.chatbotService.sendMessage(this.url, this.message)
      .subscribe(
        (result: ChatbotConversation) => {
          result.forEach((item: ChatbotMessage, index) => {
            setTimeout(() => {
              this.addToChat(item);
            }, index * this.delay);
          });
          this.isLoading = false;
        },
        error => {
          this.pushError(error);
          this.isLoading = false;
        }
      );

    // Clean
    this.message.message = '';

    // Focus
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  public sendReply(event: any): void {
    this.message.message = event.message;
    this.sendMessage();
  }

  public toggleChatbot(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      }, 0);
    }
  }

  private addToChat(message): void {
    const newData = [
      ...this.data,
      Object.assign({}, message),
    ];
    this.data = newData;
  }

  private pushError(error): void {
    let message = 'Error';
    if (typeof error !== 'undefined') {
      const title = (error.error && error.error.title) ? error.error.title : error.title;
      message = 'Error ' + error.status + ' - ' + error.statusText + ': ' + title;
    }
    const errorMessage: ChatbotMessage = {
      message,
      type: 'error',
    };
    this.addToChat(errorMessage);
  }
}
