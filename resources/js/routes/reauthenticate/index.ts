import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::verify
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:28
 * @route '/reauthenticate'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/reauthenticate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::verify
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:28
 * @route '/reauthenticate'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::verify
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:28
 * @route '/reauthenticate'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::check
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:78
 * @route '/reauthenticate/check'
 */
export const check = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/reauthenticate/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::check
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:78
 * @route '/reauthenticate/check'
 */
check.url = (options?: RouteQueryOptions) => {
    return check.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::check
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:78
 * @route '/reauthenticate/check'
 */
check.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\ReauthenticateController::check
 * @see app/Http/Controllers/Auth/ReauthenticateController.php:78
 * @route '/reauthenticate/check'
 */
check.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(options),
    method: 'head',
})
const reauthenticate = {
    verify: Object.assign(verify, verify),
check: Object.assign(check, check),
}

export default reauthenticate