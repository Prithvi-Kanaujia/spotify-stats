import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from 'axios';
import itemCard from "./ItemCard";
import {BrowserRouter as Router, Route, Link  } from "react-router-dom";
// import { Router } from 'express';
const spotifyApi = new SpotifyWebApi();

const SCOPE = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played user-top-read';

const getToken = () => {
  return window.location.hash.substring(1).split('&').reduce((initial, item) => {
    let parts = item.split("=");
    initial[parts[0]] = decodeURIComponent(parts[1]);
    return initial;
  },{});
}; 

// const Home = () => {return(
  
// );
// }

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const[Selected, setSelected] = useState(false);

  const[loggedIn, setLoggedin] = useState(false);
  useEffect(()=> {
    console.log("this is what we got: " , getToken())
    const spotifyToken = getToken().access_token;
    // window.location.hash="";
    if (spotifyToken) {
      setSpotifyToken(spotifyToken);
      setLoggedin(true);
      spotifyApi.setAccessToken(spotifyToken)
      // console.log(getToken().access_token)
      spotifyApi.getMe().then((user) => {
        // console.log(user);
      })
      
    }
  });
  const getTopItems= async () => {
    const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }, 
      params: { "limit":10
      }
  
    });
    const data = await response['data'].items;
    console.log(data);
    setTopTracks(data);
    topTracks.forEach((artist) => {
      console.log(artist['name']);
    })
    // console.log(topTracks);

    }
  // getTopItems();
  
  return (
    <div className="app">
    {!loggedIn && <a href = 'http://localhost:8888'>Login to Spotify</a>}
    {loggedIn && (
      <><div>NEW PAGE: </div>
        <button class = "custom-button"> Get my top artists</button>
    <div class="custom-select">
    <select>
      <option value="0">Select Timeframe</option>
      <option value="1">4 weeks</option>
      <option value="2">6 months</option>
      <option value="3">All time</option>
    </select>
    </div>
  </>
    )}
    
    
  </div>
    
  );
    }

export default App;
