import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UatTestingController::store
 * @see app/Http/Controllers/UatTestingController.php:245
 * @route '/uat-testing/custom-tests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/uat-testing/custom-tests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UatTestingController::store
 * @see app/Http/Controllers/UatTestingController.php:245
 * @route '/uat-testing/custom-tests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::store
 * @see app/Http/Controllers/UatTestingController.php:245
 * @route '/uat-testing/custom-tests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:299
 * @route '/uat-testing/custom-tests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/uat-testing/custom-tests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:299
 * @route '/uat-testing/custom-tests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:299
 * @route '/uat-testing/custom-tests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UatTestingController::index
 * @see app/Http/Controllers/UatTestingController.php:299
 * @route '/uat-testing/custom-tests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:318
 * @route '/uat-testing/custom-tests/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/uat-testing/custom-tests/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:318
 * @route '/uat-testing/custom-tests/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::update
 * @see app/Http/Controllers/UatTestingController.php:318
 * @route '/uat-testing/custom-tests/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UatTestingController::destroy
 * @see app/Http/Controllers/UatTestingController.php:341
 * @route '/uat-testing/custom-tests/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/uat-testing/custom-tests/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UatTestingController::destroy
 * @see app/Http/Controllers/UatTestingController.php:341
 * @route '/uat-testing/custom-tests/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UatTestingController::destroy
 * @see app/Http/Controllers/UatTestingController.php:341
 * @route '/uat-testing/custom-tests/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const customTests = {
    store: Object.assign(store, store),
index: Object.assign(index, index),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default customTests