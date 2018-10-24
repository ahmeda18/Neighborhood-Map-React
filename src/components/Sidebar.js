import React, { Component } from 'react';

class Sidebar extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  render() {
    return (
    
      <div id="sidebar">
        <label>
          <p className="search-label">Search Place</p>
        {/* <input aria-label="Search place" type="text" size="25" value={this.props.query} onChange={(e) => { this.props.filterVenues(e.target.value) }}/> */}
        <input className="filter-input" type="text" role="form" aria-labelledby="filter" tabIndex="0" value={this.props.query} onChange={(e) => { this.props.filterVenues(e.target.value) }}></input>

        </label>

        <br/>
      
        <ul className="items-list">

        {
          this.props.filteredVenues && this.props.filteredVenues.length > 0 && this.props.filteredVenues.map((venue, index) => (

            <div key={index} className="venue-item" onClick={() => {this.props.listeItemClick(venue)}}>
            {venue.name}
            </div>
          ))
        }
        </ul>
      </div>
    
    );
  }
}


export default Sidebar;
