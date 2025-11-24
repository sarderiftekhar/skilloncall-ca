import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::index
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:22
 * @route '/employer/applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::index
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:22
 * @route '/employer/applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::index
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:22
 * @route '/employer/applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::index
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:22
 * @route '/employer/applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::show
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:35
 * @route '/employer/applications/{application}'
 */
export const show = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/applications/{application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::show
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:35
 * @route '/employer/applications/{application}'
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
* @see \App\Http\Controllers\Employer\EmployerApplicationController::show
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:35
 * @route '/employer/applications/{application}'
 */
show.get = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::show
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:35
 * @route '/employer/applications/{application}'
 */
show.head = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::accept
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:49
 * @route '/employer/applications/{application}/accept'
 */
export const accept = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: accept.url(args, options),
    method: 'put',
})

accept.definition = {
    methods: ["put"],
    url: '/employer/applications/{application}/accept',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::accept
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:49
 * @route '/employer/applications/{application}/accept'
 */
accept.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return accept.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::accept
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:49
 * @route '/employer/applications/{application}/accept'
 */
accept.put = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: accept.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::reject
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:62
 * @route '/employer/applications/{application}/reject'
 */
export const reject = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reject.url(args, options),
    method: 'put',
})

reject.definition = {
    methods: ["put"],
    url: '/employer/applications/{application}/reject',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::reject
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:62
 * @route '/employer/applications/{application}/reject'
 */
reject.url = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerApplicationController::reject
 * @see app/Http/Controllers/Employer/EmployerApplicationController.php:62
 * @route '/employer/applications/{application}/reject'
 */
reject.put = (args: { application: number | { id: number } } | [application: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reject.url(args, options),
    method: 'put',
})
const applications = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
accept: Object.assign(accept, accept),
reject: Object.assign(reject, reject),
}

export default applications