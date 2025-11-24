import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/subscriptions'
 */
export const compat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compat.url(options),
    method: 'post',
})

compat.definition = {
    methods: ["post"],
    url: '/subscriptions',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/subscriptions'
 */
compat.url = (options?: RouteQueryOptions) => {
    return compat.definition.url + queryParams(options)
}

/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/subscriptions'
 */
compat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compat.url(options),
    method: 'post',
})
const webhook = {
    compat: Object.assign(compat, compat),
}

export default webhook