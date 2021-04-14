import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import './map.css';
import {RadioData} from './RadioData'
import {getData} from './apiCall';


//import {RadioData} from 'RadioData'
/*[ISO2 country code] to find countrys by code*/

 export function Map() {

 


const chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldLow;

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

 chart.maxZoomLevel = 1;

 chart.seriesContainer.draggable = false;

 chart.seriesContainer.resizable = false;

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
let polygonTemplate = polygonSeries.mapPolygons.template;

polygonTemplate.tooltipText = "{name} {id}";

let hs = polygonTemplate.states.create("hover");

hs.properties.fill = am4core.color("#F5455D");
polygonSeries.exclude = ["AQ"];
polygonTemplate.fill = am4core.color("#4040CE");

polygonTemplate.events.on('hit', function (e)  {
    let countryCode = e.target.dataItem.dataContext.id
    getData(countryCode) // mettre a jour le state
})

// Create hover state and set alternative fill color

    return (

      <div className="containerAll">
            <div className={!getData ? 'RadioItemsContainer' : 'RadioItemsHidden'} >
            <ul className='RadioList'>
                <ul className='RadioList'>
                {RadioData.map((item, index) =>{
                    return (
                        <li className='li-radios' key={index}>
                            <a className={item.cName} href={item.url}>
                                {item.icon}{item.title}
                            </a>
                        </li>
                    )})}
                    </ul>
            </ul>

        </div>
      <div id = "chartdiv" className="chartdiv">
     
      </div>
      </div>
    );
  
}