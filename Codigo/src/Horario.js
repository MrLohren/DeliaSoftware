import React from 'react';
import './Horario.css';

export class Horario extends React.Component{
	render(){
		return(
			<div className="Horario">
				<Dia id="Lunes"/>
				<Dia id="Martes"/>
				<Dia id="Miércoles"/>
				<Dia id="Jueves"/>
				<Dia id="Viernes"/>
				<Dia id="Sábado"/>
			</div>
		);
	}
}

export class Dia extends React.Component{
	constructor(props){
		super(props);

		this.casillas = [];
		for(let i = 0; i < 7; i++){
			let linea = "Test " + i;
			this.casillas.push(<Casilla text={linea} />);
		}
	}
	render(){
		return (	
			<div className="Dia">
				{this.props.id}
				<div id="Casillas">
					{this.casillas}
				</div>
			</div>
		);
	}
}

export class Casilla extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<div className="Casilla">{this.props.text}</div>
		);
	}
}