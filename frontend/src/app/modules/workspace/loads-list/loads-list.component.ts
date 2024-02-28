import { Component, OnInit } from '@angular/core';
import { UserRole } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-loads-list',
  templateUrl: './loads-list.component.html',
  styleUrls: ['./loads-list.component.scss'],
})
export class LoadsListComponent implements OnInit {
  public userRole!: UserRole;

  constructor(
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
  }


}
