import React, {useState, useEffect} from 'react';
import './App.css';
import Radar from './Radar';
import { Alert, Spinner, Dropdown, Row, Col, Tab, Nav, Button, Card, Table} from 'react-bootstrap';

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

const leagueList = ['Premier-League','Serie-A', 'La-Liga', 'Ligue-Un', 'Bundesliga', 'Major-League-Soccer', 'Womens-Super-League']

const defaultTemplate = ['Non-Penalty Goals', 'npxG', 'Shots Total', 'Assists', 'xA', 'npxG+xA', 'Shot-Creating Actions', 'Passes Attempted', 'Pass Completion %',
'Progressive Passes', 'Progressive Carries', 'Dribbles Completed', 'Touches (Att Pen)', 'Progressive Passes Rec', 'Pressures', 'Tackles', 'Interceptions', 'Blocks',
'Clearances', 'Aerials Won']

//generic fetch function for all api calls
 async function fetchData(path, query){
  const response = await fetch('https://h4etkvme39.execute-api.ap-southeast-2.amazonaws.com' + path + '?' + query.key + '=' + query.value)
  const responseJson = await response.json()
  if (!response.ok) throw responseJson
  return responseJson

}



function UseTeamList({selectedLeague, setSelectedTeam, selectedTeam}){

  const { isLoading, isError, error, data} = useQuery(selectedLeague, () => fetchData('/get-teams', {"key":"league","value":selectedLeague.toLowerCase()}), {enabled: !!selectedLeague,})
  console.log({isLoading, isError, error, data})
  if (isLoading)
  return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>)
  if(isError) {
    return (
      <Alert variant='danger'>
        An error has occurred: {error.message}
      </Alert>
    )
  }
  return(
    <div className='d-inline'>
      <div style={{display: 'inline-block', marginLeft: '10px'}}>
      <Dropdown onSelect={e=>{
        const data = e.split(',')
        setSelectedTeam({
          name: data[0],
          url: data[1]
        })
        }}>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
          {selectedTeam.name ? selectedTeam.name : "Select Team"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
        <Dropdown.ItemText>Select Team</Dropdown.ItemText>
        {data.map(t => (  
          <Dropdown.Item key={t.url} active={t.url === selectedTeam.url} eventKey={[t.name, t.url]}>{t.name}</Dropdown.Item>
        ))} 
        </Dropdown.Menu>
      </Dropdown>
      </div>
    </div>
  )
}

const getEncodedUrlPath = (url) => !!url? encodeURIComponent((new URL(url).pathname)): ''

function UsePlayerList({selectedTeam, selectedPlayer ,setSelectedPlayer}){
  const {isIdle, isLoading, isError, error, data} = useQuery(selectedTeam.url,()=> fetchData('/get-players', {"key":"path","value":getEncodedUrlPath(selectedTeam.url)}),{enabled: !!selectedTeam.url,})
  if (isIdle) {
    return <></>}
  console.log({ isLoading, isError, error, data})
  if (isLoading)
  return (
    <Spinner animation="border" role="status" className='ml-4'>
      <span className="sr-only">Loading...</span>
    </Spinner>)
  if(isError) 
  return (
    <Alert variant='danger'>
      An error has occurred: {error.message}
    </Alert>)
  return(
    
    <div className='d-inline ml-4'>
      <div style={{display: 'inline-block', marginLeft: '10px'}}>
      <Dropdown onSelect={e=>{
        const data = e.split(',')
        setSelectedPlayer({
          name: data[0],
          url: data[1]
        })
        }}>
        <Dropdown.Toggle variant="danger" id="dropdown-basic">
          {selectedPlayer.name ? selectedPlayer.name : "Select Player"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
        <Dropdown.ItemText>Select Player</Dropdown.ItemText>
        {data.map(p => (  
          <Dropdown.Item key={p.url} active={p.url === selectedPlayer.url} eventKey={[p.name, p.url]}>{p.name}</Dropdown.Item>
        ))} 
        </Dropdown.Menu>
      </Dropdown>
      </div>
    </div>
  )
}

function UseStats({selectedPlayer, setStats, setPos, pos, setStatType, statType, selectedStats, handleSelectStat}){
const { isIdle, isLoading, isError, error, data} = useQuery(selectedPlayer.url, () =>fetchData('/get-player-data', {"key":"path","value":getEncodedUrlPath(selectedPlayer.url)}),{ enabled: !!selectedPlayer.url})
console.log({isLoading, isError, error, data})
  if (isIdle) 
    return <></>
  if (isLoading)
    return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>)
  if(isError) 
    return (
      <Alert variant='danger'>
        An error has occurred: {error.message}
      </Alert>)
  
  setStats(data || [])
  return (
    <div>
      {!!data && data.map( s => s.position).map(p=>(     
        <Button key={p} className="m-2" onClick={()=>setPos(p)} variant={pos !== "" && pos === p ? 'danger' : 'outline-danger'}>{p}</Button>
      ))}

      {
        !!pos &&
        <Card border='danger'>
          <Card.Body>
            <Card.Title>Select Stat Group</Card.Title>
            {!!data && !!pos && data.find(dat=>dat.position===pos).data.map(d=>(    
              <Button key={d.type} className="m-2" onClick={()=>setStatType(d.type)} variant={statType !== "" && statType === d.type ? 'success' : 'outline-success'}>{d.type}</Button>
            ))}
            <Card.Title>Select Stats</Card.Title>
            {!!data && !!pos && !!statType && data.find(dat=>dat.position===pos).data.find(d =>(d.type === statType)).stats.map(st =>(    
              <Button key={st.metric} className="m-2" onClick={()=>handleSelectStat(st, st.metric)} variant={selectedStats !== "" && selectedStats.includes(st.metric) ? 'info' : 'outline-info'}>{st.metric}</Button>
            ))}
          </Card.Body>
        </Card>
      }
    </div> 
  )
}


