import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::index
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:23
 * @route '/employee/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::index
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:23
 * @route '/employee/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::index
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:23
 * @route '/employee/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::index
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:23
 * @route '/employee/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::show
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:37
 * @route '/employee/payments/{payment}'
 */
export const show = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employee/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::show
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:37
 * @route '/employee/payments/{payment}'
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
* @see \App\Http\Controllers\Employee\EmployeePaymentController::show
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:37
 * @route '/employee/payments/{payment}'
 */
show.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::show
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:37
 * @route '/employee/payments/{payment}'
 */
show.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::request
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:51
 * @route '/employee/payments/request'
 */
export const request = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})

request.definition = {
    methods: ["post"],
    url: '/employee/payments/request',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::request
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:51
 * @route '/employee/payments/request'
 */
request.url = (options?: RouteQueryOptions) => {
    return request.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeePaymentController::request
 * @see app/Http/Controllers/Employee/EmployeePaymentController.php:51
 * @route '/employee/payments/request'
 */
request.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: request.url(options),
    method: 'post',
})
const payments = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
request: Object.assign(request, request),
}

export default payments