import React from 'react';
import { TagLinkInfo as TagLinkProps } from '../types';
import { Link } from 'react-router-dom';
export default function TagLink({ no, path, name }: TagLinkProps) {
	return (
		<div className="font-mono font-bold decoration-none hover:color-#374151">
			<span className="inline-block w-5 mr-2 opacity-40">{no}</span>
			<Link className="decoration-none opacity-80 color-#93a3af hover:color-#374151  " to={path}>
				{name}
			</Link>
		</div>
	);
}
