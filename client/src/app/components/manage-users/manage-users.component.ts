import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  loading = false;
  users: User[] = [];
  error: string;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loading = true;
        this.userService.getAll().subscribe(
          users => {
            this.loading = false;
            this.users = users;
          },
          error => {
            this.error = error;
          }
        );
  }

  onDelete(id: number) {
     // todo: delete user and notify
  }

  setActive(user: User, e: any){
    if(e.checked){
        user.active = true; 
    } else{
        user.active = false;
    }
}

}
