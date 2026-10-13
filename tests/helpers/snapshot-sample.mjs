/** A minimal valid snapshot; tests mutate copies of it. */
export function sample(platform = 'ODC') {
	return {
		version: 1,
		source: {
			module: 'OutSystemsUI',
			platform,
			moduleVersion: null,
			lastModifiedUtc: null,
			omlKey: null,
			origin: { sha256: 'abc' },
			exporter: 'test',
			exportedAt: null,
		},
		staticEntities: {
			Color: { description: '', records: [{ identifier: 'Transparent', label: 'Transparent', attributes: {} }] },
		},
		structures: {
			ItemsPerSlide: {
				description: '',
				attributes: [
					{
						name: 'Desktop',
						type: 'Integer',
						typeKind: 'basic',
						typeRef: null,
						mandatory: false,
						default: '1',
						description: '',
					},
				],
			},
		},
		blocks: {
			'Interaction/Carousel': {
				flow: 'Interaction',
				name: 'Carousel',
				public: true,
				description: 'A carousel.',
				inputParameters: [
					{
						name: 'ItemsPerSlide',
						type: 'ItemsPerSlide',
						typeKind: 'structure',
						typeRef: 'ItemsPerSlide',
						mandatory: false,
						default: null,
						description: 'Items per slide.',
					},
					{
						name: 'Color',
						type: 'Color Identifier',
						typeKind: 'staticEntity',
						typeRef: 'Color',
						mandatory: false,
						default: 'Entities.Color.Transparent',
						description: '',
					},
					{
						name: 'ExtendedClass',
						type: 'Text',
						typeKind: 'basic',
						typeRef: null,
						mandatory: false,
						default: '""',
						description: 'Extra classes.',
					},
				],
				placeholders: [{ name: 'CarouselItems', description: 'The slides.' }],
				events: [
					{
						name: 'OnSlideMoved',
						mandatory: false,
						description: '',
						parameters: [{ name: 'Position', type: 'Integer', description: '' }],
					},
				],
				requiredScripts: [],
				patternHints: { apiCalls: ['CarouselAPI'] },
			},
			'Content/Internal': {
				flow: 'Content',
				name: 'Internal',
				public: false,
				description: '',
				inputParameters: [],
				placeholders: [],
				events: [],
				requiredScripts: [],
				patternHints: { apiCalls: [] },
			},
		},
	};
}
