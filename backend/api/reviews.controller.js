import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
	static async apiPostReview(req, res, next) {
		try {
			// Get infos from the request's body
			const restaurantId = req.body.restaurant_id
			const review = req.body.text
			const userInfo = {
				name: req.body.name,
				_id: req.body.user_id
			}
			const date = new Date()

			// Create a review and add it in the database
			const ReviewResponse = await ReviewsDAO.addReview(
				restaurantId,
				userInfo,
				review,
				date
			)
			res.json({ status: 'Success' })
		} catch (err) {
			res.status(500).json({ error: err.message })
		}
	}

	static async apiUpdateReview(req, res, next) {
		try {
			const reviewId = req.body.review_id
			const text = req.body.text
			const date = new Date()

			const reviewResponse = await ReviewsDAO.updateReview(
				reviewId,
				req.body.user_id,
				text,
				date,
			)
			
			// Error handle
			var { error } = reviewResponse
			if (error) {
				res.status(400).json({ error })
			}
			// Throw an error if the review isn't modified for any reason
			if (reviewResponse.modifiedCount === 0) {
				throw new Error('Unable to update review, user may not be the original poster')
			}

			res.json({ status: 'Success' })
		} catch (err) {
			res.status(500).json({ error: err.message })
		}
	}

	static async apiDeleteReview(req, res, next) {
		try {
			// Get the query right in the URL
			const reviewId = req.query.id
			const userId = req.body.user_id
			console.log(reviewId)
			const reviewResponse = await ReviewsDAO.deleteReview(
				reviewId,
				userId
			)
			res.json('Success')
		} catch (err) {
			res.status(500).json( {error: err.message })
		}
	}
}