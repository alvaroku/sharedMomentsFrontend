import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DataDropDownUser } from '../../models/data-drop-down-user.model';
import { ResultPattern } from '../../../../shared/models/result-pattern.model';
import { UserService } from '../../services/user.service';
import { first, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddToFriendsResponse } from '../../models/add-to-friends-response.model';
import { UserFriendRequest } from '../../models/user-friend-request.model';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [AvatarModule,CommonModule,UserCardComponent,ButtonModule,LoadingComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {
  isLoading: boolean = false;
  noFriends!: UserFriendRequest[]
  friends!: UserFriendRequest[]
  constructor(private userService:UserService, private confirmationService: ConfirmationService,) { }

  async ngOnInit(){
    this.isLoading = true;
    let responseNoFriends: ResultPattern<UserFriendRequest[]> = await firstValueFrom(this.userService.getNoFriendList());
    this.noFriends = responseNoFriends.data;

    let responseFriends: ResultPattern<UserFriendRequest[]> = await firstValueFrom(this.userService.getFriendList());
    this.friends = responseFriends.data
    this.isLoading = false;
  }

  deleteFromFriendResult(data:AddToFriendsResponse){
    let user:UserFriendRequest = this.friends.find(x => x.id === data.friendId) as UserFriendRequest
    user.status = data.status;
    this.noFriends.push(user);
    this.friends = this.friends.filter(x => x.id !== data.friendId);
  }
  acceptFriendrequestResult(data:AddToFriendsResponse){
    let user:UserFriendRequest = this.noFriends.find(x => x.id === data.friendId) as UserFriendRequest
    user.status = data.status;
    this.friends.push(user);
    this.noFriends = this.noFriends.filter(x => x.id !== data.friendId);
  }
}
