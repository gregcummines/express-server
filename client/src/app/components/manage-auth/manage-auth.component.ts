import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-auth',
  templateUrl: './manage-auth.component.html',
  styleUrls: ['./manage-auth.component.css']
})
export class ManageAuthComponent implements OnInit {
  loading = false;
  users: User[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loading = true;
        this.userService.getAll().subscribe(users => {
            this.loading = false;
            this.users = users;
        });
  }

}
