import React from 'react';
import type { DocProperty } from './types';

type PropertyTableProps = {
	rows: DocProperty[];
	className?: string;
};

export function PropertyTable({ rows, className = '' }: PropertyTableProps) {
	return (
		<div className={`pd-table-wrap${className ? ` ${className}` : ''}`}>
			<table className="pd-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.name}>
							<td>
								<span className="pd-tag pd-tag--accent">{row.name}</span>
								{row.optional !== false ? (
									<span className="pd-table__opt">Optional</span>
								) : null}
							</td>
							<td>
								<span className="pd-tag">{row.type}</span>
							</td>
							<td>
								{row.defaultValue ? <span className="pd-tag">{row.defaultValue}</span> : '—'}
							</td>
							<td>{row.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

type ApiTableProps = {
	rows: Array<{ name: string; description: React.ReactNode }>;
};

export function ApiTable({ rows }: ApiTableProps) {
	return (
		<div className="pd-table-wrap">
			<table className="pd-table pd-table--api">
				<thead>
					<tr>
						<th>API</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.name}>
							<td>
								<span className="pd-tag">{row.name}</span>
							</td>
							<td>{row.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
