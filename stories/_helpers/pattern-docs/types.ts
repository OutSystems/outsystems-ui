import React from 'react';

export type DocProperty = {
	name: string;
	type: string;
	defaultValue?: string;
	description: React.ReactNode;
	optional?: boolean;
};

export type DocApiEntry = {
	name: string;
	description: string;
};

export type DocRelatedPattern = {
	name: string;
	storyId: string;
};

export type PatternAnatomy = {
	tree: string;
};

export type PatternApiSection = {
	title: string;
	rows: DocApiEntry[];
};

export type PatternDocMeta = {
	name: string;
	category: string;
	lede: string;
	overview: string;
	odcUrl?: string;
	o11Url?: string;
	liveStoryId: string;
	cssApiSlug?: string;
	stylingSelector?: string;
	whenToUse: string[];
	whenNotToUse?: string[];
	anatomy: PatternAnatomy;
	properties: Array<{ title?: string; rows: DocProperty[] }>;
	events?: DocApiEntry[];
	apiSections?: PatternApiSection[];
	accessibility: React.ReactNode[];
	related: DocRelatedPattern[];
};
