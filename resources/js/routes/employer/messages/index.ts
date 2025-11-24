import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::index
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:21
 * @route '/employer/messages'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::index
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:21
 * @route '/employer/messages'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::index
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:21
 * @route '/employer/messages'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::index
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:21
 * @route '/employer/messages'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::show
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:35
 * @route '/employer/messages/{employee}'
 */
export const show = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/messages/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::show
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:35
 * @route '/employer/messages/{employee}'
 */
show.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: args.employee,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::show
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:35
 * @route '/employer/messages/{employee}'
 */
show.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::show
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:35
 * @route '/employer/messages/{employee}'
 */
show.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::store
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:53
 * @route '/employer/messages'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::store
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:53
 * @route '/employer/messages'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::store
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:53
 * @route '/employer/messages'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::markAsRead
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:75
 * @route '/employer/messages/{employee}/read'
 */
export const markAsRead = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: markAsRead.url(args, options),
    method: 'put',
})

markAsRead.definition = {
    methods: ["put"],
    url: '/employer/messages/{employee}/read',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::markAsRead
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:75
 * @route '/employer/messages/{employee}/read'
 */
markAsRead.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: args.employee,
                }

    return markAsRead.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerMessageController::markAsRead
 * @see app/Http/Controllers/Employer/EmployerMessageController.php:75
 * @route '/employer/messages/{employee}/read'
 */
markAsRead.put = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: markAsRead.url(args, options),
    method: 'put',
})
const messages = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
store: Object.assign(store, store),
markAsRead: Object.assign(markAsRead, markAsRead),
}

export default messages