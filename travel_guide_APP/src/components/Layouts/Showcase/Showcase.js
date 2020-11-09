import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Showcase.css';
import PropTypes from 'prop-types';

class Showcase extends Component{
	constructor(props){
		super(props);
		this.state = {
			video: false
		}
	}

	handleBackground = () =>{
		var video = document.querySelector('.showcase video');
		video.addEventListener('loadeddata', (e) => {
		   //Video should now be loaded but we can add a second check
		   if(video.readyState == 4){
			   try {
			   	 	document.querySelector('.showcase').style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))";
			   } catch (e) {
			   		console.log(e);
			   }
		   }
		});
	}

	componentDidMount(){
		this.handleBackground();
	}

	render(){
		return(
			<>
				<div className="showcase">
					<video src="./static/videos/video-1.mp4" autoPlay loop muted/>
					<div className="showcase-text">
						<h1> Affordable Travel and Explorations </h1>
						<p> It is a long established fact that a reader will be distracted by the readable content of a page
						 when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution
						 of letters
						</p>
						<Link to="/signin" className="showcase-btn-primary"> GET STARTED </Link>
						<a href="https://www.youtube.com/watch?v=-pLkhTnaslk" className="showcase-btn-secondary"> WATCH TARILER </a>
					</div>
				</div>
			</>
		);
	}
}
const LinkStyle = {
	textDecoration: 'none',
	fontFamily: 'Arial, sans-serif'
}
export default Showcase;
