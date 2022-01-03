import React, {useState, useEffect} from 'react';
import './App.css';
import Radar from './Radar'

import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from 'react-query'


const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: false,
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
})

const colorList = ['Red','Blue','Gold','Mediumpurple','Mediumseagreen','Royalblue']

const leagueList = ['premier-league','serie-a', 'la-liga', 'ligue-un', 'bundesliga', 'major-league-soccer', 'womens-super-league']

const defaultTemplate = ['Non-Penalty Goals', 'npxG', 'Shots Total', 'Assists', 'xA', 'npxG+xA', 'Shot-Creating Actions', 'Passes Attempted', 'Pass Completion %',
'Progressive Passes', 'Progressive Carries', 'Dribbles Completed', 'Touches (Att Pen)', 'Progressive Passes Rec', 'Pressures', 'Tackles', 'Interceptions', 'Blocks',
'Clearances', 'Aerials Won']

//generic fetch function for all api calls
 async function fetchData(path, query){
  const response = await fetch('https://h4etkvme39.execute-api.ap-southeast-2.amazonaws.com' + path + '?' + query.key + '=' + query.value)
  const responseJson = await response.json()
  return responseJson
}



function UseTeamList({selectedLeague, setSelectedTeam}){

  const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedLeague, () => fetchData('/get-teams', {"key":"league","value":selectedLeague}), {enabled: !!selectedLeague,})

  // if (isIdle) 
  //   return <div>Idle</div>
  if (isLoading)
    return <div>"Loading..."</div>
  if(isError) 
    return <div>"An error has occurred: " + {error.Error}</div>
    
  return(
    <div className="selectTeam">
      <select onChange={(e)=>setSelectedTeam(e.target.value || '')}>
          {data.map(t=>(
            <option key={t.url} value={t.url}>{t.name}</option>
          ))}
      </select>
    </div>
  )
}

const getEncodedUrlPath = (url) => !!url? encodeURIComponent((new URL(url).pathname)): ''

function UsePlayerList({selectedTeam, setSelectedPlayer}){
  const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedTeam,()=> fetchData('/get-players', {"key":"path","value":getEncodedUrlPath(selectedTeam)}),{enabled: !!selectedTeam,})
  if (isIdle) {
    return <></>}
  if (isLoading)
    return <div>"Loading..."</div>
  if(isError) 
    return <div>"An error has occurred: " + {error.Error}</div>
  return(
    <div className="selectPlayer">
      <select onChange={(e)=>setSelectedPlayer(e.target.value)}>
        {data.map(p=>(
          <option key={p.url} value={p.url}>{p.name}</option>))}
      </select>
    </div>
  )
}

function UseStats({selectedPlayer, setStats, setPos, pos, setStatType, statType, selectedStats, handleSelectStat}){
const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedPlayer, () =>fetchData('/get-player-data', {"key":"path","value":getEncodedUrlPath(selectedPlayer)}),{ enabled: !!selectedPlayer})

  if (isIdle) 
    return <></>
  if (isLoading)
    return <span>"Loading..."</span>
  if(isError) 
    return <span>"An error has occurred: " + {error.Error}</span>
  
  setStats(data || [])
  // setPos(data[0].position)
  return(
    <div className="positionStats">      
      <div className="choosePosition">
        {data.map( s => s.position).map(p=>(   
          <>    
            <label id={`${p} label`} htmlFor={p}>{p}</label>
            <input type="radio" name="positionGroup" className="positionBtn" id={p} value={p} onClick={e=>setPos(e.target.value)}/>
          </>
          ))}
      </div>
      <br/>
      {pos&& 
      <>
      <div className="chooseStatsType">
        {data.find(dat=>dat.position===pos).data.map(d=>(    
          <>
          <label id={`${d.type} label`} htmlFor={d.type}>{d.type}</label>
          <input type='radio' name="statsTypeGroup" id={d.type} className= {`statsTypeBtn ${d.type===statType ? "selected": ""}`} value={d.type} onClick={e=>setStatType(e.target.value)}/>
          </>
          ))}
      </div>
      <br/>
      <div className="selectStats">
        {data.find(dat=>dat.position===pos).data.find(d =>(d.type === statType)).stats.map(st =>(    
          <>
          <button id={st.metric} className= {`stats ${selectedStats.includes(st.metric) ? "selected": ""}`} value={st.metric} onClick={(event) => handleSelectStat(st, event)}>{st.metric}</button> 
          </>
          ))}
      </div>
      </>}
    </div>
  )
}


export default function App() {
  
  const [selectedLeague, setSelectedLeague] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const[stats, setStats] = useState([])
  const[selectedStats, setSelectedStats] = useState([])
  const [pos, setPos] = useState('')
  const [statType, setStatType] = useState('Standard Stats')
  const[color, setColor] = useState('Red')
  const [radarStats, setRadarStats] = useState([])

  const handleSelectStat = (stat, event) =>{
    const value = event.target.value
    let selected = [... selectedStats]
    let rStats = [... radarStats]
    if (selected.includes(value)){
      selected = selected.filter(item => item !== value)
      rStats = rStats.filter(item=> item.metric !== value)
    }
    else{
      selected.push(value)
      rStats.push(stat)
    }
    setSelectedStats(selected || selectedStats)
    setRadarStats(rStats || radarStats)
  }

  const selectColor = (event) => {
    setColor(event.target.value || '')
  }


  useEffect(() => {
    setSelectedTeam('')
  }, [selectedLeague])

  useEffect(() => {
    setSelectedPlayer('')
  }, [selectedTeam])

  useEffect(() => {
    setStats([])
    setSelectedStats([])
    setPos('')
    setStatType('Standard Stats')
    setRadarStats([])
  }, [selectedPlayer])

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1 className="app-header">
          Radar Generator
        </h1>
          <div className="container">
              <div className="choose">
                <div className = "options">
                  <label className="color-label">
                    Color
                  </label>
                  <select className="color-select" onChange={selectColor}>
                    {colorList.map(c =>(  
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className= "select">
                  <div className="selectLeague">
                      <select onChange= {(e)=>setSelectedLeague(e.target.value)}>
                          {leagueList.map(l=>(
                        <option key={l} value={l}>{l}</option>))}
                      </select>
                  </div>
                  {!!selectedLeague && <UseTeamList setSelectedTeam={setSelectedTeam} selectedLeague={selectedLeague}></UseTeamList>}
                  <UsePlayerList selectedTeam={selectedTeam} setSelectedPlayer={setSelectedPlayer}></UsePlayerList>
                  <UseStats selectedPlayer={selectedPlayer} setPos={setPos} setStats={setStats} pos={pos} setStatType={setStatType} statType={statType} selectedStats={selectedStats} handleSelectStat={handleSelectStat}></UseStats>
                </div>
            <div className="radar">
              <Radar data={radarStats} color={color}/>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}