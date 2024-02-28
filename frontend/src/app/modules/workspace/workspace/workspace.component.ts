import { Component, OnInit } from '@angular/core';
import { UserRole } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  public userRole!: UserRole;

  constructor(
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
  }



  public logout() {
    this.authService.setLogOut();
  }

}
