import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { DebounceInput } from 'react-debounce-input';
import './App.css';
import { Style } from './mapstyle.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers: [
        {lat: 32.072532, lng: 34.779597, name: 'Habima Square', type: 'square',
        description: `This might be the center of your universe, if you're a true resident of Tel Aviv!`},
        {lat: 32.071323, lng: 34.783824, name: 'Alef High School', type: 'school',
        description: `This was my high school, I rate it 10/10!`},
        {lat: 32.077987, lng: 34.784167, name: 'Dubnov Garden', type: 'garden',
        description: `It's a cute garden. I used to come here a lot when I was little.`},
        {lat: 32.075160, lng: 34.774908, name: 'Dizengoff Center', type: 'mall',
        description: `This has to be the best mall in Tel Aviv. Seriously, no other mall can compare to it in Israel.
        Locals will tell you that the "center" feels very homie unlike other malls in Tel Aviv such as 'Azrieli' or 'Gindi TLV',
        and that makes it a very special cookie indeed.`},
        {lat: 32.078342, lng: 34.778429, name: 'Masarik Square', type: 'square',
        description: `It's a cute spot to chill and think about where you're going with
        your life. The atmosphere can be spiritual and eerie at times.`},
        {lat: 32.080384, lng: 34.780709, name: 'Rabin Square', type: 'square',
        description: `Rabin Square is considered quite central in Tel Aviv,
        the Tel Aviv Municipality is connected to it, Hemda (school) is nearby and so are some iconic food joints.`},
        {lat: 32.084092, lng: 34.780367, name: "Hemda", type: 'school',
        description: `With great money comes great education. Come here to study
        sciences. The place holds science conventions for everyone and teaches high schoolers arriving from schools from all
        around town three main curriculums Physics, Chemistry and Computer Sciences.`}
      ],
      extraMarkers: [],
      markerClicked: false,
      extraMarkerClicked: false,
      shownMarkers: false,
      hamburgerOpen: false
  }
  this.changeMarkerClicked = this.changeMarkerClicked.bind(this);
  this.changeShownMarkers = this.changeShownMarkers.bind(this);
  this.filterMarkers = this.filterMarkers.bind(this);
  this.updateExtraMarkers = this.updateExtraMarkers.bind(this);
}

  updateExtraMarkers(extraMarkers) {
    this.setState({extraMarkers: extraMarkers})
  }

  changeMarkerClicked(markerNum, isExtra) {
    if (!markerNum && markerNum !== 0 && isExtra === true) {markerNum = false}
    else if (!markerNum && markerNum !== 0 ) {markerNum = false}
    //This means calling this function without a parameter
    // or w/ "false" will set it to false
    if (isExtra) {
      return this.setState({extraMarkerClicked: markerNum})
    }
    isExtra = this.state.extraMarkerClicked
    this.setState({markerClicked: markerNum,
    extraMarkerClicked: false});
  }
  changeShownMarkers(markers) {
    this.setState({shownMarkers: markers});
  }
  filterMarkers(filterInput) {
    let markers = this.state.Markers;
    if (filterInput !== '') {
      const regex = new RegExp(filterInput, 'i')
      markers = markers.filter(marker => regex.test(marker.name) )
    }
    this.changeShownMarkers(markers);
  }

  render() {
    return (
      <div className="main-div">
        <div className="logo-and-sidelist">
        <h1 className="logo"> TLV <span className="logo" style={{color: 'white'}}> Markers </span> </h1>
      <SideList
        markers={this.state.shownMarkers || this.state.Markers}
        originalMarkers={this.state.Markers}
        changeMarkerClicked={this.changeMarkerClicked}
        filterMarkers={this.filterMarkers}
        markerClicked={this.state.markerClicked}
        updateExtraMarkers={this.updateExtraMarkers}
      />
        </div>
      <GoogleMapSection
        markerClicked={this.state.markerClicked}
        originalMarkers={this.state.Markers}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAQb9xq2iRT6lG8DW3cGP1K43kastziMA"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div className="contain-map" />}
        mapElement={<div style={{ height: `100%` }} />}
        markers={this.state.shownMarkers || this.state.Markers}
        includeMarkerInBounds={this.includeMarkerInBounds}
        changeMarkerClicked={this.changeMarkerClicked}
        extraMarkers={this.state.extraMarkers}
        extraMarkerClicked={this.state.extraMarkerClicked}
      />
      </div>
    );
  }
}

