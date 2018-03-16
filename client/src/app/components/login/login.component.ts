import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})

export class LoginComponent implements OnInit {
	public title: string;
	public user: User;
	public status: string;
	public identity;
	public token;


	constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService){
		this.title = 'Identificate';
		this.user = new User("", "", "", "", "", "", "USER_ROLE", "", "");
	}

	ngOnInit(){
		console.log('Componente de login cargado');
	}

	onSubmit(){
		//loguear al usuario y obtener sus datos
		this._userService.singup(this.user).subscribe(
			response => {
				//console.log(response.user);
				this.identity = response.user;
				if(!this.identity || !this.identity._id){
					this.status = 'fail';
				}else{
					this.status = 'success';
					// Persistir datos del usuario
					localStorage.setItem('identity', JSON.stringify(this.identity));

					// Conseguir el token
					this.getToken();
				}				
			},
			error =>{
				console.log(error);
				this.status = 'fail';
			}
		);
	}

	getToken(){
		this._userService.singup(this.user, 'true').subscribe(
			response=>{
				this.token = response.token;
				if(this.token.length <= 0){
					this.status = 'fail';
				}else{
					this.status = 'success';
					//Persistir token del usuario
					localStorage.setItem('token', this.token);

					// Conseguir los contadores del usuario


				}
			},
			error=>{
				console.log(error);
				this.status = 'fail';

			}
		);
	}
}