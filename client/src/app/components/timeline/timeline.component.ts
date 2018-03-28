import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';


@Component({
	selector: 'timeline',
	templateUrl: './timeline.component.html',
	providers: [UserService, PublicationService]
})

export class TimelineComponent implements OnInit {
	
	public title:string;
	public url:string;
	public identity;
	public token;
	public status: string;
	public page: number;
	public publications: Publication[];
	public total:number;
	public pages:number;
	public itemsPerPage:number;
	public noMore:boolean;

	constructor(private _route:ActivatedRoute, private _router: Router, private _userService: UserService,
		private _publicationService: PublicationService) {
		this.title = 'Timeline';
		this.url = GLOBAL.url;
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.page = 1;
		this.noMore = false;
	}

	ngOnInit(){
		console.log('Timeline component cargado');
		this.getPublication(this.page);
	}

	getPublication(page, adding = false){
		this._publicationService.getPublications(this.token, page).subscribe(
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
					}

					if(page > this.pages){
						this._router.navigate(['/home']);
					}
					this.status = 'success';
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
		}else{
			this.page += 1;
		}
		this.getPublication(this.page, true);
	}
}




