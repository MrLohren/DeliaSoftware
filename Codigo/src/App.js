import React, { Component } from 'react';
import './App.css';
import {Usuario} from './Usuario';
import {Horario, Dia, Casilla} from './Horario';

class App extends Component {
  constructor(props){
    super(props);
    // Carga informacion:
    this.usuario = new Usuario;
    this.data = require('./backend/malla_informatica.json');
    this.curr = 1;
    
    // Cuenta cantidad de ramos en malla:
    let i = 0;
    for(; this.data[i] != null; i++);
    this.data_l = i;

    this.addCurr = this.addCurr.bind(this);
  }
  addCurr(){
    this.curr++;
    this.forceUpdate();
  }
  render() {
    let lista = [];
    let added = 0;
    for(let i = 0; i < this.data_l; i++){
      if(this.data[i].position == this.curr){
        lista.push(<li>{this.data[i].code}::{this.data[i].name}</li>);
        added++;
      }
    }
    if(added == 0){
      lista = <li>No se encontraron elementos</li>;
    }
    return (
      <div className="App">
       <button onClick={this.addCurr}>Add Semestre</button><br />
       Semestre {this.curr}:<br />
       Ramos {added}:<br />
       <ul>
        {lista}
       </ul>
       <Horario />
     </div>
    );
  }
}

export default App;
