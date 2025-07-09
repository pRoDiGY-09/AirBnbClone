import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login:boolean=true;

  changeForm(){
    if (this.login){
      this.login=false
    }
    else{
this.login=true
    }
    
    console.log(this.login)
  }
}
