import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminJobController::index
 * @see app/Http/Controllers/Admin/AdminJobController.php:22
 * @route '/admin/jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminJobController::index
 * @see app/Http/Controllers/Admin/AdminJobController.php:22
 * @route '/admin/jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminJobController::index
 * @see app/Http/Controllers/Admin/AdminJobController.php:22
 * @route '/admin/jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminJobController::index
 * @see app/Http/Controllers/Admin/AdminJobController.php:22
 * @route '/admin/jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminJobController::show
 * @see app/Http/Controllers/Admin/AdminJobController.php:35
 * @route '/admin/jobs/{job}'
 */
export const show = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/jobs/{job}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminJobController::show
 * @see app/Http/Controllers/Admin/AdminJobController.php:35
 * @route '/admin/jobs/{job}'
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
* @see \App\Http\Controllers\Admin\AdminJobController::show
 * @see app/Http/Controllers/Admin/AdminJobController.php:35
 * @route '/admin/jobs/{job}'
 */
show.get = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminJobController::show
 * @see app/Http/Controllers/Admin/AdminJobController.php:35
 * @route '/admin/jobs/{job}'
 */
show.head = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminJobController::approve
 * @see app/Http/Controllers/Admin/AdminJobController.php:48
 * @route '/admin/jobs/{job}/approve'
 */
export const approve = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

approve.definition = {
    methods: ["put"],
    url: '/admin/jobs/{job}/approve',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminJobController::approve
 * @see app/Http/Controllers/Admin/AdminJobController.php:48
 * @route '/admin/jobs/{job}/approve'
 */
approve.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminJobController::approve
 * @see app/Http/Controllers/Admin/AdminJobController.php:48
 * @route '/admin/jobs/{job}/approve'
 */
approve.put = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\AdminJobController::reject
 * @see app/Http/Controllers/Admin/AdminJobController.php:59
 * @route '/admin/jobs/{job}/reject'
 */
export const reject = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reject.url(args, options),
    method: 'put',
})

reject.definition = {
    methods: ["put"],
    url: '/admin/jobs/{job}/reject',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminJobController::reject
 * @see app/Http/Controllers/Admin/AdminJobController.php:59
 * @route '/admin/jobs/{job}/reject'
 */
reject.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminJobController::reject
 * @see app/Http/Controllers/Admin/AdminJobController.php:59
 * @route '/admin/jobs/{job}/reject'
 */
reject.put = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reject.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\AdminJobController::destroy
 * @see app/Http/Controllers/Admin/AdminJobController.php:70
 * @route '/admin/jobs/{job}'
 */
export const destroy = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/jobs/{job}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminJobController::destroy
 * @see app/Http/Controllers/Admin/AdminJobController.php:70
 * @route '/admin/jobs/{job}'
 */
destroy.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminJobController::destroy
 * @see app/Http/Controllers/Admin/AdminJobController.php:70
 * @route '/admin/jobs/{job}'
 */
destroy.delete = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const jobs = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
destroy: Object.assign(destroy, destroy),
}

export default jobs