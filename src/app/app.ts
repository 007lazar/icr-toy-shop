import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';
import { MessageModel } from '../models/message.model';
import { FormsModule } from "@angular/forms";
import { RasaService } from '../services/rasa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewChecked {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  
  protected year = new Date().getFullYear();
  protected waitingForResponse = false;
  protected botThinkingPlaceholder = 'Thinking...';
  protected isChatVisible = false;
  protected userMessage = '';
  protected messages: MessageModel[] = [];

  constructor(private router: Router, private utils: Utils) {
    // Initial bot greeting
    this.messages.push({
      type: 'bot',
      text: 'Hi! I am your Toy Shop Assistant. How can I help you today?'
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (err) {}
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  async sendUserMessage() {
    if (this.waitingForResponse) return;

    const trimmedMessage = this.userMessage.trim();
    if (!trimmedMessage) return;

    this.userMessage = '';
    this.messages.push({ type: 'user', text: trimmedMessage });
    this.messages.push({ type: 'bot', text: this.botThinkingPlaceholder });

    this.waitingForResponse = true;

    try {
      const rsp = await RasaService.sendMessage(trimmedMessage);

      // Remove thinking placeholder
      this.removeBotPlaceholder();

      if (!rsp.data || rsp.data.length === 0) {
        this.messages.push({
          type: 'bot',
          text: "Sorry, I didn't understand your question!"
        });
        this.waitingForResponse = false;
        return;
      }

      for (let botMsg of rsp.data) {
        if (botMsg.attachment) {
          // Toy list attachment
          if (botMsg.attachment?.type === 'toy_list' && Array.isArray(botMsg.attachment.data)) {
            this.messages.push({ type: 'bot', toys: botMsg.attachment.data});
          }

          // Simple object lists (type, age group)
          if (['type_list', 'age_group_list'].includes(botMsg.attachment.type)) {
            let html = '<ul class="list-group list-group-numbered">';
            for (let obj of botMsg.attachment.data) {
              html += `<li class="list-group-item">${obj.name}</li>`;
            }
            html += '</ul>';
            this.messages.push({ type: 'bot', text: html });
          }
        }

        if (botMsg.text) {
          this.messages.push({ type: 'bot', text: botMsg.text });
        }
      }

    } catch (err) {
      this.removeBotPlaceholder();
      this.messages.push({
        type: 'error',
        text: "Oops! Something went wrong. Please try again later."
      });
    }

    this.waitingForResponse = false;
  }

  removeBotPlaceholder() {
    this.messages = this.messages.filter(m => m.text !== this.botThinkingPlaceholder);
  }

  getUserName() {
    const user = UserService.getActiveUser();
    return user ? `${user.fullName}` : 'Guest';
  }

  hasAuth() {
    return UserService.hasAuth();
  }

  doLogout() {
    this.utils.showDialog(
      "Are you sure you want to log out?",
      () => {
        UserService.logout();
        this.router.navigateByUrl('/login');
      },
      `Don't Logout`,
      "Logout Now"
    );
  }
}
