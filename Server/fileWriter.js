const express = require("express")
const fs = require('fs');
const gp = require('./gamePieces');

const dataPath = './data/scouters.json' 
const matchPath = './data/schedule/schedule.json'
const breakPath = './data/breaks/Scouting_Scheduler.csv'
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

const readJSON = (path) => {
  let data = fs.readFileSync(path)
  return data
}

const saveData = (path, data) => {
  fs.writeFileSync(path, data)
}

const parseBreaks = (color) => {
  let data = {}
  let schedule = readCSV(breakPath)
  if (color == "blue")
  {
    for (let game of schedule)
    {
      data[game.match] = [game.blue1, game.blue2, game.blue3]
    }
  }
  else if (color == "red")
  {
    for (let game of schedule)
    {
      data[game.match] = [game.red1, game.red2, game.red3]
    }
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
  const jsonData = fs.readFileSync(matchPath)
  return JSON.parse(jsonData)
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

module.exports = {addScout, addNewGame, getScoutData, saveScoreData, getScoreData, updateScore, getAllianceColor, fileExists, getMatchData, saveBreakSchedule, parseBreaks}