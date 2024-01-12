const express = require("express")
const fs = require('fs');
const gp = require('./gamePieces');

const dataPath = './Configs/scouters.json' 
const matchPath = './Configs/schedule.csv' //'./data/schedule/schedule.json'
const breakPath = './Configs/Scouting_Scheduler.csv'//'./data/breaks/Scouting_Scheduler.csv'
let gamePath = '';

// util functions 
const readCSV = (path) => 
{
  let data = []

  let file = fs.readFileSync(path)
  let lines = file.toString().split('\n')

  let headers = (lines[0].toString().slice(0, -1)).split(',')
  lines = lines.slice(1)

  for (const value of lines) 
  {
    let line = (value.toString().slice(0, -1)).split(',')
    let json = {}
    for (let index in headers) 
    {
      json[headers[index]] = line[index]
    }
    data.push(json)
  }

  return data
}

const readJSON = (path) => 
{
  let data = fs.readFileSync(path)
  return data
}

const saveData = (path, data) => 
{
  fs.writeFileSync(path, data)
}

const parseBreaks = () => 
{
  let data = {}
  let schedule = readCSV(breakPath)
  data[0] = null; // we are starting at element 1 for the matches. This helps since arrays start with 0
  for (let game of schedule)
  {
    data[game.match] = {
      "blue": [],
      "red": []
    }
    data[game.match].blue = [game.blue1, game.blue2, game.blue3]
    data[game.match].red = [game.red1, game.red2, game.red3]
  }
  return data
}

const getScoutData = () => 
{
  const jsonData = fs.readFileSync(dataPath)
  return JSON.parse(jsonData)    
}

const saveScoutData = (data) => 
{
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(dataPath, stringifyData)
}

const getScoreData = () => 
{
  const jsonData = fs.readFileSync(gamePath)
  return JSON.parse(jsonData)    
}

const saveScoreData = (data) => 
{
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(gamePath, stringifyData)
}

const getMatchData = () => 
{
  /*const jsonData = fs.readFileSync(matchPath)
   let data = readCSV(matchPath);
   
   return data;
*/

   let data = {}
  let breaks = readCSV(breakPath)
  data[0] = null; // we are starting at element 1 for the matches. This helps since arrays start with 0
  for (let game of breaks)
  {
    data[game.match] = {
      "blue": [],
      "red": []
    }
    data[game.match].blue = [game.blue1, game.blue2, game.blue3]
    data[game.match].red = [game.red1, game.red2, game.red3]
  }
  return data
  //return JSON.parse(jsonData)
}

const getAllianceColor = (name) => 
{
  let scoutData = getScoutData()
  if (scoutData.blue.find(item => item.name === name)) {
    return "blue"
  } else if (scoutData.red.find(item => item.name === name)) {
    return "red"
  }
  return false
}

const fileExists = (fileName) => 
{
  gamePath = './data/matches/' + fileName + '.json'
  return !!(fs.existsSync(gamePath))
}

const addNewGame = (fileName) =>
{
  gamePath = './data/matches/' + fileName + '.json';
  let newGame = new gp.Match()
  fs.writeFileSync(gamePath, JSON.stringify(newGame))
  console.log('File is created successfully.')
}

const updateScore = (scoreboard) =>
{
  let existingScore = getScoreData();
  existingScore.scoreboard = scoreboard;
  saveScoreData(existingScore);
}

const addScout = (name, scout) =>
{
  var existingScouts = getScoutData()
  existingScouts[name] = scout;
  console.log(existingScouts);
  saveScoutData(existingScouts);
}

const saveBreakSchedule = (name, schedule) => 
{
  gamePath = './data/breaks/' + name + '_break_schedule.json';
  fs.writeFileSync(gamePath, JSON.stringify(schedule))
}

module.exports = {addScout, addNewGame, getScoutData, saveScoreData, getScoreData, updateScore, getAllianceColor, fileExists, getMatchData, saveBreakSchedule, parseBreaks, readCSV}