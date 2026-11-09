import React from 'react';
import { CopyButton } from './CopyButton';

export type UtilityRow = {
	utility_class: string;
	value: string;
	usage?: string;
};

type UtilityTableProps = {
	rows: UtilityRow[];
	className?: string;
};

export function UtilityTable({ rows, className = '' }: UtilityTableProps) {
	const showUsage = rows.some((row) => row.usage?.trim());

	return (
		<table className={`fd-table fd-table--utilities${className ? ` ${className}` : ''}`}>
			<thead>
				<tr>
					<th>Utility class</th>
					<th>Value</th>
					{showUsage ? <th>Usage</th> : null}
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.utility_class}>
						<td>
							<div className="fd-inline">
								<code>{row.utility_class}</code>
								<CopyButton text={row.utility_class} />
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<code>{row.value}</code>
								<CopyButton text={row.value} />
							</div>
						</td>
						{showUsage ? <td>{row.usage ?? ''}</td> : null}
					</tr>
				))}
			</tbody>
		</table>
	);
}
