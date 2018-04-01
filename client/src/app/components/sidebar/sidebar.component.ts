import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';


@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	providers: [UserService, PublicationService, UploadService]
})

export class SidebarComponent implements OnInit {
	public stats;
	public token;
	public identity;
	public status:string;
	public url:string;
	public publication: Publication;
	public filesToUpload: Array<File>;
	@Output() sended = new EventEmitter();

	constructor(private _route: ActivatedRoute, private _router: Router, private _userService : UserService, 
			private _publicationService: PublicationService, private _uploadService: UploadService){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.stats = this._userService.getStats();
		this.url = GLOBAL.url;
		this.publication = new Publication('', '', '', '', this.identity._id);
	}

	ngOnInit(){
		console.log('Sidebar component cargado');
	}

	onSubmit(form, event){
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			responsePub =>{
				if(responsePub.publication){
					//this.publication = response.publication;
					this._userService.getCounters().subscribe(
						response=>{							
							//Subir imagen
							console.log(responsePub);
							if(this.filesToUpload && this.filesToUpload.length){
								this._uploadService.makeFileRequest(this.url + 'upload-image-pub/' +
								responsePub.publication._id, [], this.filesToUpload, this.token, 'image')
										.then((result:any)=>{
									this.publication.file = result.image;
									localStorage.setItem('stats', JSON.stringify(response.value));
									this.stats = response.value;
									this.status = 'success';
									form.reset();
									this._router.navigate(['/timeline']);
									this.sended.emit({send: 'true'});
							});
							}else{
								localStorage.setItem('stats', JSON.stringify(response.value));
								this.stats = response.value;
								this.status = 'success';
								form.reset();
								this._router.navigate(['/timeline']);
								this.sended.emit({send: 'true'});
							}
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

	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	//Output
	
	sendPublication(event){
		//console.log(event);
		this.sended.emit({send: 'true'});
	}
}