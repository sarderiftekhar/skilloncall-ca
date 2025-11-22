import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SubscriptionController::callback
 * @see app/Http/Controllers/SubscriptionController.php:246
 * @route '/subscriptions/paddle/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/subscriptions/paddle/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::callback
 * @see app/Http/Controllers/SubscriptionController.php:246
 * @route '/subscriptions/paddle/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::callback
 * @see app/Http/Controllers/SubscriptionController.php:246
 * @route '/subscriptions/paddle/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::callback
 * @see app/Http/Controllers/SubscriptionController.php:246
 * @route '/subscriptions/paddle/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:285
 * @route '/subscriptions/paddle/cancel'
 */
export const cancel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cancel.url(options),
    method: 'get',
})

cancel.definition = {
    methods: ["get","head"],
    url: '/subscriptions/paddle/cancel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:285
 * @route '/subscriptions/paddle/cancel'
 */
cancel.url = (options?: RouteQueryOptions) => {
    return cancel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:285
 * @route '/subscriptions/paddle/cancel'
 */
cancel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cancel.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:285
 * @route '/subscriptions/paddle/cancel'
 */
cancel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cancel.url(options),
    method: 'head',
})
const paddle = {
    callback: Object.assign(callback, callback),
cancel: Object.assign(cancel, cancel),
}

export default paddle