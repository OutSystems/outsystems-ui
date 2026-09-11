import React from 'react';
import { CopyButton } from './CopyButton';

export type TokenRow = {
	token: string;
	css_variable: string;
	utility_class: string;
	value: string;
	usage?: string;
};

type TokenTableProps = {
	rows: TokenRow[];
	preview?: (row: TokenRow) => React.ReactNode;
	previewInToken?: boolean;
	columns?: 'full' | 'compact';
	className?: string;
	showUsage?: boolean;
	renderValue?: (row: TokenRow) => React.ReactNode;
};

function CopyCell({ value }: { value: string }) {
	return (
		<div className="fd-inline">
			<code>{value}</code>
			<CopyButton text={value} />
		</div>
	);
}

export function TokenTable({
	rows,
	preview,
	previewInToken = false,
	columns = 'full',
	className = '',
	showUsage = false,
	renderValue,
}: TokenTableProps) {
	const hasUsage = showUsage && rows.some((r) => r.usage?.trim());
	const showPreviewColumn = preview && !previewInToken;
	return (
		<table className={`fd-table${className ? ` ${className}` : ''}`}>
			<thead>
				<tr>
					{showPreviewColumn ? <th>Preview</th> : null}
					<th>Token</th>
					{columns === 'full' ? (
						<>
							<th>CSS variable</th>
							<th>Utility class</th>
						</>
					) : null}
					<th>Value</th>
					{hasUsage ? <th>Usage</th> : null}
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.token}>
						{showPreviewColumn ? <td>{preview(row)}</td> : null}
						<td>
							<div className={`fd-inline${previewInToken && preview ? ' fd-color-token-cell' : ''}`}>
								{previewInToken && preview ? preview(row) : null}
								<code>{row.token}</code>
								<CopyButton text={row.token} />
							</div>
						</td>
						{columns === 'full' ? (
							<>
								<td>
									<CopyCell value={row.css_variable} />
								</td>
								<td>
									<CopyCell value={row.utility_class} />
								</td>
							</>
						) : null}
						<td>{renderValue ? renderValue(row) : (
							<div className="fd-inline">
								<code>{row.value}</code>
								<CopyButton text={row.value} />
							</div>
						)}</td>
						{hasUsage ? <td>{row.usage ?? ''}</td> : null}
					</tr>
				))}
			</tbody>
		</table>
	);
}
