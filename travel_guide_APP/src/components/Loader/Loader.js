import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

class Loader extends Component{
	render(){
		return(
			<>
				<div  className="Loader">
					{this.props.loading?<img src="./static/images/spinner.svg" />:null}
				</div>
			</>
		);
	}
}
export default Loader;
