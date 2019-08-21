import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Horario.css';

export class Horario extends React.Component{
	
	constructor(props){
		super(props);

		this.baseTime = "2020-01-06"; // Lunes arbitrario
		this.events = [];
	}

	clearEvs(){
		this.events = [];
		this.forceUpdate();
	}

	addEv(ramo, grupo){
		//::Añade evento a partir de la estructura del ramo, y del grupo seleccionado

		for(let i = 0; ramo.horarios[grupo].bloques[i] != null; i++){
			let pos = ramo.horarios[grupo].bloques[i].pos;
			let inicio = this.getDia(Math.floor(pos / 7) + 1) + this.getBloqueI(pos % 7);
			let final = this.getDia(Math.floor(pos / 7) + 1) + this.getBloqueF(pos % 7);
			this.events.push(
				{
					title: ramo.name + "\n" + ramo.horarios[grupo].bloques[i].sala,
					start: new Date(inicio),
					end: new Date(final)
				}
			);
		}

		this.forceUpdate();
	}

	getDia(i){
		//::Obtiene fecha con formato (YYYY-MM-DD) como string
		/* OBS: Lunes = [1] */

		var fecha = new Date(this.baseTime);
		// Se suman los días correspondientes
		fecha.setTime(fecha.getTime() + (24 * 60 * 60 * 1000) * (i - 1) );

		var y = fecha.getFullYear();
		// slice es para tener dos dígitos
		var m = ("0" + (fecha.getMonth()+1) ).slice(-2);
		var d = ("0" + (fecha.getDate()+1) ).slice(-2);

		var texto = y + "-" + m + "-" + d;
		return texto;
	}

	getBloqueI(n){
		switch(n){
			case 0:
				return " 08:10";
			case 1:
				return " 09:50";
			case 2:
				return " 11:30";
			case 3:
				return " 14:10";
			case 4:
				return " 15:50";
			case 5:
				return " 17:30";
			case 6:
				return " 19:10";
			default:
				return "";
		}
	}

	getBloqueF(n){
		switch(n){
			case 0:
				return " 9:40";
			case 1:
				return " 11:20";
			case 2:
				return " 13:00";
			case 3:
				return " 15:40";
			case 4:
				return " 17:20";
			case 5:
				return " 19:00";
			case 6:
				return " 20:40";
			default:
				return "";
		}
	}

	render(){
		return(
			<div id="calDiv">
				<FullCalendar 
					ref="calRef"

					defaultView="timeGridWeek"
					plugins={[ timeGridPlugin]}
					header={false} // No muestra fecha actual
					defaultDate={this.baseTime} // Lunes arbitrario
					allDaySlot={false}
					contentHeight="auto"
				
					// Estructura:
					events={this.events}
					firstDay={1} // Empieza en lunes
					hiddenDays={[0]} // Sin domingo
					columnHeaderText= { // Headers de día
						// No existen en español nativamente
						function(date){
							switch(date.getDay()){
								case 1:
									return "Lunes";
								case 2:
									return "Martes";
								case 3:
									return "Miércoles";
								case 4:
									return "Jueves";
								case 5:
									return "Viernes";
								case 6:
									return "Sábado";
								default:
									return "";
							}
						}
					}

					// Slots:
					minTime="08:00" // Hora inicial de día
					maxTime="21:10" // Hora final del día
					slotLabelInterval="01:00"
					slotLabelFormat={{ // Formato de las marcas de hora
						hour: "numeric",
						minute: "2-digit",
						meridiem: "lowercase"
					}}
				/>
			</div>
		);
	}
}