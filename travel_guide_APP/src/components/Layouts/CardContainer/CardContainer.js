import React, { Component } from 'react';
import './CardContainer.css';
import Card from './../../Card/Card';
import PropTypes from 'prop-types';

import Loader from './../../Loader/Loader';

class CardContainer extends Component{
	render(){
		return(
			<>
				<div className="CardContainer">
					<div className="CardContainer-container">
						<h1> {this.props.heading} </h1>
						<Loader loading={this.props.loading}/>
						{this.props.categories.map((item) => (
							item.trending? <Card
								key={item.id}
								img={'http://localhost:8000/travel'+item.image}
								category={item.name}
								target={item.id}
								title={item.title.substring(0, 80)+'...'}
								trending={item.trending}
								address={this.props.address}
								subAddress={item.id}
								isCategory={this.props.isCategory}
							/>: null
						))}
						{this.props.categories.map((item) => (
							item.trending? null : <Card
								key={item.id}
								img={'http://localhost:8000/travel'+item.image}
								category={item.name}
								target={item.id}
								title={item.title.substring(0, 80)+'...'}
								trending={item.trending}
								address={this.props.address}
								subAddress={item.id}
								isCategory={this.props.isCategory}
							/>
						))}
					</div>
				</div>
			</>
		);
	}
}
export default CardContainer;
