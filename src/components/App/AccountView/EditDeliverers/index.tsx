import { Button, Modal } from "antd";
import PropTypes, { InferProps } from "prop-types";
import { AgencyUser } from "../../../../utils/enums";
import EditDeliverersForm from "./EditDeliverersForm";
import { FormInstance } from "antd/lib/form";
import React from "react";

interface EditDeliverersState {
	users: AgencyUser[];
}

class EditDeliverers extends React.Component<
	InferProps<typeof EditDeliverers.propTypes>,
	EditDeliverersState
> {
	static propTypes = {
		onClose: PropTypes.func,
		visible: PropTypes.bool,
		users: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				email: PropTypes.string.isRequired,
			})
		),
		agencyId: PropTypes.string,
	};

	formRef = React.createRef<FormInstance>();

	constructor(props: InferProps<typeof EditDeliverers.propTypes>) {
		super(props);

		this.updateSavedUsers = this.updateSavedUsers.bind(this);
		this.onClose = this.onClose.bind(this);

		this.state = {
			users: [],
		};
	}

	componentDidMount() {
		this.updateSavedUsers();
	}

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

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

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
