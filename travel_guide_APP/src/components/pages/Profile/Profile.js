import React, { Component } from 'react';
import Loader from './../../Loader/Loader';
import CardContainer from './../../Layouts/CardContainer/CardContainer';
import Footer from './../../Layouts/Footer/Footer';
import './Profile.css';

class Profile extends Component{
	constructor(props){
		super(props);
		this.state = {
			username: sessionStorage.getItem('username'),
			token: sessionStorage.getItem('token'),
			user_id: null,
			name: null,
			email: null,
			image: null,
			loading: true,
			places: [],
			loading: true,
			selectedImage: null

		}
		this.fetchUser = this.fetchUser.bind(this);
		this.fetchUserDetail = this.fetchUserDetail.bind(this);
		this.fetchPinPlace = this.fetchPinPlace.bind(this);
		this.changePhoto = this.changePhoto.bind(this);
		this.setImage = this.setImage.bind(this);
	}

	setImage = (e) => {
		console.log(e.target.files[0]);
		this.setState({
			selectedImage: e.target.files[0]
		});
	}

	changePhoto = () => {
		var flag = false;
		var upload_window = document.querySelector('.upload-window');
		var camera_btn = document.querySelector('.change-image-constainer');
		var upload_window_mini = document.querySelector('.upload-window-mini');
		camera_btn.addEventListener('click', function(){
			upload_window.classList.add('active');
			upload_window_mini.classList.add('active');
			flag = true;
		});
		upload_window.addEventListener('click', function(){
			if(flag === false){
				upload_window.classList.add('active');
				upload_window_mini.classList.add('active');
				flag = true;
			}
			else{
				upload_window.classList.remove('active');
				upload_window_mini.classList.remove('active');
				flag = false;
			}
		});
	}

	uploadImage = () => {
		var data = new FormData();
		data.append('image', this.state.selectedImage, this.state.selectedImage.name);
		data.append('user', sessionStorage.getItem('username'));
		console.log(Array.from(data));
		var url = "http://localhost:8000/travel/profile-photo/";
		fetch(url, {
			method: 'POST',
			headers: {
				Authorization: "Token "+this.state.token
			},
			body: data
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			data = JSON.parse(data);
			this.setState({
				image: data.image
			});
			var upload_window = document.querySelector('.upload-window');
			var upload_window_mini = document.querySelector('.upload-window-mini');
			upload_window.classList.remove('active');
			upload_window_mini.classList.remove('active');
			document.querySelector('.image-field').value = null;
		})
		.catch((err) => {
			console.log('Error: ', err);
		})
	}

	fetchUser = () => {
		console.log("Fetching user...");
		var url = "http://localhost:8000/travel/user-profile/"+this.state.username;
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			}
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			this.setState({
				user_id: data.user,
				image: data.image
			});
			console.log("User fetched!");
		})
		.catch((err) => {
			console.log('Error: ', err);
		})
	}

	fetchUserDetail = () => {
		console.log('Fetching user details...');
		var url = "http://localhost:8000/travel/user-details/"+this.state.username;
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			}
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			this.setState({
				email: data.email,
				name: data.first_name + " " + data.last_name
			});
			console.log('User deatils fetched!');
		})
		.catch((err) => {
			console.log('Error: ', err);
		})
	}

	fetchPinPlace = () => {
		console.log('Fetching pin places...');
		var url = "http://localhost:8000/travel/user-pin-place/"+this.state.token;
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				Authorization: "Token "+this.state.token
			}
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			this.setState({
				places: data,
				loading: false
			});
			console.log('Pin places fetched!');
		})
		.catch((err) => {
			console.log('Error: ', err);
		})
	}

	componentWillMount(){
		this.fetchUser();
		this.fetchUserDetail();
		this.fetchPinPlace();
		window.scrollTo(0, 0);
	}

	componentDidMount(){
		this.changePhoto();
	}


	render(){
		return(
			<>
			<div className="upload-window">
			</div>
			<div className="upload-window-mini">
				<input type="file" className="image-field" onChange={this.setImage}/>
				<button type="button" onClick={this.uploadImage} className="image-upload-btn"> Upload </button>
			</div>
				<div className="Profile">
					<div className="Profile-constainer">
						<div className="Profile-info">
							<div className="change-image-constainer" onClick={this.changePhoto}>
								<i id="change-image" className="fas fa-camera"></i>
							</div>
							<img src={this.state.image!==null?"http://localhost:8000/travel"+this.state.image:'./static/images/default.png'} />
							<h1 className="name"> {this.state.name} </h1>
							<h1 className="username"> @{this.state.username} </h1>
						</div>
					</div>
				</div>
				<CardContainer address={"/place/"} loading={this.state.loading} isCategory={false} heading={"Your pinned places!"} categories={this.state.places} />
				<Footer />
			</>
		);
	}
}

export default Profile;
