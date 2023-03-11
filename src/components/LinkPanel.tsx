import React from 'react';
import { infoListLinks } from '../canvas';
import TagLink from './TagLink';

export default function LinkPanel() {
	return (
		<div className="w-xl min-h-75 grid grid-cols-3 grid-auto-rows-8">
			{infoListLinks.map((item) => {
				return <TagLink {...item} key={item.no.toString()}></TagLink>;
			})}
		</div>
	);
}
