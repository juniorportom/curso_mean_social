import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
	selector: 'followed',
	templateUrl: './followed.component.html',
	providers: [UserService, FollowService]
})

export class FollowedComponent implements OnInit{

	public title: string;
	public identity;
	public token;
	public url:string;
	public page:number;
	public nextPage:number;
	public prevPage:number;
	public total:number;
	public pages:number;
	public users: User[];
	public follows;
	public status:string;
	public followUserOver;
	public followed;
	public userPageId;
	public user: User;


	constructor(private _route:ActivatedRoute, private _router: Router, private _userService: UserService,
		private _followService: FollowService){
		this.title = 'Seguidores de ';
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

	}

	ngOnInit(){
		console.log('Followed component cargado correctamente');
		this.actualPage();
	}

	actualPage(){
		this._route.params.subscribe(params =>{
			let userId = params['id']; 
			this.userPageId = userId;
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
			this.getUser(userId, this.page);
		});
	}

	getFollows(userId, page){
		this._followService.getFollowed(this.token, userId, page).subscribe(
			response => {
				if(!response.follows){
					this.status = 'fail';
				}else{
					console.log(response);
					this.total = +response.total;
					this.pages = +response.pages;
					this.followed = response.follows;
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

	getUser(userId, page){
		this._userService.getUser(userId).subscribe(
			response=>{
				if(response.user){
					this.user = response.user;
					this.getFollows(userId, page);
				}else{
					this._router.navigate(['/home']);
				}				
			},
			error=>{
				console.log(<any>error);
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