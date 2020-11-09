import React, { Component } from 'react';
import Showcase from './../../Layouts/Showcase/Showcase';
import CardContainer from './../../Layouts/CardContainer/CardContainer';
import Footer from './../../Layouts/Footer/Footer';
import NavBar from './../../Layouts/NavBar/NavBar';
import PropTypes from 'prop-types';

class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			loading: true
		}
		this.fetchCategory = this.fetchCategory.bind(this);
	}

	fetchCategory = () => {
		console.log("Fetching Categories...");
		var url = 'http://localhost:8000/travel/category-list/';
        fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            this.setState({
                categories: data,
				loading: false
            });
            console.log("Categories fetched!");
        })
	}

	componentWillMount(){
		this.fetchCategory();
		window.scrollTo(0,0);
	}
	render(){
		return(
			<>
				<Showcase />
				<CardContainer loading={this.state.loading} address={"/category/"} isCategory={true} heading={"Explore Exciting places with us!"} categories={this.state.categories}/>
				<Footer />
			</>
		);
	}
}
const LinkStyle = {
	textDecoration: 'none',
	fontFamily: 'Arial, sans-serif'
}
export default Home;
