import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'users',
	templateUrl: './users.component.html',
	providers: [UserService, FollowService]
})

export class UsersComponent implements OnInit{
	public title:string;
	public identity;
	public token;
	public page:number;
	public prevPage:number;
	public nextPage:number;
	public status:string;
	public total: number;
	public pages: number;
	public users: User[];
	public url:string
	public follows;
	public followUserOver;

	constructor(private _route: ActivatedRoute, private _router: Router, private _userService:UserService,
		private _followService: FollowService){
		this.title = 'Gente';	
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();	
		this.prevPage = 1;
		this.nextPage = 1;
		this.page = 1;
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('Users component ha sido cargado');
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe(params =>{
			let page = +params['page'];

			if(!page){
				page = 1;
			}

			this.page = page;
			this.prevPage = page - 1;
			this.nextPage = page + 1;

			if(this.prevPage == 0){
				this.prevPage = 1;
			}

			//Devolver listado de usuarios
			this.getUsers(this.page);
		});
	}

	getUsers(page){
		this._userService.getUsers(page).subscribe(
			response => {
				if(!response.users){
					this.status = 'fail';
				}else{
					console.log(response);
					this.total = +response.total;
					this.pages = +response.pages;
					this.users = response.users;
					this.follows = response.usersFollowing;
					if(page > this.pages){
						this._router.navigate(['/gente', 1]);
					}
				}

			},
			error=>{
				var errorMessage = <any> error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'fail';
				}
			}
		);
	}

	mouseEnter(userId){
		this.followUserOver = userId;
	}

	mouseLeave(userId){
		this.followUserOver = 0;
	}

	followUser(followed){
		var follow = new Follow('', this.identity._id, followed);
		this._followService.addFollow(this.token, follow).subscribe(
			response=>{
				if(!response.follow){
					this.status = 'fail';
				}else{
					this.status = 'success';
					this.follows.push(followed);
				}
			},
			error=>{
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage){
					this.status = 'fail';
				}
			}
		);
	}

	unFollowUser(followed){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response=>{
				var search = this.follows.indexOf(followed);
				if(search != -1){
					this.follows.splice(search, 1);
				}

			},
			error=>{
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage){
					this.status = 'fail';
				}
			}
		);
	}


}