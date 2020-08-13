import {
	ComputerScienceLogo,
	EnvironmentLogo,
	HcdeLogo,
	HousingFoodServicesLogo,
	ISchoolLogo,
} from "../../graphics/graphics";
import React from "react";

class Footer extends React.Component {
	render() {
		return (
			<footer className="site-footer">
				<div className="footer-logos">
					<div className="footer-logos-row">
						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<HcdeLogo />
						</a>

						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ISchoolLogo />
						</a>

						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ComputerScienceLogo />
						</a>
					</div>

					<div className="footer-logos-row">
						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<EnvironmentLogo />
						</a>

						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<ISchoolLogo />
						</a>

						<a
							className="special"
							href="https://hcde.uw.edu"
							target="_blank"
							rel="noopener noreferrer"
						>
							<HousingFoodServicesLogo />
						</a>
					</div>
				</div>

				<p>
					© 2020 University of Washington. Content is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
				</p>
			</footer>
		);
	}
}

export default Footer;
