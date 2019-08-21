import React from 'react';
import './App.css';

import {Usuario} from "./Usuario";
import {Horario} from "./Horario";
import {Selector} from "./Selector";

class App extends React.Component {
  
  constructor(props){
    super(props);

    // Data:
    // * OBS: Malla solo disponible hasta 3er semestre *
    this.malla = require("./backend/malla_informatica.json");
    this.usuario = new Usuario();
    this.current = this.usuario.sem_actual;
    this.cursables = [];
    this.combinatoria = [];
    this.limpios = [];
    this.selected = [];
    
    // Otros:
    this.makeOptions = this.makeOptions.bind(this);
    this.showSelector = this.showSelector.bind(this);
    this.ocultSelector = this.ocultSelector.bind(this);
    this.botones = [<button key="defaultButton" className="tablinks" onClick={() => this.selectCal(-1)}>Default</button>];

    // Genera arreglo de ramos cursables:
    this.disponibles = [];
    this.cursables = [];
    this.genDisponibles();
  }

  showSelector(){
    this.refs.modalW.style.display = "block";
  }

  ocultSelector(){
    this.refs.modalW.style.display = "none";

    // Se obtienen elementos seleccionados:
    this.selected = this.refs.selRef.selected;
  }

  selectCal(i){
    if(i < 0)
      return;

    this.refs.calRef.clearEvs();
    for(let r = 0; this.limpios[i][r] != null; r++){ // Por cada ramo
      this.refs.calRef.addEv(
        this.cursables[r],
        this.limpios[i][r]
      );
    }

    this.usuario.selected = i;
  }

  makeOptions(){
    //::Primera función, que comenzará todo el proceso
    this.refs.calRef.clearEvs();

    // Filtra los ramos escogidos:
    /* OBS: Guarda en 'cursables' */
    this.genEscogidos();

    // Genera toda la combinatoria posible:
    this.combinatoria = []
    this.genCombinatoria();

    // Genera opciones sin choques:
    this.limpios = [];
    this.genLimpios();
    if(this.limpios.length === 0){
      alert("No se han encontrado opciones válidas.\nPuede deberse a falta de información.");
      return;
    }

    // Genera botones para opciones:
    this.botones = [];
    this.genOpciones();
  }

  genEscogidos(){
    this.cursables = [];
    for(let i = 0; this.disponibles[i]; i++){
      if(this.selected[i]){
        this.cursables.push(this.disponibles[i]);
      }
    }
  }

  genOpciones(){
    //::Genera botones para escoger entre las opciones válidas

    for(let i = 0; this.limpios[i] != null; i++){ // Por cada opción limpia
      this.botones.push(
        <button className="tablinks" key={"op"+i} onClick={() => this.selectCal(i)}>Opcion {i+1}</button>
      );
    }

    this.forceUpdate();
  }

  genLimpios(){
    //::Chequea que, para una sub-combinatoria, no choquen ramos

    // Genera arreglo de representación binaria de los ramos:
    /* OBS: Ésto es porque se trabajará con operaciones bitwise */
    let posBin = this.genPosBin();
    
    // Se prueba por choques:
    for(let c = 0; this.combinatoria[c] != null; c++){ // Por cada sub-combinatoria
      let hit = false;
      let base = [0, 0, 0, 0, 0, 0] // Una posición por día; Llevará registro de todos bloques ya ocupados (uso de OR)

      for(let r = 0; this.combinatoria[c][r] != null; r++){ // Por cada ramo

        for(let d = 0; d < 6; d++){ // Por cada día
          let grupo = this.combinatoria[c][r];
          let andV = base[d] & posBin[r][grupo][d];
          // Si se encontró choque:
          if(andV > 0){
            hit = true;
            break;
          }

          // Actualiza bloques ya ocupados:
          let orV = base[d] | posBin[r][grupo][d];
          base[d] = orV;
        }

        if(hit)
          break;
      }

      // Si la combinatoria es válida, se agrega:
      if(!hit){
        this.limpios.push([...this.combinatoria[c]]);
      }
    }
  }

