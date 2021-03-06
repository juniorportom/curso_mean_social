import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'publications',
	templateUrl: './publications.component.html',
	providers: [UserService, PublicationService]
})

export class PublicationsComponent implements OnInit {
	public title: string;
	public identity;
	public token;
	public url:string;
	public status: string;
	public page:number;
	public total:number;
	public pages:number;
	public itemsPerPage:number;
	public publications: Publication[];
	public noMore:boolean;
	public loading:boolean;
	@Input() user: string;

	constructor(private _route: ActivatedRoute, private _router: Router, public _userService: UserService,
			private _publicationService: PublicationService){

		this.title = 'Publicaciones'
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.page = 1;
		this.noMore = false;
		this.loading = true;
	}

	ngOnInit(){
		console.log('Publications component cargado correctamente');
		this.getPublication(this.user, this.page);
	}

	getPublication(user, page, adding = false){
		this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
			response =>{
				console.log(response);
				if(response.publications){					
					this.total = response.totalItems;
					this.pages = response.pages;
					this.itemsPerPage = response.itemsPerPage;
					if(!adding){
						this.publications = response.publications;
					}else{
						var arrayA = this.publications;
						var arrayB = response.publications;
						this.publications = arrayA.concat(arrayB);
						$("html, body").animate({scrollTop: $('body').prop("scrollHeight")}, 500);
					}
					this.status = 'success';
					//$("#carga1").slideUp(1000).delay(5000).slideDown(1000);
					this.loading = false;
				}else{
					this.status = 'fail';
				}
			},
			error=>{
				var errorMessage = <any>error;
				console.log(errorMessage);
				if(errorMessage != null){
					this.status = 'fail';
				}
			}
		);
	}

	viewMore(){
		if(this.publications.length == this.total){
			this.noMore = true;
			this.loading = true;
		}else{
			this.page += 1;
			this.getPublication(this.user, this.page, true);
		}		
	}
}