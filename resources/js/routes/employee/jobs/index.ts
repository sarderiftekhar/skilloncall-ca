import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::index
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:19
 * @route '/employee/jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::index
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:19
 * @route '/employee/jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::index
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:19
 * @route '/employee/jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::index
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:19
 * @route '/employee/jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::show
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:120
 * @route '/employee/jobs/{job}'
 */
export const show = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employee/jobs/{job}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::show
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:120
 * @route '/employee/jobs/{job}'
 */
show.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { job: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    job: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job: typeof args.job === 'object'
                ? args.job.id
                : args.job,
                }

    return show.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::show
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:120
 * @route '/employee/jobs/{job}'
 */
show.get = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::show
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:120
 * @route '/employee/jobs/{job}'
 */
show.head = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::apply
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:130
 * @route '/employee/jobs/{job}/apply'
 */
export const apply = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/employee/jobs/{job}/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::apply
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:130
 * @route '/employee/jobs/{job}/apply'
 */
apply.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { job: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    job: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job: typeof args.job === 'object'
                ? args.job.id
                : args.job,
                }

    return apply.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::apply
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:130
 * @route '/employee/jobs/{job}/apply'
 */
apply.post = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::search
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:140
 * @route '/employee/jobs/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/employee/jobs/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::search
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:140
 * @route '/employee/jobs/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::search
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:140
 * @route '/employee/jobs/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::search
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:140
 * @route '/employee/jobs/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::save
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:180
 * @route '/employee/jobs/{job}/save'
 */
export const save = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/employee/jobs/{job}/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::save
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:180
 * @route '/employee/jobs/{job}/save'
 */
save.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { job: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    job: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job: typeof args.job === 'object'
                ? args.job.id
                : args.job,
                }

    return save.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::save
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:180
 * @route '/employee/jobs/{job}/save'
 */
save.post = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::unsave
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:202
 * @route '/employee/jobs/{job}/unsave'
 */
export const unsave = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unsave.url(args, options),
    method: 'delete',
})

unsave.definition = {
    methods: ["delete"],
    url: '/employee/jobs/{job}/unsave',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::unsave
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:202
 * @route '/employee/jobs/{job}/unsave'
 */
unsave.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { job: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    job: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job: typeof args.job === 'object'
                ? args.job.id
                : args.job,
                }

    return unsave.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::unsave
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:202
 * @route '/employee/jobs/{job}/unsave'
 */
unsave.delete = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unsave.url(args, options),
    method: 'delete',
})
const jobs = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
apply: Object.assign(apply, apply),
search: Object.assign(search, search),
save: Object.assign(save, save),
unsave: Object.assign(unsave, unsave),
}

export default jobs