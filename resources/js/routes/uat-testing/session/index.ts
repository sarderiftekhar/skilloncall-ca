import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UatTestingController::start
 * @see app/Http/Controllers/UatTestingController.php:130
 * @route '/uat-testing/session/start'
 */
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/uat-testing/session/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::start
 * @see app/Http/Controllers/UatTestingController.php:130
 * @route '/uat-testing/session/start'
 */
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::start
 * @see app/Http/Controllers/UatTestingController.php:130
 * @route '/uat-testing/session/start'
 */
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::end
 * @see app/Http/Controllers/UatTestingController.php:152
 * @route '/uat-testing/session/end'
 */
export const end = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(options),
    method: 'post',
})

end.definition = {
    methods: ["post"],
    url: '/uat-testing/session/end',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::end
 * @see app/Http/Controllers/UatTestingController.php:152
 * @route '/uat-testing/session/end'
 */
end.url = (options?: RouteQueryOptions) => {
    return end.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::end
 * @see app/Http/Controllers/UatTestingController.php:152
 * @route '/uat-testing/session/end'
 */
end.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: end.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::status
 * @see app/Http/Controllers/UatTestingController.php:179
 * @route '/uat-testing/session/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(options),
    method: 'post',
})

status.definition = {
    methods: ["post"],
    url: '/uat-testing/session/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::status
 * @see app/Http/Controllers/UatTestingController.php:179
 * @route '/uat-testing/session/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::status
 * @see app/Http/Controllers/UatTestingController.php:179
 * @route '/uat-testing/session/status'
 */
status.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: status.url(options),
    method: 'post',
})
const session = {
    start: Object.assign(start, start),
end: Object.assign(end, end),
status: Object.assign(status, status),
}

export default session