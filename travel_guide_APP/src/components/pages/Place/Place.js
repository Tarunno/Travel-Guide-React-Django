import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Place.css';
import Footer from './../../Layouts/Footer/Footer';
import PropTypes from 'prop-types';
import Loader from './../../Loader/Loader';
import Comments from './../../Layouts/Comments/Comments';

import ReactMarkdown from 'react-markdown';

class Category extends Component{
	constructor(props){
		super(props);
		this.state = {
			place: {},
			loading1: true,
			loading2: true,
			pinned: false,
			loved: false,
			count_love: 0,
			count_comment: 0,
			comments: [],
			message: null,
			comment_start: 0,
			comment_end: 3,
			load_more: true,
			logged_in: false,
			comment: {
				id: null,
				user: sessionStorage.getItem('username'),
				comment: null,
				place: this.props.location.state.target
			},
			editing: false
		}
		this.PinCheck = this.PinCheck.bind(this);
		this.fetchPlace = this.fetchPlace.bind(this);
		this.handlePin = this.handlePin.bind(this);
		this.LoveCheck = this.LoveCheck.bind(this);
		this.getComments = this.getComments.bind(this);
		this.smoothScroll = this.smoothScroll.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.updateComment = this.updateComment.bind(this);
	}

	updateComment(comment){
		var input_field = document.querySelector('.comment-input');
		input_field.value = comment.comment;
		this.setState({
			editing: true,
			comment: {
				...this.state.comment,
				id: comment.id,
				comment: comment.comment
			}
		});
	}

