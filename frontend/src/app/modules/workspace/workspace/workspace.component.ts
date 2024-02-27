import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  public userRole!: { role: string; description: string };
  public userInfo = this.authService.getCurrentUserInfo();

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
