import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import PropTypes from 'prop-types';

class NavBar extends Component{
	constructor(props){
		super(props);
		this.state = {
			menu_clicked: false,
			menu_btn: false,
		}
		this.handleMenuClick = this.handleMenuClick.bind(this);
		this.handleManuIcon = this.handleManuIcon.bind(this);
		this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
		this.handleNav = this.handleNav.bind(this);
		this.handleSession = this.handleSession.bind(this);
	}

	handleSession = () => {
		var logout_login = document.querySelectorAll('#logout-login'); //logout
		var login_logout = document.querySelectorAll('#login-logout'); //signin
		var profile_tab = document.querySelectorAll('#profile-icon'); //profile
		var profile_icon = document.querySelectorAll('#profile-icon i'); //profile icon
		if(sessionStorage.getItem('token') === null){
			// hide #logout-login
			// display #login-logout
			// hide #profile-icon
			logout_login[0].style.fontSize = '0px';
			logout_login[1].style.fontSize = '0px';
			logout_login[1].style.padding = '0px';
			logout_login[1].style.opacity = '0';

			profile_tab[0].style.fontSize = '0px';
			profile_tab[0].parentNode.style.height = '0px';
			profile_tab[1].style.fontSize = '0px';
			profile_icon[0].style.top = '-100px';

			login_logout[0].style.fontSize = '15px';
			login_logout[1].style.fontSize = '15px';
			login_logout[1].style.padding = '5px 10px';
			login_logout[1].style.opacity = '1';

		}
		else{
			// display #logout-login
			// hide #login-logout
			// display #profile-icon
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
		logout_login.forEach((item) => {
			item.addEventListener('click', () => {
				// hide #logout-login
				// display #login-logout
				// hide #profile-icon
				sessionStorage.clear();
				login_logout[0].style.fontSize = '15px';
				login_logout[1].style.fontSize = '15px';
				login_logout[1].style.padding = '5px 10px';
				login_logout[1].style.opacity = '1';

				logout_login[0].style.fontSize = '0px';
				logout_login[1].style.fontSize = '0px';
				logout_login[1].style.padding = '0px';
				logout_login[1].style.opacity = '0';

				profile_tab[0].style.fontSize = '0px';
				profile_tab[0].parentNode.style.height = '0px';
				profile_tab[1].style.fontSize = '0px';
				profile_icon[0].style.top = '-100px';
			});
		});
	}

	handleMenuClick = () => {
		if(this.state.menu_clicked){
			this.setState({
				menu_clicked: false
			});
			var nav = document.querySelector('.navbar');
			if(window.scrollY < 100){
				nav.style.backgroundColor = 'transparent';
			}
			nav.style.transition = '.4s';
		}
		else{
			this.setState({
				menu_clicked: true
			});
			var nav = document.querySelector('.navbar');
			nav.style.backgroundColor = '#010724';
			nav.style.transition = '.4s';
		}
	}

	handleMenuItemClick = () => {
		this.setState({
			menu_clicked: false
		});
		var nav = document.querySelector('.navbar');
		if(window.scrollY < 100){
			nav.style.backgroundColor = 'transparent';
		}
		nav.style.transition = '.4s';
	}

	handleManuIcon = () => {
		if(window.innerWidth <= 960){
			this.setState({ menu_btn: true });
		}
		else{
			this.setState({ menu_btn: false });
			this.setState({
				menu_clicked: false
			});
		}
	}
	getMenuBtnStyle = () =>{
		return {
			display: this.state.menu_btn ? 'inline': 'none'
		}
	}

	handleNav = () => {
		var nav = document.querySelector('.navbar');
		if(window.scrollY >= 100){
			nav.style.backgroundColor = '#010724';
			nav.style.transition = '.6s';
		}
		else{
			nav.style.backgroundColor = 'transparent';
			nav.style.transition = '.6s';
		}
	}

	handleLogout = () => {
		sessionStorage.clear();
		this.setState({
			signin_btn: false
		});
	}

	componentWillMount(){
		if(window.innerWidth <= 960){
			this.setState({ menu_btn: true });
		}
		else{
			this.setState({ menu_btn: false });
			this.setState({
				menu_clicked: false
			});
		}
	}

	componentDidMount(){
		this.handleSession();
		window.addEventListener('resize', this.handleManuIcon);
		window.addEventListener('scroll', this.handleNav);
	}

	render(){
		return(
			<>
				<div className="navbar">
					<div className="navbar-container">
						<Link style={LinkStyle} to='/'>
						 	<i style={{fontSize: '32px'}} className="fab fa-asymmetrik"></i> TARUNNO-Tarvels
						</Link>
						<div style={this.getMenuBtnStyle()} className="menu-icon" onClick={this.handleMenuClick}>
							<i className={ this.state.menu_clicked ? 'fa fa-times' : 'fa fa-bars'} />
						</div>
						<div className="menu-items">
							<ul className={ this.state.menu_clicked ? 'nav-menu active' : 'nav-menu'}>
								<div className="nav-menu-container">
									<li className="menus-item" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/'> Home </Link>
									</li>
									<li className="menus-item" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/about'> About </Link>
									</li>
									<li className="menus-item" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/'> Packages </Link>
									</li>
									<li className="menus-item" onClick={this.handleMenuItemClick}>
										<Link id="profile-icon" style={LinkStyle} to='/profile'> Profile </Link>
									</li>
									<li className="menus-item" onClick={this.handleMenuItemClick}>
										<Link id="login-logout" className="menus-item-signup" style={LinkStyle} to='/signin'> SIGN IN </Link>
										<Link id="logout-login" className="menus-item-logout" style={LinkStyle} to='/'> LOG OUT </Link>
									</li>
								</div>
							</ul>
						</div>
						<div className="menu-items-desktop">
							<ul className={ this.state.menu_btn ? 'nav-menu-desktop' : 'nav-menu-desktop show'}>
								<div className="nav-menu-desktop-container">
									<li className="menus-item-desktop" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/'> Home </Link>
									</li>
									<li className="menus-item-desktop" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/about'> About </Link>
									</li>
									<li className="menus-item-desktop" onClick={this.handleMenuItemClick}>
										<Link style={LinkStyle} to='/'> Packages </Link>
									</li>
									<li className="menus-item-desktop" onClick={this.handleMenuItemClick}>
										<Link id="profile-icon" style={LinkStyle} to='/profile'> <i className="fas fa-user-circle"></i> </Link>
									</li>
									<li className="menus-item-desktop" onClick={this.handleMenuItemClick}>
										<Link id="login-logout" className="menus-item-desktop-signup" style={LinkStyle} to='/signin'> SIGN IN </Link>
										<Link id="logout-login" className="menus-item-desktop-logout" style={LinkStyle} to='/'> LOG OUT </Link>
									</li>
								</div>
							</ul>
						</div>
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
export default NavBar;
