import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
 * @see routes/web.php:64
 * @route '/test-subscription-email'
 */
export const email = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})

email.definition = {
    methods: ["get","head"],
    url: '/test-subscription-email',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:64
 * @route '/test-subscription-email'
 */
email.url = (options?: RouteQueryOptions) => {
    return email.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:64
 * @route '/test-subscription-email'
 */
email.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: email.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:64
 * @route '/test-subscription-email'
 */
email.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: email.url(options),
    method: 'head',
})
const subscription = {
    email: Object.assign(email, email),
}

export default subscription