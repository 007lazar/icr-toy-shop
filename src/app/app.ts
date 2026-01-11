import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';
import { MessageModel } from '../models/message.model';
import { FormsModule } from "@angular/forms";
import { ToyModel } from '../models/toy.model';
import { RasaService } from '../services/rasa.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
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
          if (botMsg.attachment.type === 'toy_list' && Array.isArray(botMsg.attachment.data)) {
            let html = '';
            for (let toy of botMsg.attachment.data as ToyModel[]) {
              html += `<ul class="list-unstyled mb-2">`;
              html += `<li><strong>Name:</strong> ${toy.name}</li>`;
              html += `<li><strong>Type:</strong> ${toy.type.name}</li>`;
              html += `<li><strong>Age Group:</strong> ${toy.ageGroup.name}</li>`;
              html += `<li><strong>Price:</strong> $${toy.price}</li>`;
              html += `<li><a href="/toy/permalink/${toy.permalink}">View Details</a></li>`;
              html += `</ul>`;
              html += `<hr>`;
            }
            this.messages.push({ type: 'bot', text: html });
          }

          // Simple object lists (type, age group)
          if (['type_list', 'age_group_list', 'target_group_list'].includes(botMsg.attachment.type)) {
            let html = '<ul class="list-unstyled">';
            for (let obj of botMsg.attachment.data) {
              html += `<li>${obj.name}</li>`;
            }
            html += '</ul>';
            this.messages.push({ type: 'bot', text: html });
          }
        }

        // Normal bot text message
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
