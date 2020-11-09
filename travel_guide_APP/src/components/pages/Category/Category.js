import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';
import CardContainer from './../../Layouts/CardContainer/CardContainer';
import Footer from './../../Layouts/Footer/Footer';
import PropTypes from 'prop-types';

class Category extends Component{
	constructor(props){
		super(props);
		this.state = {
			places: [],
			categoryName: "",
			loading: true
		}
		this.fetchPlaces = this.fetchPlaces.bind(this);
	}

	fetchPlaces = () => {
		console.log("Fetching places...");
		var url = 'http://localhost:8000/travel/category-place/'+this.props.location.state.target;
        fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
			console.log(data);
            this.setState({
                places: data,
				loading: false
            });
            console.log("Places fetched!");
        })
		.catch((err) => {
			console.log(err);
		})
	}

	getCategory = () => {
		var url = 'http://localhost:8000/travel/category/'+this.props.location.state.target;
        fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            this.setState({
                categoryName: data
            });
            console.log(this.state.categoryName);
        })
		.catch((err) => {
			console.log(err);
		})
	}

	componentWillMount(){
		this.fetchPlaces();
		this.getCategory();
		window.scrollTo(0,0);
	}
	render(){
		return(
			<>
				<div className="Category">
					<div style={{
						backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.3)), url("+this.props.location.state.image+")",
						}} className="Category-container">
						<div className="Category-container-text">
							<h1> {this.state.categoryName} </h1>
						</div>
					</div>
				</div>
				<CardContainer address={"/place/"} loading={this.state.loading} isCategory={false} heading={this.state.categoryName + " places"} categories={this.state.places} />
				<Footer />
			</>
		);
	}
}
export default Category;
