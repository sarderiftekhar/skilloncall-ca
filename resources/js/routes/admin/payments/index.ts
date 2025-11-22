import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::index
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:22
 * @route '/admin/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::index
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:22
 * @route '/admin/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::index
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:22
 * @route '/admin/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::index
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:22
 * @route '/admin/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::show
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:37
 * @route '/admin/payments/{payment}'
 */
export const show = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::show
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:37
 * @route '/admin/payments/{payment}'
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
* @see \App\Http\Controllers\Admin\AdminPaymentController::show
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:37
 * @route '/admin/payments/{payment}'
 */
show.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::show
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:37
 * @route '/admin/payments/{payment}'
 */
show.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::process
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:50
 * @route '/admin/payments/{payment}/process'
 */
export const process = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: process.url(args, options),
    method: 'put',
})

process.definition = {
    methods: ["put"],
    url: '/admin/payments/{payment}/process',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::process
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:50
 * @route '/admin/payments/{payment}/process'
 */
process.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return process.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPaymentController::process
 * @see app/Http/Controllers/Admin/AdminPaymentController.php:50
 * @route '/admin/payments/{payment}/process'
 */
process.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: process.url(args, options),
    method: 'put',
})
const payments = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
process: Object.assign(process, process),
}

export default payments