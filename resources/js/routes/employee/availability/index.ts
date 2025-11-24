import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::index
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:17
 * @route '/employee/availability'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/availability',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::index
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:17
 * @route '/employee/availability'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::index
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:17
 * @route '/employee/availability'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::index
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:17
 * @route '/employee/availability'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::update
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:48
 * @route '/employee/availability'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employee/availability',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::update
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:48
 * @route '/employee/availability'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeAvailabilityController::update
 * @see app/Http/Controllers/Employee/EmployeeAvailabilityController.php:48
 * @route '/employee/availability'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const availability = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
}

export default availability