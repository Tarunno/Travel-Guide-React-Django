import React, { Component } from 'react';
import Footer from './../../Layouts/Footer/Footer';
import './Signin.css';
import PropTypes from 'prop-types';

class Signin extends Component{
    constructor(props){
        super(props);
    }

	// CSRF token
    getToken(name){
           let cookieValue = null;
           if (document.cookie && document.cookie !== '') {
               const cookies = document.cookie.split(';');
               for (let i = 0; i < cookies.length; i++) {
                   const cookie = cookies[i].trim();
                   if (cookie.substring(0, name.length + 1) === (name + '=')) {
                       cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                       break;
                   }
               }
           }
        return cookieValue;
    }

	// handleSubmit
	handleSubmit =  () => {
		var error = false;
		var errorMessage = "";
		var username = document.querySelector('.username'),
			first_name = document.querySelector('.first_name'),
			last_name = document.querySelector('.last_name'),
			email = document.querySelector('.email'),
			password = document.querySelector('.password'),
			re_password = document.querySelector('.re-password');

		// validation
		if(password.value.length < 8){
			error = true;
			errorMessage = "Password must contain at least 8 characters!"
		}
		if(password.value != re_password.value){
			error = true;
			errorMessage = "Password doesn't match!";
		}
		var fields = ['.username', '.first_name', '.last_name', '.email', '.password', '.re-password'];
		fields.forEach((item) => {
			var el = document.querySelector(item);
			if(el.value === ""){
				el.style.boxShadow = '0px 0px 3px red';
				error = true;
				errorMessage = "Empty Feilds!";
			}
		});
		if(error){
			document.querySelector('.error-message').innerHTML = errorMessage;
			document.querySelector('.error-message').style.color = 'red';
			errorMessage = "";
		}
		else {
			errorMessage = "";
			document.querySelector('.error-message').innerHTML = errorMessage;
			this.createUser({
				username: username.value,
				first_name: first_name.value,
				last_name: last_name.value,
				email: email.value,
				password: password.value
			});
		}
	}

	// createUser
	createUser = (user) => {
		var csrftoken = this.getToken('csrftoken');

		var url = "http://localhost:8000/travel/user-register/";
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			body: JSON.stringify(user)
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			if(data['email'][0] === user.email){
				document.querySelector('.error-message').innerHTML = "Account created successfully!";
				document.querySelector('.error-message').style.color = 'green';
				this.clearInputFrom();
			}
			else{
				document.querySelector('.error-message').innerHTML = data['email'][0];
				document.querySelector('.error-message').style.color = 'red';
			}
		})
		.catch((err) => {
			console.log('ERROR: ', err);
		})
	}

	// handleInputForm
	handleInputForm = (e) => {
		e.target.style.boxShadow = '0px 0px 0px white';
	}

	// clearInputFrom
	clearInputFrom = () => {
		var fields = ['.username', '.first_name', '.last_name', '.email', '.password', '.re-password', '.username-login', '.password-login'];
		fields.forEach((item) => {
			var el = document.querySelector(item);
			el.value = "";
		});
	}

	// handleLoginSubmit
	handleLoginSubmit = () => {
		var error = false;
		var errorMessage = "";
		var username = document.querySelector('.username-login'),
			password = document.querySelector('.password-login');

		var fields = ['.username-login', '.password-login'];
		fields.forEach((item) => {
			var el = document.querySelector(item);
			if(el.value === ""){
				el.style.boxShadow = '0px 0px 3px red';
				error = true;
				errorMessage = "Empty Feilds!";
			}
		});
		if(error){
			document.querySelector('.error-message-login').innerHTML = errorMessage;
			document.querySelector('.error-message-login').style.color = 'red';
			errorMessage = "";
		}
		else {
			errorMessage = "";
			document.querySelector('.error-message-login').innerHTML = errorMessage;
			this.login({
				username: username.value,
				password: password.value
			});
		}
	}

	// Login
	login = (user) => {
		var csrftoken = this.getToken('csrftoken');

		var url = "http://localhost:8000/travel/user-login/";
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
				'X-CSRFToken': csrftoken,
			},
			body: JSON.stringify(user)
		})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
            console.log(data.token);
			if(typeof data.token !== 'undefined'){
                sessionStorage.setItem('username', user.username);
                sessionStorage.setItem('token', data.token);
                document.querySelector('.error-message-login').innerHTML = "You are logged in!";
    			document.querySelector('.error-message-login').style.color = 'green';
                var logout_login = document.querySelectorAll('#logout-login'); //logout
    			var login_logout = document.querySelectorAll('#login-logout'); //signin
                var profile_tab = document.querySelectorAll('#profile-icon'); //profile
        		var profile_icon = document.querySelectorAll('#profile-icon i'); //profile icon

    			logout_login[0].style.fontSize = '15px';
    			logout_login[1].style.fontSize = '15px';
    			logout_login[1].style.padding = '5px 10px';
    			logout_login[1].style.opacity = '1';

                login_logout[0].style.fontSize = '0px';
    			login_logout[1].style.fontSize = '0px';
    			login_logout[1].style.padding = '0px';
    			login_logout[1].style.opacity = '0';

                profile_tab[0].style.fontSize = '15px';
                profile_tab[0].parentNode.style.height = '55px';
                profile_tab[1].style.fontSize = '15px';
                profile_icon[0].style.top = '4px';
            }
            else{
                document.querySelector('.error-message-login').innerHTML = "Invalid username or password";
    			document.querySelector('.error-message-login').style.color = 'red';
            }
		})
		.catch((err) => {
			console.log('ERROR: ', err);
		})
	}

	render(){
		return(
			<>
			<div className="signin-showcase">
				<div className="signin-showcase-container">
					<div className="signin-showcase-text">
						<h1> Join our wonderfull community </h1>
						<p> Help and contribute in others trip and travels experiances </p>
					</div>
				</div>
			</div>
			<div className="signup-form">
				<div className="signup-form-container">
					<h1> SIGN UP </h1>
					<p className="error-message"> </p>
					<input type="text" onClick={this.handleInputForm} className="username" placeholder="Username..." />
					<input type="text" onClick={this.handleInputForm} className="first_name" placeholder="First name..." />
					<input type="text" onClick={this.handleInputForm} className="last_name" placeholder="Last name..." />
					<input type="email" onClick={this.handleInputForm} className="email" placeholder="Email..." />
					<input type="password" onClick={this.handleInputForm} className="password" placeholder="Password..." />
					<input type="password" onClick={this.handleInputForm} className="re-password" placeholder="Re-enter password..." />
					<button onClick={this.handleSubmit}> Sign Up </button>
				</div>
				<div className="login-form-container">
					<h1> SIGN IN </h1>
					<p className="error-message-login"> </p>
					<input type="text" onClick={this.handleInputForm} className="username-login" placeholder="Username..." />
					<input type="password" onClick={this.handleInputForm} className="password-login" placeholder="Password..." />
					<button onClick={this.handleLoginSubmit}> Login </button>
					<div className="note">
						<h3> NOTE: </h3>
						<p> <i className="fas fa-hand-point-right"></i> Please give a valid email addresss </p>
						<p> <i className="fas fa-hand-point-right"></i> Fill up all the feilds </p>
						<p> <i className="fas fa-hand-point-right"></i> Username and email should be unique </p>
						<p> <i className="fas fa-hand-point-right"></i> Password length should be minimum 8 </p>
						<p> <i className="fas fa-hand-point-right"></i> After creating an account you can add profile picture later from your profile </p>
					</div>
				</div>
			</div>
			<Footer />
			</>
		);
	}
}
export default Signin;
