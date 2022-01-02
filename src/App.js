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
const fetchData = (path, query) =>
  {fetch
    ('https://h4etkvme39.execute-api.ap-southeast-2.amazonaws.com' + path + '?' + query.key + '=' + query.value)
      .then(res =>res.json())
    }


function UseTeamList({selectedLeague, setSelectedTeam}){

  const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedLeague, fetchData('/get-teams', {"key":"league","value":selectedLeague}, {enabled: !!selectedLeague,}))
  // const {isIdle, isLoading, isError, error, data, isFetching} = fetchTeamList(selectedLeague)
  if (isIdle) 
    return <></>
  if (isLoading)
    return <div>"Loading..."</div>
  if(isError) 
    return <div>"An error has occurred: " + {error.Error}</div>
  // setTeamList(data || [])
  return(
    <div className="selectTeam">
      <select onChange={(e)=>setSelectedTeam(e.target.value)}>
          {data.map(t=>(
            <option key={t} value={t}>{t}</option>
          ))}
      </select>
    </div>
  )
}

const getEncodedUrlPath = (url) => !!url? encodeURIComponent((new URL(url).pathname)): ''

function UsePlayerList({selectedTeam, setSelectedPlayer}){
  console.log('selected: '+ selectedTeam)
  console.log('team: '+ selectedTeam)
  const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedTeam, fetchData('/get-players', {"key":"path","value":getEncodedUrlPath(selectedTeam)},{enabled: !!selectedTeam,}))
  if (isIdle) 
    return <></>
  if (isLoading)
    return <div>"Loading..."</div>
  if(isError) 
    return <div>"An error has occurred: " + {error.Error}</div>
  // setPlayerList(data || [])
  return(
    //do something
    <div className="selectPlayer">
      <select onChange={(e)=>setSelectedPlayer(e.target.value)}>
        {data.map(p=>(
          <option key={p} value={p}>{p}</option>))}
      </select>
    </div>
  )
}

function UseStats({selectedPlayer, setStats, setPos}){
const {isIdle, isLoading, isError, error, data, isFetching} = useQuery(selectedPlayer, fetchData('/get-players', {"key":"path","value":getEncodedUrlPath(selectedPlayer)},{ enabled: !!selectedPlayer,}))
  if (isIdle) 
    return <></>
  if (isLoading)
    return <span>"Loading..."</span>
  if(isError) 
    return <span>"An error has occurred: " + {error.Error}</span>
  setStats(data || [])
  return(
    //do something
    <div className="positionStats">      
      <div className="choosePosition">
        {data.map( st => st.position).map(p=>(                 
            <button key={p} className="positionBtn" onclick={e=>setPos(e.target.value)}>{p}</button>
          ))}
      </div>
    </div>
  )
}


export default function App() {
  
  const [selectedLeague, setSelectedLeague] = useState('premier-league')
  const [teamList, setTeamList] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const[stats, setStats] = useState([])
  const[selectedStats, setSelectedStats] = useState(defaultTemplate)
  const [pos, setPos] = useState('')
  const[color, setColor] = useState('Red')


  // // change dependent states if team list changes
  // useEffect(() => {
  //   setPlayerList([])
  //   setStats([])
  //   setPos([])
  // }, [teamList])

  // // change dependent states if player list changes
  // useEffect(() => {
  //   setStats([])
  //   setPos([])
  // }, [playerList])

  const selectUnselectStat = (event) =>{
    const selected = [...selectedStats]
    if (selected.includes(event.target.value)){
      selected.filter(item => item !== event.target.value)
    }
    else{
      selected.push(event.target.value)
    }
    setSelectedStats(selected || selectedStats)
  }

  const selectPos = (event) => {
    setPos(event.target.value || '')
  }

  const selectColor = (event) => {
    setColor(event.target.value || '')
  }

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
                    <b>League</b>
                      <select onChange= {(e)=>{setSelectedLeague(e.target.value)}}>
                        <option value="" disabled>Select League...</option>
                          {leagueList.map(l=>(
                        <option key={l} value={l}>{l}</option>))}
                      </select>
                  </div>
                  <UseTeamList setTeamList={setTeamList} selectedLeague={selectedLeague}></UseTeamList>
                  <UsePlayerList selectedTeam={selectedTeam} setSelectedPlayer={setSelectedPlayer}></UsePlayerList>
                  <UseStats selectedPlayer={selectedPlayer} setPos={setPos} setStats={setStats}></UseStats>
                  <div className="chooseStats">
                    {stats.find(s=>(s.position===pos).data.map(d=>(            
                      <button key={d.type} className="statsTypeBtn" >{d.type}</button>)))}
                  </div>
                </div>
            <div className="radar">
              <Radar data={stats} color={color}/>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}