class SideList extends Component {
  state = {
    filterInput: '',
    hamburgerOpen: false,
    windowWidth: window.innerWidth
  }

  setFilterInput = (event) => {
    let filterInput = event.target.value;
    this.setState({filterInput: filterInput});
    this.props.filterMarkers(filterInput);
  }

  updateHamburger = () => {
      return this.setState(prevState => { return {hamburgerOpen: !prevState.hamburgerOpen} })
  }

  handleResize = () => this.setState({
   windowWidth: window.innerWidth
 });

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  handleClick = (markerNum) => {
    this.props.changeMarkerClicked(markerNum);
  }

  handleRevertClick = (e) => {
    e.preventDefault();
    this.props.changeMarkerClicked(false, true); // remove extra marker clicked
    this.props.changeMarkerClicked(false); // remove marker clicked
    this.props.updateExtraMarkers(false) // remove extra markers
  }

  render() {
    return <div>
    <button
      onClick={this.updateHamburger}
      className={this.state.hamburgerOpen ? 'entypo-book-open hamburger' : 'entypo-book hamburger'}>
    </button>
    {(this.state.hamburgerOpen || this.state.windowWidth >= 990) && <div className="side-list">
      <div className="menu"><DebounceInput
        onChange={this.setFilterInput}
        value={this.state.setFilterInput}
        debounceTimeout={200}
        placeholder='Type to filter'
      />
      <ul>
      {this.props.markers.map((marker, index) => <li
        className={'marker-list-item' + (() => {if (index === this.props.markerClicked) return ' selected'
        else return ''})()}
        key={'marker-onlist-'+index}
        onClick={() => this.props.changeMarkerClicked(index)}>
          <button className="marker-on-list"
            onClick={() => this.handleClick(index)}>{marker.name}</button>
      </li>)}
    </ul></div>
    {this.props.markerClicked !== false && <InfoScreen
          markers={this.props.originalMarkers}
          markerClicked={this.props.markerClicked}
          handleRevertClick={this.handleRevertClick}
          updateExtraMarkers={this.props.updateExtraMarkers}
          changeMarkerClicked={this.props.changeMarkerClicked}
    />}
</div>}
</div>
  }
}

function UndoMarkerClickButton(props) {
  if (props.markerClicked !== false) return <button
    className='close'
    onClick={props.handleRevertClick}
    aria-label="undo marker selection">
      <span className='iconicfill-x' style={{color: 'rgb(59, 49, 49)'}}></span>
    </button>
  else return null
}

class InfoScreen extends Component {
  render() {
    const marker = this.props.markers[this.props.markerClicked];
    return <div className="info-screen">
      <div className="flex">
    <UndoMarkerClickButton
      handleRevertClick={this.props.handleRevertClick}
    />
    <h2>{marker.name}</h2>
    </div>
    <p className="info-describe">{marker['description']}</p>
    <FourSquareInfo
      updateExtraMarkers={this.props.updateExtraMarkers}
      marker={marker}
      changeMarkerClicked={this.props.changeMarkerClicked}
    />
  </div>
  }
}

