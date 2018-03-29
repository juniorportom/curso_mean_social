import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';


@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService, PublicationService]
})

export class SidebarComponent implements OnInit {
	public stats;
	public token;
	public identity;
	public status:string;
	public url:string;
	public publication: Publication;

	constructor(private _route: ActivatedRoute, private _router: Router, private _userService : UserService, 
			private _publicationService: PublicationService){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.publication = new Publication('', '', '', '', this.identity._id);
	}

	ngOnInit(){
		console.log('Sidebar component cargado');
	}

	onSubmit(form){
		this._publicationService.addApplication(this.token, this.publication).subscribe(
			response =>{
				if(response.publication){
					//this.publication = response.publication;
					this._userService.getCounters().subscribe(
						response=>{
							localStorage.setItem('stats', JSON.stringify(response.value));
							this.stats = response.value;
							this.status = 'success';
							form.reset();
							this._router.navigate(['/timeline']);
						},
						error=>{
							console.log(error);
							this.status = 'fail';
						}
					);					
				}
				else
				{
					this.status = 'fail';
				}
			},
			error =>{
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'fail';
				}
			} 
		);

	}

	//Output
	@Output() sended = new EventEmitter();
	sendPublication(event){
		//console.log(event);
		this.sended.emit({send: 'true'});
	}
}