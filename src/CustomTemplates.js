const custom = [
    {
        field: "",
        min:"",
        max:"" 
      }
]

const attackingMidfielder = 
[
  {
    field: "xG",
    min:"0.08",
    max:"0.37",
  },
  {
    field: "Shots",
    min:"1.0",
    max:"3.3" 
  },
  {
    field: "Touches in Box",
    min:"2.1",
    max:"8.4" 
  },
  {
    field: "Passing%",
    min:"65",
    max:"84" 
  },
  {
    field: "Box Cross%",
    min:"51",
    max:"0" 
  },
  {
    field: "Open Play xG Assisted",
    min:"0.06",
    max:"0.26" 
  },
  {
    field: "Fouls Won",
    min:"0.9",
    max:"3.1" 
  },
  {
    field: "Successful Dribbles",
    min:"0.8",
    max:"3.5" 
  },
  {
    field: "Turnovers",
    min:"4.8",
    max:"1.5" 
  },
  {
    field: "Pressure Regains",
    min:"1.8",
    max:"4.3" 
  },

  {
    field: "xG/Shot%",
    min:"0.06",
    max:"0.16" 
  }
]

const striker = 
[
  {
    field: "xG90",
    min:"0.19",
    max:"0.57"
    
  },
  {
    field: "Shots",
    min:"1.6",
    max:"3.9"
  },
  {
    field: "Touches in Box",
    min:"4.6",
    max:"12.9"
  },
  {
    field: "Shot Touch%",
    min:"6",
    max:"2"
  },
  {
    field: "xG Assisted",
    min:"0.05",
    max:"0.23"
  },
  {
    field: "Pressure Regains",
    min:"1.5",
    max:"3.7"
  },
  {
    field: "Pressures",
    min:"12",
    max:"26"
  },
  {
    field: "Aerial Wins",
    min:"0.6",
    max:"4.8"
  },
  {
    field: "Turnovers",
    min:"4.7",
    max:"1.9"
  },
  {
    field: "Successful Dribbles",
    min:"0.5",
    max:"2.2"
  },
  {
    field: "xG/Shot",
    min:"0.09",
    max:"0.21"
  },
]

const goalkeeper = [
  {
    field: "Shot Stopping %",
    min: "-8",
    max: "11"
  },
  {
    field: "Positioning Error",
    min: "5.3",
    max: "1.5"
  },
  {
    field: "Claims- CCAA%",
    min: "-3",
    max: "5"
  },
  {
    field: "Goalkeeper Aggressive Distance",
    min: "13.8",
    max: "19.5"
  },
  {
    field: "Pass into Danger %",
    min: "18",
    max: "8"
  },
  {
    field: "Positive Outcome",
    min: "0.6",
    max: "1.8"
  },
]

const midfielder = 
[
  {
    field: "Passing%",
    min:"72",
    max:"91" 
  },
  {
    field: "Deep Progressions",
    min:"3.4",
    max:"11.1" 
  },
  {
    field: "xG Assisted",
    min:"0.03",
    max:"0.23" 
  },
  {
    field: "xGBuildup",
    min:"0.27",
    max:"0.90" 
  },
  {
    field: "Successful Dribbles",
    min:"0.4",
    max:"2.0" 
  },
  {
    field: "Fouls Won",
    min:"0.6",
    max:"2.6" 
  },
  {
    field: "Turnovers",
    min:"2.5",
    max:"0.3" 
  },

  {
    field: "Pressure Regains",
    min:"2.2",
    max:"5.6" 
  },

  {
    field: "Pressures",
    min:"12",
    max:"26" 
  },
  {
    field: "PAdj Tackles",
    min:"1.0",
    max:"3.7" 
  },
  {
    field: "PAdj Interceptions",
    min:"0.4",
    max:"1.9" 
  },
]

const fullback=[
  {
    field: "PAdj Tackles",
    min:"0.9",
    max:"3.3" 
  },
  {
    field: "PAdj Interceptions",
    min:"0.3",
    max:"2.0" 
  },
  {
    field: "Pressures",
    min:"8",
    max:"17" 
  },
  {
    field: "Deep Progressions",
    min:"3.0",
    max:"8.1" 
  },
  {
    field: "Passing%",
    min:"68",
    max:"86" 
  },
  {
    field: "xGBuildup",
    min:"0.21",
    max:"0.80" 
  },
  {
    field: "Successful Dribbles",
    min:"0.2",
    max:"1.8" 
  },
  {
    field: "Turnovers",
    min:"2.3",
    max:"0.3" 
  },
  {
    field: "Aerial Wins",
    min:"0.2",
    max:"1.7" 
  },
  {
    field: "Fouls",
    min:"1.8",
    max:"0.3" 
  },
  {
    field: "Tack/Dribbled Past%",
    min:"45",
    max:"87" 
  },
]

const centerback = [
  {
    field: "Passing%",
    min:"75",
    max:"93" 
  },
  {
    field: "Pressures",
    min:"4.1",
    max:"9.6" 
  },
  {
    field: "Fouls",
    min:"1.6",
    max:"0.2" 
  },
  {
    field: "Tack/Dribbled Past%",
    min:"50",
    max:"100" 
  },
  {
    field: "PAdj Tackles",
    min:"0.6",
    max:"2.6" 
  },
  {
    field: "PAdj Interceptions",
    min:"0.4",
    max:"2.0" 
  },
  {
    field: "Aerial Wins",
    min:"0.5",
    max:"2.6" 
  },
  {
    field: "Aerial Wins%",
    min:"39",
    max:"87" 
  },
  {
    field: "Pressured Long Balls",
    min:"2.6",
    max:"6.4" 
  },
  {
    field: "Unpressured Long Balls",
    min:"4.4",
    max:"11.3" 
  },
  {
    field: "xGBuildup",
    min:"0.19",
    max:"0.76" 
  },
]

export {custom, striker, attackingMidfielder, goalkeeper, midfielder, fullback, centerback}