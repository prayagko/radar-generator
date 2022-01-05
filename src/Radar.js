import React, {useEffect, useState } from 'react'
import * as d3 from 'd3';

function Radar(props){

    const width = 600;
    const height = 600;

    const[data, setData] = useState(props.data)    

    function formatData(data){
      
      return data.map(d=>({'field' :d.metric, 'value':d.percentile, 'min':20,'max':100}))
    }

    useEffect(() => {
      
      setData(formatData(props.data))
    },[props.data])

    

  
    function angleToCoordinate(angle, value){
      let x = Math.cos(angle) * value;
      let y = Math.sin(angle) * value;
      return {"x": 300 + x, "y": 300 - y};
  }
    
  function reverseScale (min, max) { 
    return d3.scaleLinear().domain([50, 250]).range([min,max])
  }

  const chartAnnotations = [0, 50, 100, 150, 200, 250]
    let scales = data.map((d,i)=>{
      let angle = (Math.PI / 2) - (2 * Math.PI * i / data.length);
      const r = {field: d.field,
        func: d3.scaleLinear().domain([d.min, d.max]).range([50,250]),
        value: d.value && !isNaN(d.value) ? (d3.scaleLinear().domain([d.min, d.max]).range([50,250]))(d.value):1,
      }
      if(r.value<0){
        r.value = 1
      }
      if(r.value>250){
        r.value=250
      }

      
      let labelCoordinate = angleToCoordinate(angle, 270);
      r.labelCoordinate = labelCoordinate
      const axisValues = chartAnnotations.map((c)=>{
        let axisCoordinates = angleToCoordinate(angle, c)
        const v = {
          axisValue: reverseScale(d.min, d.max)(c),
          x: axisCoordinates.x,
          y: axisCoordinates.y
        }
        return v
        
      })
      r.axis = axisValues

        return r
      })


    let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);

    function getPathCoordinates(scales){
      let coordinates = [];
      for (var i = 0; i < scales.length; i++){
          let item = scales[i];
          let angle = (Math.PI / 2) - (2 * Math.PI * i / scales.length);
          coordinates.push(angleToCoordinate(angle, item['value'], item.func));
      }
      return coordinates;
    }

    const pathCoordinates = getPathCoordinates(scales)

    return (
        <svg width={width+50} height={height+50}>
          <path fill={props.color} d={line(pathCoordinates) } opacity = {0.7}></path>
          {scales.map((i, index) => {
            const rotate = (360/scales.length) * index
            return <React.Fragment key={index}>
              (<text key={i.field} x={i.labelCoordinate.x} y={i.labelCoordinate.y}  textAnchor="middle" 
              transform={`rotate(${rotate},${i.labelCoordinate.x},${i.labelCoordinate.y})`} 
              fontSize= "12" fontWeight="bold">{i.field}</text>
              {i.axis.slice(1).map((a, index)=>
                  <text key={`${i.field}-${index}`} x={a.x} y={a.y}  textAnchor="middle"  
                  transform={`rotate(${rotate},${a.x},${a.y})`} 
                  fontSize= "9" fontWeight="bold">{parseFloat(a.axisValue).toFixed(2)}</text>
          )}
              </React.Fragment>
          })}

          {chartAnnotations.map((i) => (
            <g key={i} transform={`translate(${width / 2}, ${height / 2})`}>
              <circle r={i} fill="none" stroke="#999" strokeWidth="25" opacity = {0.4}/>
            </g>
          ))}
          </svg>  
      )
}

export default Radar