  genPosBin(){
    //::Genera string binario equivalente con la posición de los bloques de cada ramo
    let allPos = [];
    for(let r = 0; this.cursables[r] != null; r++){ // Por cada ramo
      let ramoPos = [];
      for(let g = 0; this.cursables[r].horarios[g] != null; g++){ // Por cada grupo
        let diasPos = [0, 0, 0, 0, 0, 0]; // Uno por c/día; Se separa en días para evitar problemas con el largo del tipo 'int'
        for(let b = 0; this.cursables[r].horarios[g].bloques[b] != null; b++){ // Por cada bloque
          diasPos[
            Math.floor(this.cursables[r].horarios[g].bloques[b].pos / 7)
          ] += Math.pow(2, this.cursables[r].horarios[g].bloques[b].pos % 7);  
        }
        ramoPos.push([...diasPos]);
      }
      allPos.push([...ramoPos]);
    }

    return allPos;
  }

  genCombinatoria(){
    //::Genera arreglo con toda la combinatoria de grupos

    let cardGrupos = this.genCardGrupos();

    let base = [];
    
    let r = 0;
    for(; cardGrupos[r] != null; r++){
      base.push(0);
    }
    let len = r; // Guarda cant. de ramos

    // Se generan variaciones de los elementos ya existentes,
    // excepto por la primera iteración.

    let added = 0;
    let aux;
    let dig;
    for(r = 0; r < len; r++){
      if(r === 0){ // Primera vez; se trabajo con arreglo 'base'
        aux = [...base];
        for(dig = 0; dig < cardGrupos[r]; dig++, added++){
          aux[r] = dig;
          this.combinatoria.push([...aux]); 
        }
      }else{ // Caso normal
        // Se realizan variaciones de los elementos ya presentes en la lista
        let oldSize = added;
        for(let j = 0; j < oldSize; j++){
          aux = [...this.combinatoria[j]];
          for(let k = 1; k < cardGrupos[r]; k++, added++){
            aux[r] = k;
            this.combinatoria.push([...aux]);
          }
        }
      }
    }
  }

  genCardGrupos(){
    //::Genera arreglo con la cardinalidad de cada ramo
    //  es decir, cuenta los grupos por ramo

    let largos = [];
    for(let r = 0; this.cursables[r] != null; r++){ // Por cada ramo
      largos.push(this.cursables[r].horarios.length);
    }

    return largos;
  }

  genDisponibles(){
    //::Arma el arreglo de los posibles ramos a tomar el presente semestre
    
    // Ya se han calculado
    if(this.disponibles[0] != null)
    return;
    
    this.selected = [];
    for(let i = 0; this.malla[i] != null; i++){ // Por cada ramo
      // Omisión:
      if(this.malla[i].position > this.current || this.isApproved(this.malla[i].code)){
        continue;
      }

      // Se buscan requisitos:
      let correct = true;
      for(let j = 0; this.malla[i].requisites[j] != null; j++){
        if( !this.isApproved(this.malla[i].requisites[j]) ){ // Si no está aprobado
          correct = false;
          break;
        }
      }

      // Si terminó correcto, se agrega el ramo:
      if(correct){
        this.disponibles.push(this.malla[i]);
        this.selected.push(true);
      }
    }

  }
  
  isApproved(code){
    if(code === "")
      return true;

    for(let i = 0; this.usuario.approved[i] != null; i++){
      if(this.usuario.approved[i] === code)
        return true;
    }
    return false;
  }

  render(){
    return(
      <div className="App">
        <div className="header">
          <h3 align="left">{this.usuario.nombre} - Semestre {this.current}</h3>
        </div>
        <button className="utilidades" align="left" onClick={this.showSelector}>Seleccionar Ramos</button>
        <button className="utilidades" onClick={this.makeOptions}>Generar Horarios</button>
        <br />

        <div ref="modalW" className="modal">
          <div className="modal-content">
            <span className="close" onClick={this.ocultSelector} >&times;</span>
            <Selector ramos={this.disponibles} ref="selRef"/>
          </div>
        </div>
      
        <div className="tab" id="tab">
          {this.botones}
        </div>
        <Horario ref="calRef" />
      </div>
    );
  }
}

export default App;
