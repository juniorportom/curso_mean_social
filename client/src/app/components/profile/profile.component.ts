import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { FollowService } from '../../services/follow.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	providers: [UserService, FollowService]
})

export class ProfileComponent implements OnInit{
	public title:string;
	public identity;
	public token;
	public url:string;
	public user: User;
	public status:string;
	public stats;
	public follow: Follow;

	constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
			private _followService: FollowService){
		this.title = 'Perfil';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.stats = this._userService.getStats();
	}

	ngOnInit(){
		console.log('Profile component cargado correctamente');		
	}
}