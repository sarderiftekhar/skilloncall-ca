import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExceptionLogController::index
 * @see app/Http/Controllers/Admin/ExceptionLogController.php:13
 * @route '/admin/logs/exceptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/logs/exceptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExceptionLogController::index
 * @see app/Http/Controllers/Admin/ExceptionLogController.php:13
 * @route '/admin/logs/exceptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExceptionLogController::index
 * @see app/Http/Controllers/Admin/ExceptionLogController.php:13
 * @route '/admin/logs/exceptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExceptionLogController::index
 * @see app/Http/Controllers/Admin/ExceptionLogController.php:13
 * @route '/admin/logs/exceptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const exceptions = {
    index: Object.assign(index, index),
}

export default exceptions