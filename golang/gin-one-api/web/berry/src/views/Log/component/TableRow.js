import PropTypes from "prop-types";

import { TableRow, TableCell } from "@mui/material";

import { timestamp2string, renderQuota } from "utils/common";
import Label from "ui-component/Label";
import LogType from "../type/LogType";

function renderType(type) {
	const typeOption = LogType[type];
	if (typeOption) {
		return (
			<Label variant="filled" color={typeOption.color}>
				{" "}
				{typeOption.text}{" "}
			</Label>
		);
	} else {
		return (
			<Label variant="filled" color="error">
				{" "}
				未知{" "}
			</Label>
		);
	}
}

export default function LogTableRow({ item, userIsAdmin }) {
	return (
		<>
			<TableRow tabIndex={item.id}>
				<TableCell>{timestamp2string(item.createTime)}</TableCell>

				{userIsAdmin && <TableCell>{item.channelId || ""}</TableCell>}
				{userIsAdmin && (
					<TableCell>
						<Label color="default" variant="outlined">
							{item.userName}
						</Label>
					</TableCell>
				)}
				<TableCell>
					{item.tokenName && (
						<Label color="default" variant="soft">
							{item.tokenName}
						</Label>
					)}
				</TableCell>
				<TableCell>{renderType(item.type)}</TableCell>
				<TableCell>
					{item.modelName && (
						<Label color="primary" variant="outlined">
							{item.modelName}
						</Label>
					)}
				</TableCell>
				<TableCell>{item.promptTokens || ""}</TableCell>
				<TableCell>{item.completionTokens || ""}</TableCell>
				<TableCell>{item.quota ? renderQuota(item.quota, 6) : ""}</TableCell>
				<TableCell>{item.content}</TableCell>
			</TableRow>
		</>
	);
}

LogTableRow.propTypes = {
	item: PropTypes.object,
	userIsAdmin: PropTypes.bool,
};
