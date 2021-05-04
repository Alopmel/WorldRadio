import React, {useState, useEffect} from 'react';
import Navbar from './components/Navbar/Navbar'
import './App.css';
import Map from './components/map/Map'; 
//import MenuRadio from './components/menuRadio/MenuRadio'
import Player from './components/player/Player'
import AboutUs from './components/aboutUs/AboutUs'
import Favorites from './components/favorites/Favorites'
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {useLocalStorage} from './components/favorites/useLocalStorage';
import MenuRadio from './components/menuRadio/MenuRadio'
import { history } from './_helpers';
import { alertActions } from './_actions';
import { PrivateRoute } from './_components';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';



function App() {
  
  let [countryRadio, setCountryRadio] = useState('')
  let [country, setCountry] = useState('')
  let [valueRadio, setValueRadio] = useState("");
  let [apiloaded, setApiloaded] = useState("")
  let [stations, setStations] = useState(false);
  let [randomRadio, setRandomRadio] = useState("http://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3")
  let [currentCountryRadioIndex, setCurrentCountryRadioIndex] = useState('')
  let [bottomPopUp,setBottomPopUp] = useState(false)
  let [isPlaying, setIsPlaying] = useState(true);
  let [favorites, setFavorites] = useState([]);
  let [showInfo, setShowInfo] = useState(false)


  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);

  
    const getData = (countryCode) => {
      fetch('https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/' + countryCode)
      .then(response => response.json())
      .then(data => {
        setCountryRadio(data.filter((country) => country.codec === "MP3").sort
      ((a,b) => b.votes - a.votes ).slice(0,10))
        setApiloaded(true)     
      }) 
    }

  const getCountryCode = (selectedCountry) => {
    setCountry(selectedCountry)
    getData(selectedCountry)
  }

  const getRadio = (selectedRadio, index) => {
    setValueRadio(selectedRadio)
    console.log(index)
    setCurrentCountryRadioIndex(index)
    setShowInfo(true)    
  }
  
  const getRadioFavorite = (favoriteRadio) => {
    setValueRadio(favoriteRadio)
    console.log(favoriteRadio)
    setIsPlaying(true)
    
  }
  
  const getNewRandomRadio = () => {
  
    
    setValueRadio(randomRadio === undefined
      ? "http://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3"
      : randomRadio);
    setRandomRadio(stations[Math.floor(Math.random() * stations.length)]);
    setIsPlaying(true)
    setShowInfo(false)
    
  }

  const playNextRadio = () => {
    
   
    if (currentCountryRadioIndex === 9 ) {
      setCurrentCountryRadioIndex(0);
      setValueRadio(countryRadio[0].url)
    } else {
      console.log(countryRadio[currentCountryRadioIndex + 1].url)
     
     setValueRadio(countryRadio[currentCountryRadioIndex + 1].url);
     setCurrentCountryRadioIndex(currentCountryRadioIndex + 1)
    }
     
   }

   const playPreviousRadio = () => {
    
   
    if (currentCountryRadioIndex === 9 ) {
      setCurrentCountryRadioIndex(0);
      setValueRadio(countryRadio[0].url)
    } else {
      console.log(countryRadio[currentCountryRadioIndex - 1].url)
     
     setValueRadio(countryRadio[currentCountryRadioIndex - 1].url);
     setCurrentCountryRadioIndex(currentCountryRadioIndex - 1)
    }
     
   }

   const getDataRandom = () => {
     
    fetch("https://de1.api.radio-browser.info/json/stations")
      .then((response) => response.json())
      .then(data => data.filter(radio => (radio.codec === "MP3" || radio.codec === "OGG"))) //aqui el filter
      .then((data) => {
        setStations(data)
      }
      )};


      useEffect (() => {
        getDataRandom()
        
      }, []);
  
      const handleFavorites = (radiosFavoritesInfo) => {
        setFavorites([...favorites, radiosFavoritesInfo]);
       };
  
  return ( 
    
    <div className="App">
      <Router history={history}>
      <Navbar/>
      
      <Switch>      
      <Route exact path="/">

      <div className="container-menu-map">
      <Map 
            getCountryCode={getCountryCode}
            getRadio={getRadio}
            countryRadio={countryRadio}
            apiloaded={apiloaded}
            setBottomPopUp={setBottomPopUp}
            />   

                {
            apiloaded &&
          <MenuRadio
            trigger={bottomPopUp}
            setBottomPopUp={setBottomPopUp}
            getRadio={getRadio}
            countryRadio={countryRadio} 
            handleFavorites={handleFavorites}/>
          }    
        
        
        </div>         
                 
      </Route>

      <Route exact path="/aboutUs">
    
            <AboutUs  />           
                      
      </Route>

      <Route exact path="/favorites">
    
            <Favorites
             favoritesList={favorites}
             getRadioFavorite={getRadioFavorite}  />          
                      
      </Route>

      
      <Route exact path="/login">
        <LoginPage/>
      </Route>

      <Route exact path="/register">
        <RegisterPage/>
      </Route>
      <Redirect from="*" to="/" />
      </Switch> 
      <Player 
         
         countryRadio={countryRadio}
         valueRadio={valueRadio}
         getNewRandomRadio={getNewRandomRadio}
         randomRadio={randomRadio}
         playPreviousRadio={playPreviousRadio}
         playNextRadio={playNextRadio}
         isPlaying={isPlaying}
         setIsPlaying={setIsPlaying}
         getRadioFavorite={getRadioFavorite}
         showInfo={showInfo}
      />     
      </Router>
    

      
    </div>
  );
}

export default App;