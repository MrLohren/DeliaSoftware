import React from 'react';

export class Usuario extends React.Component{
	constructor(props){
		super(props);
		
		this.nombre = "Miguel García";
		this.id_malla = "Malla Informática";
		this.sem_actual = 1;
		this.selected = -1;
		this.approved = [];
	}

	render(){
		return;
	}
}