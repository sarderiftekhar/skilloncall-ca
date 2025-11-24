import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::add
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/employee/profile/portfolio',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::add
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::add
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio'
 */
add.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::remove
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio/{portfolio}'
 */
export const remove = (args: { portfolio: string | number } | [portfolio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/employee/profile/portfolio/{portfolio}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::remove
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio/{portfolio}'
 */
remove.url = (args: { portfolio: string | number } | [portfolio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { portfolio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    portfolio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        portfolio: args.portfolio,
                }

    return remove.definition.url
            .replace('{portfolio}', parsedArgs.portfolio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeProfileController::remove
 * @see app/Http/Controllers/Employee/EmployeeProfileController.php:0
 * @route '/employee/profile/portfolio/{portfolio}'
 */
remove.delete = (args: { portfolio: string | number } | [portfolio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})
const portfolio = {
    add: Object.assign(add, add),
remove: Object.assign(remove, remove),
}

export default portfolio