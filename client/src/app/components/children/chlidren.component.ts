import { Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
	selector: 'children',
	templateUrl: '/children.component.html'
})

export class ChildrenComponent implements OnInit{
	public title:string;

	@Input('text1') property1:string;
	@Input('text2') property2:string;

	@Output() fromChildren = new EventEmitter();

	constructor(){
		this.title = 'Componente hijo';
	}

	ngOnInit(){
		console.log(this.property1);
		console.log(this.property2);
	}

	enviar(){
		this.fromChildren.emit({
			nombre:'Reinaldo Portocarrro Web',
			correo: 'portocr@prueba.com',
			telefono: 7903563
		});
	}

}