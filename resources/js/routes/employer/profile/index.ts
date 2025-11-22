import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::show
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:21
 * @route '/employer/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::show
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:21
 * @route '/employer/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::show
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:21
 * @route '/employer/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::show
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:21
 * @route '/employer/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::edit
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:33
 * @route '/employer/profile/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/profile/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::edit
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:33
 * @route '/employer/profile/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::edit
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:33
 * @route '/employer/profile/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::edit
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:33
 * @route '/employer/profile/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::update
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:45
 * @route '/employer/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::update
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:45
 * @route '/employer/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerProfileController::update
 * @see app/Http/Controllers/Employer/EmployerProfileController.php:45
 * @route '/employer/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const profile = {
    show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default profile