import React from 'react';

export class Selector extends React.Component{

	constructor(props){
		super(props);

		this.opciones = [];
		this.selected = [];

		this.ramoChanged = this.ramoChanged.bind(this);

		for(let i = 0; this.props.ramos[i]; i++){
			this.opciones.push(
				<li key={"lr" + i}>
					<input type="checkbox" name={"opCB" + i} key={"r" + i} value="test" defaultChecked={true} onChange={() => this.ramoChanged(i)}/>
					[{this.props.ramos[i].code}]{this.props.ramos[i].name}
				</li>
			);
			this.selected.push(true);
		}
	}

	ramoChanged(i){
		this.selected[i] = !this.selected[i];
	}

	render(){
		return(
			<div align="left" id="Tabla">
				<h3>Seleccione ramos:</h3>
				{this.opciones}
			</div>
		);
	}
}