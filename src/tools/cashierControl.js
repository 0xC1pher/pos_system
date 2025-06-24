const fs = require('fs')

const URL = 'https://saleor.nxlabs.io/graphql/'

let HAS_NEXT_PAGE = true
let END_CURSOR

const getData = async () => {
	try {
		const products = []

		while (HAS_NEXT_PAGE) {
			const options = {
				method: 'POST',
				body: JSON.stringify({
					query: `query getProducts($first: Int!, $after: String!, $channel: String!) {
                productVariants (first: $first, after: $after, channel: $channel) {
                    edges {
                        node {
                            id
                            name
                            sku
                            metadata {
                                key
                                value
                            }
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    totalCount
                }
            }
            `,
					variables: {
						first: 100,
						after: END_CURSOR || '',
						channel: 'offline',
					},
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization-Bearer': '3rWPBM0yIHTbxhZ5UJLZ6ZtBP6W7Ai',
				},
			}

			const response = await (await fetch(URL, options)).json()

			const {
				data: {
					productVariants: {
						edges: edges,
						pageInfo: { hasNextPage: next, endCursor: end },
						totalCount: total,
					},
				},
			} = response

			products.push(...edges.map(({ node }) => node))

			HAS_NEXT_PAGE = next
			END_CURSOR = end

			console.log({
				pageInfo: { hasNextPage: next, endCursor: end, total: total },
			})
		}

		fs.writeFileSync('products.json', JSON.stringify(products, null, 2))
	} catch (err) {
		console.log(err)
	}
}
