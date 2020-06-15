import { AgencyTypeNames, AgencyTypes } from "../../../utils/enums";
import { AppContext, AppPage } from "../";
import { List, Select } from "antd";
import DirectoryCard from "./DirectoryCard";
import React from "react";

interface DirectoryViewState {
	filter: string;
}

class DirectoryView extends React.Component<
	React.ComponentProps<"div">,
	DirectoryViewState
> {
	/** Initializes the directory view */
	constructor(props: React.ComponentProps<"div">) {
		super(props);

		this.state = {
			filter: AgencyTypes.ANY,
		};
	}

	/** Renders the directory view */
	render() {
		const { filter } = this.state;

		return (
			<AppContext.Consumer>
				{appContext => (
					<AppPage id="DirectoryView">
						{/** Allow users to filter agencies by type */}
						<Select
							defaultValue={AgencyTypes.ANY}
							onChange={e => this.setState({ filter: e })}
							style={{ width: 175, marginBottom: "2em" }}
						>
							{Object.keys(AgencyTypes).map(
								(agencyType: string) =>
									agencyType !== AgencyTypes.UMBRELLA && (
										<Select.Option key={agencyType} value={agencyType}>
											{AgencyTypeNames[agencyType]}
										</Select.Option>
									)
							)}
						</Select>

						{appContext.agencies && (
							<List grid={{ column: 1, gutter: 16 }}>
								{appContext.agencies.docs
									.sort((a, b) => a.data().name.localeCompare(b.data().name))
									.map(agency => {
										if (
											filter === AgencyTypes.ANY ||
											agency.data().type === filter
										) {
											return (
												<List.Item key={agency.id}>
													<DirectoryCard
														name={agency.data()?.name}
														type={agency.data()?.type}
														contact={agency.data()?.contact}
														address={agency.data()?.address}
													/>
												</List.Item>
											);
										}
									})}
							</List>
						)}
					</AppPage>
				)}
			</AppContext.Consumer>
		);
	}
}

export default DirectoryView;
