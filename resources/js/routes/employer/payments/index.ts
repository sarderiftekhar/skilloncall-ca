import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::index
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:23
 * @route '/employer/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::index
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:23
 * @route '/employer/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::index
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:23
 * @route '/employer/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::index
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:23
 * @route '/employer/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::show
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:36
 * @route '/employer/payments/{payment}'
 */
export const show = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::show
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:36
 * @route '/employer/payments/{payment}'
 */
show.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return show.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::show
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:36
 * @route '/employer/payments/{payment}'
 */
show.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::show
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:36
 * @route '/employer/payments/{payment}'
 */
show.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::store
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:50
 * @route '/employer/payments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::store
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:50
 * @route '/employer/payments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerPaymentController::store
 * @see app/Http/Controllers/Employer/EmployerPaymentController.php:50
 * @route '/employer/payments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const payments = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
store: Object.assign(store, store),
}

export default payments