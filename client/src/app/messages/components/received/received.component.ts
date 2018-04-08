import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global'; 


@Component({
	selector: 'received',
	templateUrl: './received.component.html',
	providers: [UserService, MessageService]
})

export class ReceivedComponent implements OnInit{
	public title:string;
	public url:string;
	public identity;
	public token;
	public message: Message;
	public status:string;
	public messages: Message[];
	public page:number;
	public nextPage:number;
	public prevPage:number;
	public total:number;
	public pages:number;

	constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService,
			private _messageService: MessageService){
		this.title = 'Mensajes recibidos';
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

	}

	ngOnInit(){
		console.log('Received component cargado correctamente');
		this.actualPage();
	}

	getMessages(token, page){
		this._messageService.getMyMessages(token, page).subscribe(
			response =>{
				if(response.messages){
					console.log(response);
					this.messages = response.messages;
					this.pages = response.pages;
					this.total = response.total;
				}
			},
			error=>{
				console.log(<any>error);
			}
		);
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

			//Devolver listado de mensajes
			this.getMessages(this.token, this.page);
		});
	}
}