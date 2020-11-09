import React, { Component } from 'react';
import Comment from './../../Comment/Comment';
import './Comments.css';

class Comments extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return(
			<>
				<div className="Comments">
					<div className="Comments-container">
						<h1> Comments </h1>
						{this.props.logged_in?<div className="comment-form">
							<input onChange={this.props.handleChange} className="comment-input" type="text" placeholder="Write comment..."/>
							<button onClick={this.props.handleSubmit} className="comment-btn"> Comment </button>
						</div>: null }
						{this.props.comments.map((item) => (
							<Comment key={item.id} id={item.id} user={sessionStorage.getItem('username')} updateComment={this.props.updateComment} deleteComment={this.props.deleteComment} comment={item} />
						))}
					</div>
				</div>
			</>
		);
	}
}
export default Comments;
