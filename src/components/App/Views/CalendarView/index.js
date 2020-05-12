import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import debug from 'debug';

import {
	Badge,
	Button,
	Calendar,
	Descriptions,
	Modal,
	message,
	Popconfirm,
	Tooltip,
	Select,
	Drawer,
	Form,
	Input,
} from 'antd';
import {
	LoadingOutlined,
	MinusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';

import Request from './Request';
import Log from './Log';

import { AgencyTypes, RequestTitles, RequestTypes } from '../../Enums';

class CalendarView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentRequest: null,
			claimDeliverers: [],
			manualDeliverers: [],
			mounted: null,
			requests: null,
			claimDrawerVisible: false,
			claimDrawerOpen: false,
			editDeliverers: false,
			requestDrawerOpen: false,
			logDrawerOpen: false,
			selectedDate: moment(),
		};
		this.getRequests = this.getRequests.bind(this);
		this.claimRequest = this.claimRequest.bind(this);
		this.handlEditDeliverers = this.handleEditDeliverers.bind(this);
		this.deleteRequest = this.deleteRequest.bind(this);
		this.dateCellRender = this.dateCellRender.bind(this);
		this.closeRequestModal = this.closeRequestModal.bind(this);

		this.requestModalFooters = {
			[AgencyTypes.DONATOR]: [
				<Button key="cancel" onClick={this.closeRequestModal}>
					Cancel
				</Button>,
				<Button key="edit" type="primary" onClick={debug}>
					Edit
				</Button>,
				<Popconfirm
					key="delete"
					title="Delete this request series?"
					okText="Yes"
					onConfirm={this.deleteRequest}
				>
					<Button type="primary" danger>
						Delete
					</Button>
				</Popconfirm>,
			],
			[AgencyTypes.DELIVERER]: {
				unclaimed: [
					<Button key="cancel" onClick={this.closeRequestModal}>
						Cancel
					</Button>,
					<Button
						key="claim"
						type="primary"
						onClick={() => {
							this.openClaimDrawer();
						}}
					>
						Claim
					</Button>,
				],
				claimed: [
					<Button key="cancel" onClick={this.closeRequestModal}>
						Cancel
					</Button>,
				],
			},
		};
	}

	dateCellRender(value) {
		const requestsOnDate = this.state.requests.filter((x) =>
			this.isSameWeekdayInPeriod(
				x.dates.from.toDate(),
				x.dates.to.toDate(),
				value.toDate()
			)
		);

		return requestsOnDate.length > 0 ? (
			<ul className="events">
				{requestsOnDate.map((request) => {
					let occurrence;
					if (request.type === RequestTypes.PICKUP) {
						occurrence = request.occurrences.filter((x) =>
							this.isSameDate(x.date.toDate(), value.toDate())
						)[0];
					}

					let status = 'default';
					if (request.type === RequestTypes.PICKUP) {
						if (
							(this.props.agency.type === AgencyTypes.DONATOR &&
								request.deliverer !== AgencyTypes.ANY) ||
							(request[this.props.agency.type.toLowerCase()] !==
								AgencyTypes.ANY &&
								occurrence &&
								!occurrence.complete)
						) {
							status = 'warning';
						}
						if (occurrence && occurrence.complete) {
							status = 'success';
						}
					}

					return (
						<li key={request.id}>
							<Button
								style={{
									margin: 0,
									padding: 0,
								}}
								onClick={() => this.openRequestModal(request.id)}
								type="link"
							>
								<Badge status={status} text={RequestTitles[request.type]} />
							</Button>
						</li>
					);
				})}
			</ul>
		) : null;
	}

	isSameDate(date1, date2) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	isSameWeekdayInPeriod(from, to, date) {
		return date.getDay() === from.getDay() && date >= from && date <= to;
	}

	async getRequests() {
		return firebase
			.firestore()
			.collection('requests')
			.where('umbrella', '==', this.props.umbrella.id)
			.get()
			.then((querySnapshot) => {
				const allRequests = [];
				querySnapshot.forEach((requestDoc) => {
					if (
						requestDoc.data()[this.props.agency.type.toLowerCase()] ===
							this.props.agency.id ||
						requestDoc.data()[this.props.agency.type.toLowerCase()] ===
							AgencyTypes.ANY
					) {
						allRequests.push({
							id: requestDoc.id,
							...requestDoc.data(),
						});
					}
				});
				if (this.state.mounted) this.setState({ requests: allRequests });
			});
	}

	componentDidMount() {
		this.setState({ mounted: true });
		if (this.state.manualDeliverers.length > 0) {
			this.setState({ manualDeliverers: [] });
		}
	}

	componentDidUpdate() {
		if (
			!firebase ||
			!this.props.umbrella ||
			!this.props.agency ||
			this.state.requests !== null
		)
			return;

		this.getRequests();
	}

	componentWillUnmount() {
		this.setState({
			mounted: false,
			claimDeliverers: [],
		});
	}

	openClaimDrawer = () => {
		this.setState({
			claimDrawerVisible: true,
			claimDrawerOpen: true,
		});
	};

	closeClaimDrawer = () => {
		this.setState({
			claimDrawerOpen: false,
		});
		setTimeout(
			function () {
				this.setState({
					claimDrawerVisible: false,
				});
			}.bind(this),
			230
		);
	};

	closeRequestModal() {
		this.setState({
			currentRequest: null,
			requestModalOpen: false,
		});
	}

	openRequestModal(requestId) {
		const theRequest = this.state.requests.filter((x) => x.id === requestId)[0];

		const { agency } = this.props;

		let footer = this.requestModalFooters[agency.type];

		if (agency.type !== AgencyTypes.DONATOR) {
			const claimed = theRequest[agency.type.toLowerCase()] !== AgencyTypes.ANY;
			footer = this.requestModalFooters[agency.type][
				claimed ? 'claimed' : 'unclaimed'
			];
		}

		this.setState({
			currentRequest: theRequest,
			requestModalFooter: footer,
			requestModalOpen: true,
		});
	}

	deleteRequest() {
		if (this.state.currentRequest) {
			// Only delete if a request is selected
			return firebase
				.firestore()
				.collection('requests')
				.doc(this.state.currentRequest.id)
				.delete()
				.then(() => {
					message.success('Successfully deleted request');
					this.closeRequestModal();
				})
				.catch((e) => {
					debug('Unable to delete request', e);
					message.error('Could not delete request');
				});
		}
	}

	getAssignedDeliverers(entered_emails) {
		let deliverers_list = this.state.claimDeliverers.concat(entered_emails);
		if (deliverers_list.length == 0) {
			deliverers_list = [this.props.agency.contact.name];
		}
		return deliverers_list;
	}

	handleEditDeliverers(edited_deliverers) {
		if (this.state.currentRequest) {
			const occ_copy = [];
			this.state.currentRequest.occurrences.map((occurrence, idx) => {
				occ_copy[idx] = occurrence;
				if (this.isSameDate(occurrence.date.toDate(),this.state.selectedDate.toDate())) {
					occ_copy[idx]['deliverers'] = edited_deliverers;
				}
			});
			return firebase
				.firestore()
				.collection('requests')
				.doc(this.state.currentRequest.id)
				.update({
					occurrences: occ_copy,
				})
				.then(() => {
					this.getRequests();
					this.closeRequestModal();
					message.success('Successfully editted request');
				})
				.catch((e) => {
					debug('Unable to edit request', e);
					message.error('Could not edit request');
					this.closeRequestModal();
				});
		}
	}

	claimRequest(assigned_deliverers) {
		if (this.state.currentRequest) {
			// Only try to claim if there's a request to be claimed
			this.props.agency.users.map((person) => {
				if (this.state.claimDeliverers.some((item) => person.name === item)) {
					console.log(person.email);
					// send the emails here
				}
			});
			const occ_copy = [];
			this.state.currentRequest.occurrences.map((occurrence, idx) => {
				occ_copy[idx] = occurrence;
				occ_copy[idx]['deliverers'] = assigned_deliverers;
			});
			return firebase
				.firestore()
				.collection('requests')
				.doc(this.state.currentRequest.id)
				.update({
					[this.props.agency.type.toLowerCase()]: this.props.agency.id,
					occurrences: occ_copy,
				})
				.then(() => {
					this.getRequests();
					this.closeRequestModal();
				})
				.catch((e) => {
					debug('Unable to claim request', e);
					message.error('Could not claim request');
					this.closeRequestModal();
				});
		}
	}

	formGoogleMapsURL(agency) {
		let address = agency.address.line1;
		if (agency.address.line2) address += ` ${agency.address.line2}`;
		address += `, ${agency.address.city}, ${agency.address.state} ${agency.address.zip}`;
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			address
		)}`;
	}

	render() {
		const {
			currentRequest,
			requests,
			claimDrawerOpen,
			claimDrawerVisible,
			claimDeliverers,
			manualDeliverers,
			editDeliverers,
			requestModalOpen,
			requestModalFooter,
			requestDrawerOpen,
			logDrawerOpen,
			selectedDate,
		} = this.state;

		const { Option } = Select;

		const children = [];
		if (this.props.agency && this.props.agency.users) {
			this.props.agency.users.map((person) => {
				children.push(<Option key={person.name}>{person.name}</Option>);
			});
		}

		const onFinish = values => {
			let emails = [];
			if (values !== undefined && values.names !== undefined) {
				emails = values.names;
			}
			let assigned_deliverers = this.getAssignedDeliverers(emails);
			this.closeClaimDrawer();
			if (this.state.editDeliverers) {
				this.handleEditDeliverers(assigned_deliverers);
			} else {
				this.claimRequest(assigned_deliverers);
			}
		};

		const occurrence =
			currentRequest &&
			currentRequest.occurrences &&
			currentRequest.occurrences.filter((x) =>
				this.isSameDate(x.date.toDate(), selectedDate.toDate())
			)[0];

		const today = new Date();

		let assigned_deliverers =
			currentRequest && occurrence.deliverers && occurrence.deliverers[0];
		if (occurrence && occurrence.deliverers) {
			for (let i = 1; i < occurrence.deliverers.length; i++) {
				assigned_deliverers += ', ' + occurrence.deliverers[i];
			}
		}
		const currentRequestInfo = currentRequest && {
			when: `
				${moment(currentRequest.dates.from.toDate()).format('MMMM D, YYYY')}
				–
				${moment(currentRequest.dates.to.toDate()).format('MMMM D, YYYY')},
				on every
				${new Intl.DateTimeFormat('en-US', {
					weekday: 'long',
				}).format(currentRequest.dates.from.toDate().getDay())}
				between
				${moment(currentRequest.time.start.toDate()).format('h:mm a')}
				and
				${moment(currentRequest.time.to.toDate()).format('h:mm a')}
			`,
			donator: this.props.agencies.filter(
				(x) => x.id === currentRequest.donator
			)[0],
			deliverer:
				currentRequest.deliverer === AgencyTypes.ANY
					? { name: 'Any (Unclaimed)' }
					: this.props.agencies.filter(
							(x) => x.id === currentRequest.deliverer
					  )[0],
			receiver:
				currentRequest.receiver === AgencyTypes.ANY
					? { name: 'Any (Unclaimed)' }
					: this.props.agencies.filter(
							(x) => x.id === currentRequest.receiver
					  )[0],
			deliverers: occurrence.deliverers
				? { name: assigned_deliverers }
				: { name: 'Unassigned' },
		};

		return (
			<>
				<div
					className="events-calendar"
					style={{ height: '100%', position: 'relative', width: '100%' }}
				>
					<AnimatePresence exitBeforeEnter>
						{requests && (
							<motion.div
								key="calendar"
								variants={{
									hidden: {
										opacity: 0,
									},
									visible: {
										opacity: 1,
									},
								}}
								initial="hidden"
								animate="visible"
								exit="hidden"
							>
								<h1>{selectedDate.format('MMMM YYYY')}</h1>

								<Calendar
									dateCellRender={this.dateCellRender}
									onChange={(value) => this.setState({ selectedDate: value })}
								/>
								<Modal
									style={{ overflow: 'hidden' }}
									visible={requestModalOpen}
									title={`Request on ${selectedDate.format('MMMM D, YYYY')} (${
										currentRequest &&
										currentRequest.occurrences.filter((x) =>
											this.isSameDate(x.date.toDate(), selectedDate.toDate())
										)[0].complete
											? 'Completed'
											: 'Not done yet'
									})`}
									footer={requestModalFooter}
									onCancel={this.closeRequestModal}
									centered
								>
									{claimDrawerVisible && (
										<Drawer
											key="claimDrawer"
											title={
												editDeliverers ? 'Edit Deliverers' : 'Confirm Claim'
											}
											placement="bottom"
											height="top"
											closable={true}
											onClose={this.closeClaimDrawer}
											visible={claimDrawerOpen}
											footer={
												<div
													style={{
														display: 'flex',
														flexDirection: 'row-reverse',
													}}
												>
													<Button
														form="dynamic_form_item"
														type="primary"
														style={{ marginLeft: 7 }}
														htmlType="submit"
													>
														Confirm
													</Button>
													<Button onClick={this.closeClaimDrawer}>
														Cancel
													</Button>
												</div>
											}
											getContainer={false}
											destroyOnClose={true}
											style={{ position: 'absolute' }}
										>
											{editDeliverers && (
												<div>
													Input the deliverers for this specific request. If
													nothing is input the primary contact will be used the
													deliverer for this date.
												</div>
											)}
											{!editDeliverers && (
												<div>
													Input the default deliverers for this delivery. If
													nothing is input the primary contact will be used as
													the default deliverer.
												</div>
											)}
											<br />
											{children.length > 0 && (
												<Select
													mode="multiple"
													style={{ width: '100%' }}
													placeholder="Please select default deliverers"
													defaultValue={[]}
													onChange={(value) => {
														this.setState({ claimDeliverers: value });
													}}
												>
													{children}
												</Select>
											)}
											{children.length > 0 && (
												<>
													<div>
														<br />
													</div>
													<div>
														You can manually enter deliverer emails here.
													</div>
													<br />
												</>
											)}
											<Form
												id="dynamic_form_item"
												name="dynamic_form_item"
												onFinish={onFinish}
											>
												<Form.List name="names">
													{(fields, { add, remove }) => {
														return (
															<div>
																{fields.map((field, index) => (
																	<Form.Item required={true} key={field.key}>
																		<Form.Item
																			{...field}
																			validateTrigger={['onChange', 'onBlur']}
																			rules={[
																				{
																					required: true,
																					message:
																						"please input the deliverer's email or delete this field.",
																				},
																			]}
																			noStyle
																		>
																			<Input
																				placeholder="deliverer email"
																				style={{ width: '93.5%' }}
																			/>
																		</Form.Item>
																		<MinusCircleOutlined
																			className="dynamic-delete-button"
																			style={{ margin: '0 8px' }}
																			onClick={() => {
																				remove(field.name);
																			}}
																		/>
																	</Form.Item>
																))}
																<Form.Item>
																	<Button
																		type="dashed"
																		onClick={() => {
																			add();
																		}}
																		style={{ width: '100%' }}
																	>
																		<PlusOutlined /> Add Deliverer
																	</Button>
																</Form.Item>
															</div>
														);
													}}
												</Form.List>
											</Form>
										</Drawer>
									)}
									{currentRequest && (
										<Descriptions column={1} bordered>
											<Descriptions.Item label="When">
												{currentRequestInfo.when}
											</Descriptions.Item>

											<Descriptions.Item label="Donating Agency">
												{currentRequestInfo.donator.name}
												<br />
												<a
													href={this.formGoogleMapsURL(
														currentRequestInfo.donator
													)}
													target="_blank"
													rel="noopener noreferrer"
												>
													Directions
												</a>
											</Descriptions.Item>
											{this.props.agency.type === AgencyTypes.DELIVERER && (
												<Descriptions.Item label="Assigned 	Deliverers">
													{currentRequestInfo.deliverers.name}
													{currentRequestInfo.deliverer.name ===
														this.props.agency.name && (
														<>
															<br />
															<a
																role="button"
																onClick={() => {
																	this.setState({ editDeliverers: true });
																	this.openClaimDrawer();
																}}
															>
																Edit Deliverers
															</a>
														</>
													)}
												</Descriptions.Item>
											)}

											<Descriptions.Item label="Delivering Agency">
												{currentRequestInfo.deliverer.name}
											</Descriptions.Item>

											<Descriptions.Item label="Receiving Agency">
												{currentRequestInfo.receiver.name}
											</Descriptions.Item>

											{currentRequest.notes && (
												<Descriptions.Item label="Notes">
													{currentRequest.notes}
												</Descriptions.Item>
											)}

											{occurrence && (
												<Descriptions.Item label="Status">
													{occurrence.complete ? (
														<strong>Completed</strong>
													) : (
														<>
															<strong>Not completed yet</strong>
															<br />
															{this.props.agency.type ===
															AgencyTypes.DELIVERER ? (
																<Button
																	style={{
																		display:
																			occurrence.date.toDate() <= today
																				? 'inline-block'
																				: 'none',
																	}}
																	onClick={() => {
																		this.setState({ logDrawerOpen: true });
																		this.closeRequestModal();
																	}}
																	type="link"
																>
																	Fill out food log
																</Button>
															) : (
																'Did the delivering agency pick up this donation? If so, they need to confirm this.'
															)}
														</>
													)}
												</Descriptions.Item>
											)}
										</Descriptions>
									)}
								</Modal>
							</motion.div>
						)}
						{!requests && (
							<motion.div
								key="loading"
								variants={{
									hidden: {
										opacity: 0,
									},
									visible: {
										opacity: 1,
									},
								}}
								initial="hidden"
								animate="visible"
								exit="hidden"
								style={{
									left: '50%',
									position: 'absolute',
									top: '50%',
									transform: 'translate3d(-50%, -50%, 0)',
								}}
							>
								<LoadingOutlined style={{ fontSize: '3em' }} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="calendar-buttons-container">
					{this.props.agency &&
						this.props.agency.type === AgencyTypes.DONATOR &&
						this.props.agencies && (
							<Tooltip
								title={
									!this.props.agency.approved &&
									'Your account has not been approved yet'
								}
								placement="topRight"
							>
								<Button
									disabled={!this.props.agency.approved}
									type="primary"
									onClick={() => this.setState({ requestDrawerOpen: true })}
								>
									New Request
								</Button>
							</Tooltip>
						)}
				</div>

				{this.props.umbrella &&
					this.props.agency &&
					this.props.agency.type === AgencyTypes.DONATOR &&
					this.props.agencies && (
						<Request
							open={requestDrawerOpen}
							onClose={() => this.setState({ requestDrawerOpen: false })}
							umbrella={this.props.umbrella}
							agency={this.props.agency}
							agencies={this.props.agencies}
						/>
					)}

				{this.props.umbrella &&
					this.props.agency &&
					this.props.agency.type === AgencyTypes.DELIVERER &&
					this.props.agencies &&
					currentRequest && (
						<Log
							open={logDrawerOpen}
							onClose={() => this.setState({ logDrawerOpen: false })}
							request={null}
							occurrence={
								currentRequest.occurrences &&
								currentRequest.occurrences.filter((x) =>
									this.isSameDate(x.date.toDate(), selectedDate.toDate())
								)[0]
							}
						/>
					)}
			</>
		);
	}
}

CalendarView.propTypes = {
	umbrella: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
	agency: PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		approved: PropTypes.bool.isRequired,
		contact: PropTypes.shape({
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			phone: PropTypes.string.isRequired,
		}).isRequired,
	}),
	agencies: PropTypes.array,
};
export default CalendarView;
