import React from 'react'
import { useParams } from 'react-router-dom'

export default function Restaurants() {
	let { id } = useParams()
	return (
		<div>
			<h1>Restaurant N° {id}</h1>
		</div>
	)
}