class FourSquareInfo extends Component {
  state = {
    cafes: []
  }
  fetchUpdate() {
    const marker = this.props.marker;
    const v = '20180323'; // v is for current forsquare api version
    const lL = `${marker.lat},${marker.lng}`; //lat lng
    const clientId = 'BCSJS3NQSKYXTSRBXXGO52YT3GXY1MPXZ2Q03QCAQEH42XKX';
    const clientSecret = '3JGNHARRD3000WJBSMMEYI34MMWCIWNTERIRG1FRLOR2W3OD';
    const categoryId = '4bf58dd8d48988d16d941735';
    // this is the categoryId for cafes, there are others at foursquare
    return fetch(`https://api.foursquare.com/v2/venues/search?ll=${lL}
      &categoryId=${categoryId}
      &client_id=${clientId}
      &client_secret=${clientSecret}
      &radius=250
      &v=${v}&limit=10`,
      {method: "GET",}
    ).then(response => response.json()).then(json =>
      {
      this.setState({
      cafes: json.response.venues,
      finishedFetch: true
    });
      let extraMarkers = json.response.venues;
      for (const extraMarker of extraMarkers) {
        extraMarker.type = 'cafe';
      }
      this.props.updateExtraMarkers(extraMarkers);
    })
    .catch(error => this.setState({
      finishedFetch: 'failed'
    }))
  }
  componentDidMount() {
    this.fetchUpdate();
  }
  componentDidUpdate(prevProps) {
    if (this.props.marker !== prevProps.marker) {
      this.setState({cafes: []}, () => this.fetchUpdate())
    }
  }

  render() {
    return <div>
      { !this.state.finishedFetch && <p>Hooking up to Foursquare. Please wait!</p> ||
    ( this.state.finishedFetch === 'failed' ) && <p>Failed to connect to Foursquare. Perhaps you're offline!</p> ||
    this.state.finishedFetch && <div>
          <h3>Cafes around (thanks to Foursquare)</h3>
      <ul className="fs-listings">
      {this.state.cafes.map(
        (cafe, index) => {
        return <li className='fs-listing' key={'l-' + cafe.id}>
          <FSListing cafe={cafe}
            handleClick={() => {
              this.props.changeMarkerClicked(index, true)}}
          />
        </li>
      })}
    </ul></div> }</div>
  }
}

class FSListing extends Component {
  state = {
    moreInfo: false
  }

  render() {
    const cafe = this.props.cafe
    if (!this.state.moreInfo) return <div className="fs-listing">
      <h4 onClick={this.props.handleClick}
        style={{marginBottom: 0}}>
        {cafe.name}</h4>
    <span>{cafe.location.address}</span></div>
  }
}

