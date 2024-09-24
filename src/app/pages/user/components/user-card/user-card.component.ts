import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DataDropDownUser } from '../../models/data-drop-down-user.model';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { AddToFriendsResponse } from '../../models/add-to-friends-response.model';
import { firstValueFrom } from 'rxjs';
import { AddToFriendsRequest } from '../../models/add-to-friends-request.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [AvatarModule,CommonModule,ButtonModule ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() user!:DataDropDownUser
  @Input() showAddToFriends!:boolean
  @Input() showDeleteToFriends!:boolean
  @Output() addToFriendResult = new EventEmitter<AddToFriendsResponse>();
  @Output() deleteToFriendResult = new EventEmitter<AddToFriendsResponse>();
  constructor(private userService:UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,) { }

  async addToFriends(){
   try {
    let request: AddToFriendsRequest = {friendId:this.user.id}
    let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.addToFriends(request));
    this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
    this.addToFriendResult?.emit(response.data);
   } catch (error) {

   }
  }
  async deleteToFriends(){
    if(!await this.confirm1('¿Estás seguro de que deseas eliminarlo de tus amigos?','Confirmar eliminación'))
      return;
    try {
      let request: AddToFriendsRequest = {friendId:this.user.id}
      let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.deleteToFriends(request));
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.deleteToFriendResult?.emit(response.data);
    } catch (error) {

    }
  }
  confirm1(_message:string,title:string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: _message,
        header: title,
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          resolve(true); // Resolviendo la promesa con true si se acepta
        },
        reject: () => {
          resolve(false); // Resolviendo la promesa con false si se rechaza
        }
      });
    });
  }
}
