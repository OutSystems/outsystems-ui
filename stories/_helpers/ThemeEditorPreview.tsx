import React from 'react';

/**
 * Live preview panel — shipped OUI markup only (same skeletons as the pattern stories).
 * Theme roles edited in the editor apply via `:root` inline overrides, so these
 * components re-skin through the real CSS API / token chain.
 */
export function ThemeEditorPreview(): React.ReactElement {
	const alerts = [
		{ type: 'error', msg: 'Something went wrong' },
		{ type: 'warning', msg: 'Check these fields' },
		{ type: 'success', msg: 'Changes published' },
		{ type: 'info', msg: 'Two items were skipped' },
	] as const;

	return (
		<div className="te-preview" id="te-preview">
			<div className="card card-sectioned flex-direction-column te-preview__card">
				<div className="card-sectioned-top flex-direction-column">
					<div className="card-title">Card title</div>
					<div className="card-content">Body text on a surface, inside a bordered card.</div>
				</div>
			</div>

			<div className="te-preview__btn-grid" aria-label="Button variants">
				<div className="te-preview__btn-row">
					<button type="button" className="btn btn-primary btn-small">
						<span>Primary</span>
					</button>
					<button type="button" className="btn btn-small">
						<span>Secondary</span>
					</button>
				</div>
				<div className="te-preview__btn-row">
					<button type="button" className="btn btn-success btn-small">
						<span>Approve</span>
					</button>
					<button type="button" className="btn btn-error btn-small">
						<span>Delete</span>
					</button>
				</div>
			</div>

			<input
				className="form-control"
				data-input
				type="text"
				readOnly
				defaultValue="Input field"
				aria-label="Input field"
			/>

			<div className="te-preview__alerts">
				{alerts.map(({ type, msg }) => (
					<div
						key={type}
						className={`alert alert-${type}`}
						role="alert"
						aria-live="polite"
						aria-atomic="true"
						tabIndex={0}
					>
						<div className="alert-icon OSInline" aria-hidden="true" />
						<div className="alert-message">
							<span>{msg}</span>
						</div>
					</div>
				))}
			</div>

			<table className="table te-preview__table" role="grid">
				<thead>
					<tr className="table-header">
						<th>Name</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					<tr className="table-row">
						<td data-header="Name">Darlene Robertson</td>
						<td data-header="Status">Approved</td>
					</tr>
					<tr className="table-row">
						<td data-header="Name">Tom Cook</td>
						<td data-header="Status">Blocked</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
