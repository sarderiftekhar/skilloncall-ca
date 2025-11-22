import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import paddle from './paddle'
/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:20
 * @route '/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:20
 * @route '/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:20
 * @route '/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:20
 * @route '/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:112
 * @route '/subscription'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/subscription',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:112
 * @route '/subscription'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:112
 * @route '/subscription'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:112
 * @route '/subscription'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::subscribe
 * @see app/Http/Controllers/SubscriptionController.php:143
 * @route '/subscriptions/subscribe'
 */
export const subscribe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

subscribe.definition = {
    methods: ["post"],
    url: '/subscriptions/subscribe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::subscribe
 * @see app/Http/Controllers/SubscriptionController.php:143
 * @route '/subscriptions/subscribe'
 */
subscribe.url = (options?: RouteQueryOptions) => {
    return subscribe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::subscribe
 * @see app/Http/Controllers/SubscriptionController.php:143
 * @route '/subscriptions/subscribe'
 */
subscribe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subscribe.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:294
 * @route '/subscriptions/cancel'
 */
export const cancel = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/subscriptions/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:294
 * @route '/subscriptions/cancel'
 */
cancel.url = (options?: RouteQueryOptions) => {
    return cancel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:294
 * @route '/subscriptions/cancel'
 */
cancel.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:333
 * @route '/subscriptions/resume'
 */
export const resume = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/subscriptions/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:333
 * @route '/subscriptions/resume'
 */
resume.url = (options?: RouteQueryOptions) => {
    return resume.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:333
 * @route '/subscriptions/resume'
 */
resume.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::swap
 * @see app/Http/Controllers/SubscriptionController.php:379
 * @route '/subscriptions/swap'
 */
export const swap = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: swap.url(options),
    method: 'post',
})

swap.definition = {
    methods: ["post"],
    url: '/subscriptions/swap',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::swap
 * @see app/Http/Controllers/SubscriptionController.php:379
 * @route '/subscriptions/swap'
 */
swap.url = (options?: RouteQueryOptions) => {
    return swap.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::swap
 * @see app/Http/Controllers/SubscriptionController.php:379
 * @route '/subscriptions/swap'
 */
swap.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: swap.url(options),
    method: 'post',
})
const subscriptions = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
subscribe: Object.assign(subscribe, subscribe),
cancel: Object.assign(cancel, cancel),
resume: Object.assign(resume, resume),
swap: Object.assign(swap, swap),
paddle: Object.assign(paddle, paddle),
}

export default subscriptions