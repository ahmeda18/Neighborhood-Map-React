import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import { load_google_maps, load_places } from './utils'

class App extends Component {

  //setup state
  state = {
    query: ''
  }

  constructor(props) {
    super(props);
    }
  
  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let placesPromise = load_places();

    Promise.all([
      googleMapsPromise,
      placesPromise 
    ])
    .then(values => {
      
      //use component property instead storing in state for accessability 
      let google = values[0];
      this.venues = values[1].response.venues;
      this.google = values
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        scrollwheel: true,
        center: { lat: this.venues[0].location.lat, lng: this.venues[0].location.lng }
      });

      this.venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name:venue.name,
          animation: google.maps.Animation.DROP
        });
        this.markers.push(marker);

        //Add event listener click for each marker
        marker.addListener('click', () => {
          if (marker.getAnimation() !== null) { marker.setAnimation(null); }
				  else { marker.setAnimation(google.maps.Animation.BOUNCE); }
				  setTimeout(() => { marker.setAnimation(null) }, 1500);
        });
        
        google.maps.event.addListener(marker, 'click', () => {
  			   this.infowindow.setContent(marker.name);
				  //  this.map.setZoom(13);
				   this.map.setCenter(marker.position);
				   this.infowindow.open(this.map, marker);
				   this.map.panBy(0, -125);
			  });
        
      });

      this.setState({ filteredVenues: this.venues})
    })
  }

    //Link marker and list on sidebar 
    listeItemClick = (venue) => {
      let marker = this.markers.filter(m => m.id === venue.id)[0];
      this.infowindow.setContent(marker.name);
      this.map.setCenter(marker.position);
      this.infowindow.open(this.map, marker);
      this.map.panBy(0, -125);
    }

  filterVenues = (query) => {

    //check query if inside veneue name
    let f = this.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.markers.forEach(marker => {
      //Make a ternery (conditional to toggle if true)
      marker.name.toLowerCase().includes(query.toLowerCase()) == true ?
      marker.setVisible(true) :
      marker.setVisible(false);

    });
    this.setState({ filteredVenues: f, query });
  }

render() {
  return (<div className="App">
  <section className="content">
  <Sidebar 
   filterVenues={this.filterVenues}
   filteredVenues={this.state.filteredVenues} 
   listeItemClick={this.listeItemClick}/>
   
  </section>
  <Map></Map>
  </div>);
}
}

export default App;
