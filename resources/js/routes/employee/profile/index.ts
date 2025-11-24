import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import portfolio from './portfolio'
/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::show
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:20
 * @route '/employee/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employee/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::show
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:20
 * @route '/employee/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::show
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:20
 * @route '/employee/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::show
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:20
 * @route '/employee/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::edit
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:55
 * @route '/employee/profile/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employee/profile/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::edit
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:55
 * @route '/employee/profile/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::edit
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:55
 * @route '/employee/profile/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::edit
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:55
 * @route '/employee/profile/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::update
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:83
 * @route '/employee/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employee/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::update
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:83
 * @route '/employee/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::update
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:83
 * @route '/employee/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const profile = {
    show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
portfolio: Object.assign(portfolio, portfolio),
}

export default profile