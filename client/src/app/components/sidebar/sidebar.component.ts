import { Component, OnInit} from '@angular/core';
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

	constructor(private _userService : UserService, private _publicationService: PublicationService){
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
					this.status = 'success';
					form.reset();
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
}