	deleteComment = (id) => {
		var url = 'http://localhost:8000/travel/comment-delete/';
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Token '+sessionStorage.getItem('token')
			},
			body: JSON.stringify({
				user: sessionStorage.getItem('username'),
				id: id
			})
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			var new_comments = []
			this.state.comments.forEach((item, i) => {
				if(item['id'] != id){
					new_comments.push(item);
				}
			});
			this.setState({
				comments: new_comments,
				count_comment: this.state.count_comment - 1
			});
			this.getComments();
		})
		.catch((err) => {
			console.log('Error:', err);
		})
	}

	handleChange = (e) => {
		var comment = e.target.value;
		this.setState({
			comment: {
				...this.state.comment,
				comment: comment
			}
		});
	}

	handleSubmit = () => {
		if(this.state.editing === false){
			var url = 'http://localhost:8000/travel/comment-add/';
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Token '+sessionStorage.getItem('token')
				},
				body: JSON.stringify(this.state.comment)
			})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				data = JSON.parse(data);
				this.setState({
					comments: [
						data,
						...this.state.comments
					],
					count_comment: this.state.count_comment + 1,
					comment_start: this.state.comment_start + 3,
					comment_end: this.state.comment_end + 3,
				});
			})
			.catch((err) => {
				console.log('Error:', err);
			})
		}
		else{
			var url = 'http://localhost:8000/travel/comment-update/';
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Token '+sessionStorage.getItem('token')
				},
				body: JSON.stringify(this.state.comment)
			})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				data = JSON.parse(data);
				this.state.comments.forEach((item, i) => {
					if(item.id === data.id){
						item.comment = data.comment
					}
				});

				this.setState({
					editing: false
				});
			})
			.catch((err) => {
				console.log('Error:', err);
			})
		}
		var input_field = document.querySelector('.comment-input');
		input_field.value = "";
	}

	getComments = () => {
		if(sessionStorage.getItem('token') !== null){
			console.log("fetching comments...");
			var url = 'http://localhost:8000/travel/comments/'+this.props.location.state.target+'/'+this.state.comment_start+'/'+this.state.comment_end;
			fetch(url, {
				method: "GET",
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Token '+sessionStorage.getItem('token')
				}
			})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				var fetchData = JSON.parse(data);
				console.log(fetchData);
				if(fetchData[0].length == 0){
					this.setState({
						load_more: false
					});
				}
				fetchData[0].forEach((item) => {
					this.setState({
						comments: [...this.state.comments, item],
					});
				});

				this.setState({
					logged_in: true,
					loading2: false,
					message: null,
					comment_start: this.state.comment_start + 3,
					comment_end: this.state.comment_end + 3,
					count_comment: fetchData[1].count_comment
				});
				console.log('Comments fetched');
			})
			.catch((err) => {
				console.log(err);
			})
		}
		else{
			this.setState({
				loading2: false,
				message: "Please Signin!",
				load_more: false
			});
		}
	}

	handleLove = () => {
		var love_btn = document.querySelector('#love');
		love_btn.addEventListener('click', () => {
			if(sessionStorage.getItem('token') !== null){
				var url = 'http://localhost:8000/travel/love-swap/'+this.props.location.state.target+"/"+sessionStorage.getItem('username');
		        fetch(url, {
					method: "GET",
					headers: {
						'Content-type': 'application/json',
						Authorization: 'Token '+sessionStorage.getItem('token')
					}
				})
		        .then((res) => {
		            return res.json();
		        })
		        .then((data) => {
					this.setState({
						loved: data.loved,
						count_love: data.count_love
					});
		        })
				.catch((err) => {
					console.log(err);
				})
			}
		});
	}

	LoveCheck = () => {
		if(sessionStorage.getItem('token') !== null){
			var url = 'http://localhost:8000/travel/love-check/'+this.props.location.state.target+"/"+sessionStorage.getItem('username');
	        fetch(url, {
				method: "GET",
				headers: {
					'Content-type': 'application/json'
				}
			})
	        .then((res) => {
	            return res.json();
	        })
	        .then((data) => {
				this.setState({
					loved: data.loved,
					count_love: data.count_love
				});
	        })
			.catch((err) => {
				console.log(err);
			})
		}
		else{
			var url = 'http://localhost:8000/travel/love-check/'+this.props.location.state.target+"/default";
	        fetch(url, {
				method: "GET",
				headers: {
					'Content-type': 'application/json'
				}
			})
	        .then((res) => {
	            return res.json();
	        })
	        .then((data) => {
				this.setState({
					loved: data.loved,
					count_love: data.count_love
				});
	        })
			.catch((err) => {
				console.log(err);
			})
		}
	}

	PinCheck = () => {
		if(sessionStorage.getItem('username') !== null){
			var url = 'http://localhost:8000/travel/pin-check/'+this.props.location.state.target+"/"+sessionStorage.getItem('username');
	        fetch(url, {
				method: "GET",
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Token '+sessionStorage.getItem('token')
				}
			})
	        .then((res) => {
	            return res.json();
	        })
	        .then((data) => {
				this.setState({
					pinned: data.pinned
				});
	        })
			.catch((err) => {
				console.log(err);
			})
		}
	}

	fetchPlace = () => {
		console.log("Fetching place...");
		var url = 'http://localhost:8000/travel/place/'+this.props.location.state.target;
        fetch(url, {
			method: "GET",
			headers: {
				'Content-type': 'application/json',
			}
		})
        .then((res) => {
            return res.json();
        })
        .then((data) => {
			this.setState({
	            place: data,
				loading1: false
	        });
	        console.log("Place fetched!");
        })
		.catch((err) => {
			console.log(err);
		})
	}

	handlePin = () => {
		if(sessionStorage.getItem('token') != null){
			var pin_button = document.querySelector('#pinned');
			pin_button.addEventListener('click', () => {
				if(this.state.pinned){
					console.log("Unpinned!");
					this.setState({
						pinned: false
					});
				}
				else{
					console.log("Pinned!");
					this.setState({
						pinned: true
					});

				}
				var url = 'http://localhost:8000/travel/pin-swap/'+this.props.location.state.target+'/'+sessionStorage.getItem('username');
				fetch(url, {
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
						Authorization: 'Token '+sessionStorage.getItem('token')
					}
				})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.log('Error: ', err);
				})
			});
		}
	}

	smoothScroll = () =>{
		function smoothScroll(target, duration){
		    var target = document.querySelector(target),
		    	targetPosition  = target.getBoundingClientRect().top,
		     	startPosition = window.pageYOffset,
		    	distance = targetPosition,
		    	startTime = null;
		    function animation(currentTime){
		        if(startTime==null){
		            startTime = currentTime;
		        }
		        var timeElapsed = currentTime - startTime;
		        var run = ease(timeElapsed, startPosition, distance-42, duration);
		        window.scrollTo(0, run);
		        if(timeElapsed < duration) requestAnimationFrame(animation);
		    }
		    function ease(t, b, c, d) {
		    	t /= d/2;
		    	if (t < 1) return c/2*t*t + b;
		    	t--;
		    	return -c/2 * (t*(t-2) - 1) + b;
		    }
		    requestAnimationFrame(animation);
		}
		var box1 = document.querySelector('.fa-comment');
		box1.style.cursor = 'pointer';

		box1.addEventListener('click', function(){
			smoothScroll('.Comments', 1500);
		});
	}

	componentWillMount(){
		this.fetchPlace();
		this.PinCheck();
		this.LoveCheck();
		this.getComments();
		window.scrollTo(0,0);
	}

	componentDidMount(){
		this.handlePin();
		this.handleLove();
		this.smoothScroll();
	}

	render(){
		const description = this.state.place.description;
		return(
			<>
				<div className="Place">
					<div style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.3)), url("+this.props.location.state.image+")",
					}}className="Place-container">
						<h1 className="Place-container-text"> {this.state.place.title} </h1>
						<div className="Place-options">
							<div className="Place-options-icon">
								{this.state.loved?<i id="love" className="fas fa-heart active-heart"></i>:<i id="love" className="fas fa-heart"></i>}
								<p style={{display: 'inline', fontSize: '20px', marginRight: '10px', fontWeight: 'bold'}}>{" "+this.state.count_love+" "}</p>
								<i className="fas fa-comment"></i>
								<p style={{display: 'inline', fontSize: '20px', marginRight: '10px', fontWeight: 'bold'}}>{" "+this.state.count_comment+" "}</p>
								{this.state.pinned?<i id="pinned" className="fas fa-thumbtack active"></i>:<i id="pinned" className="fas fa-thumbtack"></i>}
								{" "}
							</div>
						</div>
					</div>
				</div>
				<div className="Place-details">
					<div className="Place-details-container">
						<p className="description-heading"> Description </p>
						<p className="login-message"> </p>
						<ReactMarkdown source={description} escapeHtml={false}/>
					</div>
				</div>
				<Loader loading={this.state.loading1} />
				<Comments handleChange={this.handleChange} handleSubmit={this.handleSubmit} updateComment={this.updateComment} deleteComment={this.deleteComment} logged_in={this.state.logged_in} comments={this.state.comments} />
				<p className="login-message"> {this.state.message}</p>
				<Loader loading={this.state.loading2} />
				{this.state.load_more?<p onClick={this.getComments} className="load-more"> More comments </p>:null}
				<Footer />
			</>
		);
	}
}
export default Category;
