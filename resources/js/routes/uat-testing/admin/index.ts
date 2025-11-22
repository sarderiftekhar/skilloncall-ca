import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UatTestingController::login
 * @see app/Http/Controllers/UatTestingController.php:365
 * @route '/uat-testing/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/uat-testing/admin/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::login
 * @see app/Http/Controllers/UatTestingController.php:365
 * @route '/uat-testing/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::login
 * @see app/Http/Controllers/UatTestingController.php:365
 * @route '/uat-testing/admin/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::logout
 * @see app/Http/Controllers/UatTestingController.php:467
 * @route '/uat-testing/admin/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/uat-testing/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::logout
 * @see app/Http/Controllers/UatTestingController.php:467
 * @route '/uat-testing/admin/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::logout
 * @see app/Http/Controllers/UatTestingController.php:467
 * @route '/uat-testing/admin/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::records
 * @see app/Http/Controllers/UatTestingController.php:396
 * @route '/uat-testing/admin/records'
 */
export const records = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})

records.definition = {
    methods: ["get","head"],
    url: '/uat-testing/admin/records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UatTestingController::records
 * @see app/Http/Controllers/UatTestingController.php:396
 * @route '/uat-testing/admin/records'
 */
records.url = (options?: RouteQueryOptions) => {
    return records.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::records
 * @see app/Http/Controllers/UatTestingController.php:396
 * @route '/uat-testing/admin/records'
 */
records.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: records.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UatTestingController::records
 * @see app/Http/Controllers/UatTestingController.php:396
 * @route '/uat-testing/admin/records'
 */
records.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: records.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UatTestingController::checkAuth
 * @see app/Http/Controllers/UatTestingController.php:457
 * @route '/uat-testing/admin/check-auth'
 */
export const checkAuth = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkAuth.url(options),
    method: 'get',
})

checkAuth.definition = {
    methods: ["get","head"],
    url: '/uat-testing/admin/check-auth',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UatTestingController::checkAuth
 * @see app/Http/Controllers/UatTestingController.php:457
 * @route '/uat-testing/admin/check-auth'
 */
checkAuth.url = (options?: RouteQueryOptions) => {
    return checkAuth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::checkAuth
 * @see app/Http/Controllers/UatTestingController.php:457
 * @route '/uat-testing/admin/check-auth'
 */
checkAuth.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkAuth.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UatTestingController::checkAuth
 * @see app/Http/Controllers/UatTestingController.php:457
 * @route '/uat-testing/admin/check-auth'
 */
checkAuth.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkAuth.url(options),
    method: 'head',
})
const admin = {
    login: Object.assign(login, login),
logout: Object.assign(logout, logout),
records: Object.assign(records, records),
checkAuth: Object.assign(checkAuth, checkAuth),
}

export default admin