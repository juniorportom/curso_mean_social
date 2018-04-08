import { Component, OnInit} from '@angular/core';

@Component({
	selector: 'father',
	templateUrl: '/father.component.html'
})

export class FatherComponent implements OnInit{
	public title:string;
	public valor1:string;
	public valor2; 
	public datoRecibido;

	constructor(){
		this.title = 'Componente padre';
		this.valor2 = {
			name: 'Prueba',
			edad: 20,
			nick: 'nene'
		};
		this.valor1 = 'Prueba de paso de datos del padre al hijo';
	}

	ngOnInit(){
		
	}

	recibirDatos(event){
		console.log(event.nombre);
		this.datoRecibido = event;
	}

}