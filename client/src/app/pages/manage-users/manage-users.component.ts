import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
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
     this.userService.deleteById(id).subscribe();
     this.users.forEach((element,index)=>{
      if(element.id === id) delete this.users[index];
   });
  }

  setActive(user: User, $event: MatSlideToggleChange){
    if($event.checked){
        user.active = 1; 
    } else{
        user.active = 0;
    }
  }
}
