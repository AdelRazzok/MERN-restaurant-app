import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId
let restaurants

export default class RestaurantsDAO {
	static async injectDB(conn) {
		// If restaurant is already filled, we just return
		if (restaurants) {
			return
		}
		// Filling the restaurants var with the restaurants collection
		try {
			restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
		} catch (err) {
			console.error(`Unable to establish a collection handle in restaurantsDAO: ${err}`)
		}
	}

	static async getRestaurantById(id) {
		try {
			// Create a pipeline to help match different collections together
			const pipeline = [
				{ $match: { _id: new ObjectId(id) } },
				{
					$lookup: {
						from: 'reviews',
						let: { id: '$_id' },
						pipeline: [
							{
								$match: { $expr: { $eq: ['$restaurant_id', '$$id'] } }
							},
							{
								$sort: {
									date: -1
								}
							}
						],
						as: 'reviews'
					}
				},
				{
					$addFields: { reviews : '$reviews' }
				}
			]
			return await restaurants.aggregate(pipeline).next()
		} catch (err) {
			console.error(`Something went wrong in getRestaurantByID: ${err}`)
			throw err
		}
	}

	static async getCuisines() {
		let cuisines = []
		try {
			cuisines = await restaurants.distinct('cuisine')
			return cuisines
		} catch (err) {
			console.error(`Unable to get cuisines, ${err}`)
			return cuisines
		}
	}

	static async getRestaurants({
		// Options we created for this method
		filters = null,
		page = 0,
		restaurantsPerPage = 20,
	} = {}) {

		// Filters management
		let query
		if (filters) {
			if ('name' in filters) {
				query = { $text: { $search: filters['name'] } }
			} else if ('cuisine' in filters) {
				query = { 'cuisine': { $eq : filters ['cuisine'] } }
			} else if ('zipcode' in filters) {
				query = { 'address.zipcode': { $eq: filters['zipcode'] } }
			}
		}

		// Cursor : pointer to the result of a query
		let cursor
		try {
			// If query's empty / there's no filter => this gonna return all the DB restaurants
			cursor = await restaurants.find(query)
		} catch (err) {
			console.error(`Unable to issue find command, ${err}`)
			return { restaurantsList: [], totalNumRestaurants: 0 }
		}
		// Limit the result
		const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
		try {
			const restaurantsList = await displayCursor.toArray()
			const totalNumRestaurants = await restaurants.countDocuments(query)
			return { restaurantsList, totalNumRestaurants }
		} catch (err) {
			console.error(`Unable to convert document, ${err}`)
			return { restaurantsList: [], totalNumRestaurants: 0 }
		}
	}
}