class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.prevMarkers = this.props.markers;
    this.usingFirstMarkers = true;
    //A boolean I pushed in to prevent setting bounds of map on icon clicks,
    //so it doesn't act the same as location filtering for bounding,
  }

  componentDidUpdate(prevProps) {
    if (this.prevMarkers !== this.props.markers) {
      this.prevMarkers = prevProps.markers;
      this.usingFirstMarkers = false;
    }
  }

  includeMarkersInBounds() {
    const centerOfTown = {lat:32.084948, lng:34.781330};
    //Credits for distance function: Salvador Dali on Stack Overflow
    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    let areCurrentMarkersTooCloseToCenter = this.props.markers.some(marker => {
      return distance(centerOfTown.lat, centerOfTown.lng, marker.lat, marker.lng) >= 0.14
    })
    if(!areCurrentMarkersTooCloseToCenter) {return}
    //For example, rabin square is too close to center, without this functionality,
    //showing only rabin square would zoom too far in into the map because the bounds
    //become too small
    let bounds = new window.google.maps.LatLngBounds();
      bounds.extend(centerOfTown);
      this.props.markers.map(marker => {
        bounds.extend({lat: marker.lat, lng: marker.lng})
      })
      this.checkIfMapRefExists().then(
        res => {
          this._mapRef.fitBounds(bounds);
        }
      )
    }

  checkIfMapRefExists() {
    let here = this;
    return new Promise(function(resolve, reject) {
      (function waitForMapRef() {
        if (here._mapRef) {return resolve()}
        return setTimeout(waitForMapRef, 30);
      })()
      })
  }

  getMarkerStyle(markerType) {
    let style = {};
    switch (markerType) {
      case 'square': style.color = '#2a0041';
      style.iconName = 'iconicfill-stop'
      style.size = '21px'; break;
      case 'garden': style.color = 'rgb(0, 50, 11)';
      style.iconName = 'maki-tree-2'
      style.size = '30px'; break;
      case 'mall': style.color = 'rgb(200, 0, 124)';
      style.iconName = 'maki-shop',
      style.size = '22px'; break;
      case 'cafe': style.color = 'rgb(92, 41, 34)';
      style.iconName = 'maki-cafe',
      style.size = '19px'; break;
      case 'school': style.color = 'rgb(133, 73, 0)';
      style.iconName = 'maki-college';
      style.size = '23px'; break;
      default: style.color = '#ea4739';
      style.size = '47px';
      style.iconName = 'iconicfill-map-pin-fill';
    }
    return style
  }

  saveMapRef = (ref) => {
      if (!ref || this._mapRef) return;
      this._mapRef = ref;
    }


  render() {
    let markerClickedObj = false;
    const defaultCenterLatLng = { lat: 32.080359, lng: 34.780670 };
    let markerClickedLatLng = defaultCenterLatLng;
    let zoom = 15;
    if (this.props.markerClicked !== false) {
      zoom = 17;
      if (this.props.extraMarkerClicked) {
        markerClickedObj = this.props.extraMarkers[this.props.extraMarkerClicked];
        markerClickedLatLng = {lat: markerClickedObj.location.lat, lng: markerClickedObj.location.lng};
      } else {
        markerClickedObj = this.props.originalMarkers[this.props.markerClicked];
        markerClickedLatLng = {lat: markerClickedObj.lat, lng: markerClickedObj.lng};
      }
    }
    return (
      <GoogleMap
        defaultOptions={{styles: Style, streetViewControl: false,
        mapTypeControl: false}}
        markerClicked={this.props.marker}
        zoom={zoom}
        center={markerClickedLatLng}
        ref={this.saveMapRef}
        >
          {
            this.props.markers.map((marker, index, markers) => {
              const position = {lat: marker.lat, lng: marker.lng}
              const markerStyle = this.getMarkerStyle(marker.type);
              let opacity = 1;
              if (this.props.markerClicked !== false) {
                if (index !== this.props.markerClicked) {opacity = 0.5} else {
                  //Can add style to selected marker here, but don't want to,
                  //I felt it's enough to have the rest of the markers 0.5
                }
              }
              if (marker === markers[markers.length-1]) {
                if (this.props.markers !== this.prevMarkers ||
                this.usingFirstMarkers === true) {
                this.includeMarkersInBounds();
                this.usingFirstMarkers = false}
                //If we've rendered the final marker, set the bounds
              }
              return <MarkerWithLabel
                opacity={0}
                key={'marker-onmap-'+index}
                labelAnchor={new window.google.maps.Point(6.5, 36)}
                onClick={() => this.props.changeMarkerClicked(index)}
                position={position}
                ref={this.includeMarkerInBounds}
              >
                <span className={markerStyle.iconName} style={
                  {opacity: opacity,
                  color: markerStyle.color,
                  fontSize: markerStyle.size}
                }></span>
              </MarkerWithLabel>
            }
          )}
          {
          this.props.extraMarkers && this.props.extraMarkers.map((marker, index) => {
            let opacity = 1;
            if (this.props.extraMarkerClicked !== false) {
              if (index !== this.props.extraMarkerClicked) {opacity = 0.5}
            }
            const markerStyle = this.getMarkerStyle(marker.type);
            return <MarkerWithLabel
              opacity={0}
              key={'extra-marker-onmap-'+index}
              position={{lat: marker.location.lat, lng: marker.location.lng}}
              labelAnchor={new window.google.maps.Point(6.5, 36)}
              onClick={() => this.props.changeMarkerClicked(index, true)}
              >
              <span className={markerStyle.iconName} style={
                {color: markerStyle.color,
                opacity: opacity,
                fontSize: markerStyle.size}
              }></span>
          </MarkerWithLabel>})
       }
    </GoogleMap>
    ) }
}

const GoogleMapSection = withScriptjs( withGoogleMap( GoogleMapContainer ) )

export default App;
