import React, { Component } from 'react';
import './Comment.css';

class Comment extends Component{
	constructor(props){
		super(props);
		this.state = {
			comment: this.props.comment
		}
	}
	render(){
		const self = this.props;
		return(
			<>
				<div className="Comment">
					<div className="Comment-container">
						<img src={"http://"+this.state.comment.image} />
						<div className="commenter-info">
							<p className="fullname"> {this.state.comment.username}</p>
							{this.state.comment.user == this.props.user?<button className="delete-comment" onClick={this.props.deleteComment.bind(this, this.props.id)}>
								Delete
							</button>:null}
							{this.state.comment.user == this.props.user?<button className="edit-comment" onClick={() => self.updateComment(this.props.comment)}>
								Update
							</button>:null}
							<p className="time"> {this.state.comment.time} </p>
							<p className="comment"> {this.state.comment.comment} </p>
						</div>
					</div>
				</div>
			</>
		);
	}
}
export default Comment;
