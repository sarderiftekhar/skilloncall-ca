import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::index
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:22
 * @route '/employee/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::index
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:22
 * @route '/employee/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::index
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:22
 * @route '/employee/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::index
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:22
 * @route '/employee/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::show
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:35
 * @route '/employee/applications/{application}'
 */
export const show = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employee/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::show
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:35
 * @route '/employee/applications/{application}'
 */
show.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return show.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::show
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:35
 * @route '/employee/applications/{application}'
 */
show.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::show
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:35
 * @route '/employee/applications/{application}'
 */
show.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::withdraw
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:49
 * @route '/employee/applications/{application}/withdraw'
 */
export const withdraw = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: withdraw.url(args, options),
    method: 'put',
})

withdraw.definition = {
    methods: ["put"],
    url: '/employee/applications/{application}/withdraw',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::withdraw
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:49
 * @route '/employee/applications/{application}/withdraw'
 */
withdraw.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return withdraw.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::withdraw
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:49
 * @route '/employee/applications/{application}/withdraw'
 */
withdraw.put = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: withdraw.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::complete
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:62
 * @route '/employee/applications/{application}/complete'
 */
export const complete = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: complete.url(args, options),
    method: 'put',
})

complete.definition = {
    methods: ["put"],
    url: '/employee/applications/{application}/complete',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::complete
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:62
 * @route '/employee/applications/{application}/complete'
 */
complete.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return complete.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeApplicationController::complete
 * @see app/Http/Controllers/Employee/EmployeeApplicationController.php:62
 * @route '/employee/applications/{application}/complete'
 */
complete.put = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: complete.url(args, options),
    method: 'put',
})
const applications = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
withdraw: Object.assign(withdraw, withdraw),
complete: Object.assign(complete, complete),
}

export default applications