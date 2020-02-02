import React, {useState} from 'react';
import './App.css';
import * as templates from './Templates.js'
import Radar from './Radar'

function App() {
  
  const[stats, setStats] = useState(templates.attackingMidfielder)
  const[color, setColor] = useState('Red')

  const selectTemplate = (event)=>{
    const templateStats = (templates[event.target.value]).map(v=>{return{...v, 'value': ''}})
    setStats(templateStats) 
  }

  const selectColor = (event) => {
    setColor(event.target.value)
  }

  const handleInputChange = (event)=>{
    const tempStats = [...stats]
    tempStats[event.target.getAttribute('index')][event.target.name] = event.target.value
    setStats(tempStats)
  }

  const deleteRow = (event) =>{
    const tempStats = [...stats]
    tempStats.splice(event.target.getAttribute('index'), 1)
    setStats(tempStats)
  }

  const addRow = () => {
    const tempStats = [...stats]
    tempStats.push({
      field: "",
      min:"",
      max:"" 
    })
    setStats(tempStats)
  }

  return (
    <div className="app">
      <h1 className="app-header">
        Radar Generator
      </h1>
      <div className="container">
        <div className="choose">
          <div className="options">
            <label className="template-label">
              Template
            </label>
            <select className="template-select" defaultValue = 'striker' onChange={selectTemplate}>
              <option value="custom">Custom</option>
              <option value="midfielder">Midfielder</option>
              <option value="attackingMidfielder">AM/Winger</option>
              <option value="striker">Striker</option>
              <option value="centerback">Centerback</option>
              <option value="fullback">Fullback</option>
              <option value="goalkeeper">Goalkeeper</option>


            </select>

            <label className="color-label">
              Color
            </label>
            <select className="color-select" onChange={selectColor}>
              <option value="Red">Red</option>
              <option value="Yellow">Yellow</option>
              <option value="Gold">Gold</option>
              <option value="Mediumpurple">Purple</option>
              <option value="Mediumseagreen">Green</option>
              <option value="Royalblue">Blue</option>
            </select>

          </div>
          <div className="fields">
            <div className="field-labels">
              <label className="label stat">Stat</label>
              <label className="label val">Min</label>
              <label className="label val">Max</label>
              <label className="label val">Value</label>
            </div>
            {stats.map((s,i)=>(
              <div key={i} className="input-row">
                
                <input index={i} name='field' placeholder="..." className='input stat' value={s.field} onChange={handleInputChange}></input>
                <input index={i} name='min' placeholder="" className='input val' value={s.min} onChange={handleInputChange}></input>
                <input index={i} name='max' placeholder="" className='input val' value={s.max} onChange={handleInputChange}></input>
                <input index={i} name='value' placeholder="" className='input val' value={s.value} onChange={handleInputChange}></input>
                <span index={i} className="delete" onClick={deleteRow}>x</span>
              </div>
            ))}
          </div>
          <div className="buttons">
              <button className="add" onClick={addRow}>
                Add
              </button>
          </div>
        </div>
        <div className="radar">
          <Radar data={stats} color={color}/>
        </div>
      </div>
    </div>
  );
}

export default App;
