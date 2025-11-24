import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import session from './session'
import customTests from './custom-tests'
import admin from './admin'
/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:20
 * @route '/uat-testing'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/uat-testing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:20
 * @route '/uat-testing'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:20
 * @route '/uat-testing'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:20
 * @route '/uat-testing'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:57
 * @route '/uat-testing/update'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/uat-testing/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:57
 * @route '/uat-testing/update'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:57
 * @route '/uat-testing/update'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::logAction
 * @see app/Http/Controllers/UatTestingController.php:212
 * @route '/uat-testing/log-action'
 */
export const logAction = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logAction.url(options),
    method: 'post',
})

logAction.definition = {
    methods: ["post"],
    url: '/uat-testing/log-action',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::logAction
 * @see app/Http/Controllers/UatTestingController.php:212
 * @route '/uat-testing/log-action'
 */
logAction.url = (options?: RouteQueryOptions) => {
    return logAction.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::logAction
 * @see app/Http/Controllers/UatTestingController.php:212
 * @route '/uat-testing/log-action'
 */
logAction.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logAction.url(options),
    method: 'post',
})
const uatTesting = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
session: Object.assign(session, session),
logAction: Object.assign(logAction, logAction),
customTests: Object.assign(customTests, customTests),
admin: Object.assign(admin, admin),
}

export default uatTesting