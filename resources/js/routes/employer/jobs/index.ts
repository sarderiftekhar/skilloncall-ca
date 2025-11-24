import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerJobController::index
 * @see app/Http/Controllers/Employer/EmployerJobController.php:26
 * @route '/employer/jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::index
 * @see app/Http/Controllers/Employer/EmployerJobController.php:26
 * @route '/employer/jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::index
 * @see app/Http/Controllers/Employer/EmployerJobController.php:26
 * @route '/employer/jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerJobController::index
 * @see app/Http/Controllers/Employer/EmployerJobController.php:26
 * @route '/employer/jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::create
 * @see app/Http/Controllers/Employer/EmployerJobController.php:39
 * @route '/employer/jobs/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employer/jobs/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::create
 * @see app/Http/Controllers/Employer/EmployerJobController.php:39
 * @route '/employer/jobs/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::create
 * @see app/Http/Controllers/Employer/EmployerJobController.php:39
 * @route '/employer/jobs/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerJobController::create
 * @see app/Http/Controllers/Employer/EmployerJobController.php:39
 * @route '/employer/jobs/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::store
 * @see app/Http/Controllers/Employer/EmployerJobController.php:61
 * @route '/employer/jobs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/jobs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::store
 * @see app/Http/Controllers/Employer/EmployerJobController.php:61
 * @route '/employer/jobs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::store
 * @see app/Http/Controllers/Employer/EmployerJobController.php:61
 * @route '/employer/jobs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::show
 * @see app/Http/Controllers/Employer/EmployerJobController.php:72
 * @route '/employer/jobs/{job}'
 */
export const show = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/jobs/{job}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::show
 * @see app/Http/Controllers/Employer/EmployerJobController.php:72
 * @route '/employer/jobs/{job}'
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
* @see \App\Http\Controllers\Employer\EmployerJobController::show
 * @see app/Http/Controllers/Employer/EmployerJobController.php:72
 * @route '/employer/jobs/{job}'
 */
show.get = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerJobController::show
 * @see app/Http/Controllers/Employer/EmployerJobController.php:72
 * @route '/employer/jobs/{job}'
 */
show.head = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::edit
 * @see app/Http/Controllers/Employer/EmployerJobController.php:84
 * @route '/employer/jobs/{job}/edit'
 */
export const edit = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/jobs/{job}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::edit
 * @see app/Http/Controllers/Employer/EmployerJobController.php:84
 * @route '/employer/jobs/{job}/edit'
 */
edit.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::edit
 * @see app/Http/Controllers/Employer/EmployerJobController.php:84
 * @route '/employer/jobs/{job}/edit'
 */
edit.get = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerJobController::edit
 * @see app/Http/Controllers/Employer/EmployerJobController.php:84
 * @route '/employer/jobs/{job}/edit'
 */
edit.head = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::update
 * @see app/Http/Controllers/Employer/EmployerJobController.php:100
 * @route '/employer/jobs/{job}'
 */
export const update = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/jobs/{job}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::update
 * @see app/Http/Controllers/Employer/EmployerJobController.php:100
 * @route '/employer/jobs/{job}'
 */
update.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::update
 * @see app/Http/Controllers/Employer/EmployerJobController.php:100
 * @route '/employer/jobs/{job}'
 */
update.put = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::destroy
 * @see app/Http/Controllers/Employer/EmployerJobController.php:113
 * @route '/employer/jobs/{job}'
 */
export const destroy = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employer/jobs/{job}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::destroy
 * @see app/Http/Controllers/Employer/EmployerJobController.php:113
 * @route '/employer/jobs/{job}'
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
* @see \App\Http\Controllers\Employer\EmployerJobController::destroy
 * @see app/Http/Controllers/Employer/EmployerJobController.php:113
 * @route '/employer/jobs/{job}'
 */
destroy.delete = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::publish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:126
 * @route '/employer/jobs/{job}/publish'
 */
export const publish = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publish.url(args, options),
    method: 'put',
})

publish.definition = {
    methods: ["put"],
    url: '/employer/jobs/{job}/publish',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::publish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:126
 * @route '/employer/jobs/{job}/publish'
 */
publish.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::publish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:126
 * @route '/employer/jobs/{job}/publish'
 */
publish.put = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publish.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::unpublish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:139
 * @route '/employer/jobs/{job}/unpublish'
 */
export const unpublish = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: unpublish.url(args, options),
    method: 'put',
})

unpublish.definition = {
    methods: ["put"],
    url: '/employer/jobs/{job}/unpublish',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::unpublish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:139
 * @route '/employer/jobs/{job}/unpublish'
 */
unpublish.url = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return unpublish.definition.url
            .replace('{job}', parsedArgs.job.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerJobController::unpublish
 * @see app/Http/Controllers/Employer/EmployerJobController.php:139
 * @route '/employer/jobs/{job}/unpublish'
 */
unpublish.put = (args: { job: number | { id: number } } | [job: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: unpublish.url(args, options),
    method: 'put',
})
const jobs = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
publish: Object.assign(publish, publish),
unpublish: Object.assign(unpublish, unpublish),
}

export default jobs