export default function App() {
  
  const [selectedLeague, setSelectedLeague] = useState('')
  const [selectedTeam, setSelectedTeam] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const[stats, setStats] = useState([])
  const[selectedStats, setSelectedStats] = useState([])
  const [pos, setPos] = useState('')
  const [statType, setStatType] = useState('Standard Stats')
  const[color, setColor] = useState('Red')
  const [radarStats, setRadarStats] = useState([])

  const handleSelectStat = (stat, event) =>{
    const value = event
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

  const selectColor = (value) => {
    setColor(value || '')
  }


  useEffect(() => {
    setSelectedTeam('')
  }, [selectedLeague])

  useEffect(() => {
    setSelectedPlayer('')
  }, [selectedTeam])

  useEffect(() => {
    setStats([])
    setPos('')
  }, [selectedPlayer])

  useEffect(() => {
    setSelectedStats([])
    setStatType('Standard Stats')
    setRadarStats([])
  }, [pos])
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
      <div className='app-header'>
        <h1 class="title">Radar<span>Generator</span></h1>
      </div>
        <div style={{margin: '10px 20px'}}>
          <Row>
            <Col className="col-5">
              <div className = "options'">
              <Card border="light">
              <Card.Header >Select Player</Card.Header>
                <div className=' d-inline m-2'>
                  <div style={{display: 'inline-block', marginLeft: '10px', marginTop: '5px'}}>
                  <Dropdown onSelect={(e)=>setSelectedLeague(e)}>
                    <Dropdown.Toggle variant="danger" id="dropdown-basic">
                      {selectedLeague ? selectedLeague : "Select league"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.ItemText>Select league</Dropdown.ItemText>
                    {leagueList.map(c => (  
                      <Dropdown.Item key={c} active={c === selectedLeague} eventKey={c}>{c}</Dropdown.Item>
                    ))} 
                    </Dropdown.Menu>
                  </Dropdown>
                  </div>
                </div>

                <div className='m-2'>
                  {!!selectedLeague && <UseTeamList selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} selectedLeague={selectedLeague}></UseTeamList>}
                  <UsePlayerList selectedTeam={selectedTeam} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer}></UsePlayerList>
                </div>

                <div className='m-2'>
                  <UseStats selectedPlayer={selectedPlayer} setPos={setPos} setStats={setStats} pos={pos} setStatType={setStatType} statType={statType} selectedStats={selectedStats} handleSelectStat={handleSelectStat}></UseStats>
                </div>
              
              </Card>
              </div>
            </Col>
            <Col>
            {
              radarStats.length > 0 && (
                <div style={{margin:'0 auto'}} className="radar">
                   <div className='radar-header'>
                   <div className="color-dropdown">
                      <Dropdown onSelect={selectColor}>
                        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                          {color}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.ItemText>Select Color</Dropdown.ItemText>
                        {colorList.map(c => (  
                          <Dropdown.Item key={c} active={c === color} eventKey={c}>{c}</Dropdown.Item>
                        ))} 
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                      <div>
                        <span style={{color:'black', fontSize:'2em', fontWeight:900}}>{selectedPlayer.name}</span>
                        <span style={{color:color, fontSize:'2em', fontWeight:900}}> - {selectedTeam.name}</span>
                      </div>
                  </div>
                    <Radar data={radarStats} color={color}/>
                    <Table responsive striped bordered hover variant="dark">
                      <thead>
                        <tr>
                          {
                            radarStats.map(res => (
                              <th>{res.metric}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {
                            radarStats.map(res => (
                              <td>{res.per90}</td>
                            ))
                          }
                        </tr>
                      </tbody>
                    </Table>
                </div>
              )
            }
            </Col>
          </Row>
        </div>
      </div>
    </QueryClientProvider>
  );
}