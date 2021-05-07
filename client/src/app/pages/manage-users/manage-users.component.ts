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
    const index: number = this.users.findIndex((element) => element.id === id);
    this.users.splice(index, 1);
  }

  trackByFn(i: number) { 
    return i;
  }

  setActive(user: User, $event: MatSlideToggleChange){
    if($event.checked){
      this.userService.setActive(user.id).subscribe();
      user.active = 1; 
    } else{
      this.userService.setInactive(user.id).subscribe();
      user.active = 0;
    }
  }
}
