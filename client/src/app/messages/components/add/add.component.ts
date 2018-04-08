import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
//import { User } from '../../../models/user';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global'; 


@Component({
	selector: 'add',
	templateUrl: './add.component.html',
	providers: [MessageService, UserService, FollowService]
})

export class AddComponent implements OnInit{
	public title:string;
	public url:string;
	public identity;
	public token;
	public message: Message;
	public status:string;
	public follows;


	constructor(private _route: ActivatedRoute, private _router: Router, private _messageService: MessageService,
			private _followService: FollowService, private _userService: UserService){
		this.title = 'Enviar mensaje';
		this.url = GLOBAL.url;
		this.token = this._userService.getToken();
		this.identity = this._userService.getIdentity();
		this.message = new Message('', '', '', '', this.identity._id, '');
	}

	ngOnInit(){
		console.log('Add component cargado correctamente');
		this.getMyFollows();
	}

	getMyFollows(){
		this._followService.getMyFollows(this.token).subscribe(
			response =>{
				this.follows = response.follows;
			},
			error=>{
				console.log(<any>error);
			}
		);
	}

	onSubmit(form){
		console.log(this.message);
		this._messageService.addMessage(this.token, this.message).subscribe(
			response=>{
				if(response.message){
					this.status = 'success';
					form.reset();
					//this.message = response.message;
					//console.log(response.message);
				}else{
					//this.status = 'fail';
				}
				
			},
			error=>{
				console.log(<any>error);
				this.status = "fail";
			}
		);
	}

}