import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Card.css';
import PropTypes from 'prop-types';

class Card extends Component{
	constructor(props){
		super(props);
		this.state = {
			isTrending: false,
			isCategory: false
		}
	}
	handleClassName = () => {
		if(this.props.trending){
			this.setState({
				isTrending: true,
			});
		}
		if(this.props.isCategory){
			this.setState({
				isCategory: true,
			});
		}
	}

	componentWillMount(){
		this.handleClassName();
	}

	render(){
		return(
			<>
			<Link to={{
			  pathname: this.props.address+this.props.subAddress,
			  state: {
			    target: this.props.target,
				image: this.props.img
			  }
			}}>
				<div className={this.state.isTrending? 'Card-primary': 'Card-secondary'}>
					<div className="Card-container">
						<div className="Card-img">
							<img src={this.props.img} />
						</div>
						<p className={this.props.isCategory?"category":"hide"}> {this.props.category} </p>
						<h3 className="title"> {this.props.title} </h3>
					</div>
				</div>
			</Link>
			</>
		);
	}
}
export default Card;
