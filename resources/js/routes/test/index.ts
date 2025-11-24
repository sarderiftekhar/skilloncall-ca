import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import subscription from './subscription'
/**
 * @see routes/web.php:41
 * @route '/test-email'
 */
export const email = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})

email.definition = {
    methods: ["get","head"],
    url: '/test-email',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:41
 * @route '/test-email'
 */
email.url = (options?: RouteQueryOptions) => {
    return email.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:41
 * @route '/test-email'
 */
email.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:41
 * @route '/test-email'
 */
email.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: email.url(options),
    method: 'head',
})
const test = {
    email: Object.assign(email, email),
subscription: Object.assign(subscription, subscription),
}

export default test