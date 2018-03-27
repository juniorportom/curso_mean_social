import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';


@Component({
	selector: 'timeline',
	templateUrl: './timeline.component.html',
	providers: [UserService]
})

export class TimelineComponent implements OnInit {
	
	public title:string;
	public url:string;
	public identity;
	public token;

	constructor(private _route:ActivatedRoute, private _router: Router, private _userService: UserService) {
		this.title = 'Timeline';
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		console.log('Timeline component cargado');
	}
}