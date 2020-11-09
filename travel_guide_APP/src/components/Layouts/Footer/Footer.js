import React, { Component } from 'react';
import './Footer.css';
import PropTypes from 'prop-types';

class Footer extends Component{
	render(){
		return(
			<>
				<div className="Footer">
					<div className="Footer-container">
						<p className="footer-text-primary">
							Subscribe our Updates' newsletter and get the best vecation deals
						</p>
						<p className="footer-text-secondary">
							You can unsubscribe any time you want
						</p>
						<div className="input-fields">
							<input type="text" placeholder="Email..." />
							<button> Subscribe </button>
						</div>
						<div className="more-footer-info1">
							<div className="about-us">
								<p className="footer-heading"> About us </p>
								<p className="footer-text">How it works</p>
								<p className="footer-text">Testimonials</p>
								<p className="footer-text">Careers</p>
								<p className="footer-text">Trem and service</p>
								<p className="footer-text">Policies</p>
							</div>
							<div  className="about-us">
								<p className="footer-heading"> Contact us </p>
								<p className="footer-text">Contact</p>
								<p className="footer-text">Support</p>
								<p className="footer-text">Destinations</p>
								<p className="footer-text">Sponsorship</p>
							</div>
						</div>
						<div className="more-footer-info2">
							<div  className="about-us">
								<p className="footer-heading"> Videos </p>
								<p className="footer-text">Submit video</p>
								<p className="footer-text">Ambassadors</p>
								<p className="footer-text">Agency</p>
								<p className="footer-text">Influencer</p>
							</div>
							<div  className="about-us">
								<p className="footer-heading"> Social Media </p>
								<p className="footer-text">Facebook</p>
								<p className="footer-text">Twitter</p>
								<p className="footer-text">Youtube</p>
								<p className="footer-text">Instagram</p>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}
export default Footer;
