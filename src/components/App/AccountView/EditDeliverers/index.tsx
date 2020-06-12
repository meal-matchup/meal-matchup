import { Button, Modal } from "antd";
import { AgencyUser } from "../../../../utils/enums";
import EditDeliverersForm from "./EditDeliverersForm";
import { FormInstance } from "antd/lib/form";
import React from "react";

interface EditDeliverersProps {
	onClose?: () => void;
	visible?: boolean;
	users?: {
		name: string;
		email: string;
	}[];
	agencyId?: string;
}

interface EditDeliverersState {
	users: AgencyUser[];
}

class EditDeliverers extends React.Component<
	EditDeliverersProps,
	EditDeliverersState
> {
	/** Initializes the edit deliverers modal */
	constructor(props: EditDeliverersProps) {
		super(props);

		this.updateSavedUsers = this.updateSavedUsers.bind(this);
		this.onClose = this.onClose.bind(this);

		this.state = {
			users: [],
		};
	}

	/** Creates a form ref for the ant.design form */
	formRef = React.createRef<FormInstance>();

	/** Runs when the component is mounted */
	componentDidMount() {
		this.updateSavedUsers();
	}

	/** Updates the saved users */
	updateSavedUsers() {
		const givenUsers: AgencyUser[] = [];

		if (this.props.users) {
			this.props.users.forEach(user => {
				const theUser: AgencyUser = {
					name: user?.name || "",
					email: user?.email || "",
				};
				givenUsers.push(theUser);
			});
		}

		this.setState({
			users: [...givenUsers],
		});
	}

	/** Runs when the modal is closed */
	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	/** Renders the edit deliverers modal */
	render() {
		const visible = !!this.props.visible;
		const { agencyId } = this.props;
		const { users } = this.state;

		const formId = "update-deliverers-form";

		return (
			<Modal
				visible={visible}
				title="Edit Deliverers"
				onCancel={this.onClose}
				footer={[
					<Button key="cancel" onClick={this.onClose}>
						Cancel
					</Button>,
					<Button key="save" type="primary" htmlType="submit" form={formId}>
						Save
					</Button>,
				]}
			>
				<EditDeliverersForm
					givenUsers={users}
					agencyId={agencyId}
					formId={formId}
					onFinish={this.onClose}
				/>
			</Modal>
		);
	}
}

export default EditDeliverers;
