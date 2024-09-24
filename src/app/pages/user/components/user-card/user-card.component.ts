import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DataDropDownUser } from '../../models/data-drop-down-user.model';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { AddToFriendsResponse } from '../../models/add-to-friends-response.model';
import { firstValueFrom } from 'rxjs';
import { AddToFriendsRequest } from '../../models/add-to-friends-request.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EFriendRequestStatus, UserFriendRequest } from '../../models/user-friend-request.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [AvatarModule,CommonModule,ButtonModule ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent implements OnInit {
  @Input() user!:UserFriendRequest
  @Output() deleteFromFriendResult = new EventEmitter<AddToFriendsResponse>();
  @Output() acceptFriendrequestResult = new EventEmitter<AddToFriendsResponse>();
  requestStatus = EFriendRequestStatus
  imOwner:boolean = false;
  constructor(private userService:UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService:AuthService,) { }

  async ngOnInit() {
    this.imOwner = this.user.ownerId == (await firstValueFrom(this.authService.getCurrentUserState))?.id
  }
  async sendFriendRequest(){
   try {
    let request: AddToFriendsRequest = {friendId:this.user.id}
    let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.sendFriendRequest(request));
    this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
    this.user.status = response.data.status;
    this.user.ownerId = response.data.userId;
    this.imOwner = this.user.ownerId == (await firstValueFrom(this.authService.getCurrentUserState))?.id
   } catch (error) {
   }
  }
  async acceptFriendRequest(){
    try {
      let request: AddToFriendsRequest = {friendId:this.user.id,ownerId:this.user.ownerId}//necesita de ambos, ya que el usuario en sesión puede enviar y recibir solicitudes
      let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.acceptFriendRequest(request));
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.acceptFriendrequestResult?.emit(response.data);
    } catch (error) {

    }
  }
  async deleteFromFriends(){
    if(!await this.confirm1('¿Estás seguro de que deseas eliminarlo de tus amigos?','Confirmar eliminación'))
      return;
    try {
      let request: AddToFriendsRequest = {friendId:this.user.id,ownerId:this.user.ownerId}
      let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.deleteFromFriends(request));

      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.deleteFromFriendResult?.emit(response.data);
    } catch (error) {

    }
  }
  async deleteFriendRequest(){
    try {
      let request: AddToFriendsRequest = {friendId:this.user.id,ownerId:this.user.ownerId}//necesita de ambos, ya que el usuario en sesión puede enviar y recibir solicitudes
      let response: ResultPattern<AddToFriendsResponse> = await firstValueFrom(this.userService.deleteFriendRequest(request));
      this.messageService.add({ severity: 'success', summary: 'Acción exitosa', detail: response.message });
      this.user.status = response.data.status;
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
