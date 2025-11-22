import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import webhookB2f11f from './webhook'
/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/paddle/webhook'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/paddle/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/paddle/webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \Laravel\Paddle\Http\Controllers\WebhookController::__invoke
 * @see vendor/laravel/cashier-paddle/src/Http/Controllers/WebhookController.php:43
 * @route '/paddle/webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})
const paddle = {
    webhook: Object.assign(webhook, webhookB2f11f),
}

export default paddle