import React, { useState } from 'react'
import RestaurantDataService from '../services/restaurant'
import { Link } from 'react-router-dom'

export default function RestaurantsList(props) {
	const [restaurants, setRestaurants] = useState([])
	const [searchName, setSearchName] = useState('')
	const [searchZip, setSearchZip] = useState('')
	const [searchCuisine, setSearchCuisine] = useState('')
	const [cuisines, setCuisines] = useState(['All Cuisines'])

	useEffect(() => {
		retrieveRestaurants()
		retrieveCuisines()
	}, [])

	const onChangeSearchName = e => {
		const searchName = e.target.value
		setSearchName(searchName)
	}

	const retrieveRestaurants = () => {
		RestaurantDataService.getAll()
		.then(res => {
			console.log(res.data)
			setRestaurants(res.data.restaurants)
		})
		.catch(e => {
			console.log(e)
		})
	}

	const retrieveCuisines = () => {
		RestaurantDataService.getCuisines()
		.then(res => {
			console.log(res.data)
			setCuisines(['All Cuisines'].concat(res.data))
		})
		.catch(e => {
			console.log(e)
		})
	}

	const refreshList = () => {
		retrieveRestaurants()
	}

	const find = (query, by) => {
		RestaurantDataService.find(query, by)
		.then(res => {
			console.log(res.data)
			setRestaurants(res.data.restaurants)
		})
		.catch(e => {
			console.log(e)
		})
	}

	const findByName = () => {
		find(searchName, 'name')
	}

	const findByZip = () => {
		find(searchZip, 'zipcode')
	}

	const findByCuisine = () => {
		searchCuisine === 'All Cuisines' ? refreshList() : find(searchCuisine, 'cuisine')
	}

	

	return (
		<div>
			<h1>Restaurant List</h1>
		</div>
	)
}