import { Component, ViewChild, ElementRef } from '@angular/core';
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
export class App {
  @ViewChild('chatMessages') chatMessages?: ElementRef<HTMLElement>;

  protected year = new Date().getFullYear();
  protected waitingForResponse = false;
  protected botThinkingPlaceholder = 'Thinking...';
  protected isChatVisible = false;
  protected userMessage = '';
  protected messages: MessageModel[] = [];
  protected showScrollButton = false;

  constructor(private router: Router, private utils: Utils) {
    UserService.getUsers()

    // Initial bot greeting
    this.messages.push({
      type: 'bot',
      text: 'Hi! I am your Toy Shop Assistant. How can I help you today?'
    });
  }

  private getChatEl(): HTMLElement | null {
    return this.chatMessages?.nativeElement ?? null;
  }

  private isAtBottom(): boolean {
    const el = this.getChatEl();
    if (!el) return true;

    // -1 - one pixel for rounding
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
  }

  private updateScrollButton() {
    this.showScrollButton = !this.isAtBottom();
  }

  onChatScroll() {
    this.updateScrollButton();
  }

  scrollToBottom() {
    const el = this.getChatEl();
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    this.showScrollButton = false;
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;

    if (this.isChatVisible) {
      setTimeout(() => this.updateScrollButton(), 0);
    }
  }


  async sendUserMessage() {
    if (this.waitingForResponse) return;

    const trimmedMessage = this.userMessage.trim();
    if (!trimmedMessage) return;

    this.userMessage = '';
    this.messages.push({ type: 'user', text: trimmedMessage });
    this.messages.push({ type: 'bot', text: this.botThinkingPlaceholder });
    setTimeout(() => this.updateScrollButton(), 0);

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
            this.messages.push({ type: 'bot', toys: botMsg.attachment.data });
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

      setTimeout(() => this.updateScrollButton(), 0);

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
