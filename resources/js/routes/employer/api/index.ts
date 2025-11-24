import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import cities5ebe3c from './cities'
/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employer/api/provinces'
 */
export const provinces = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(options),
    method: 'get',
})

provinces.definition = {
    methods: ["get","head"],
    url: '/employer/api/provinces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employer/api/provinces'
 */
provinces.url = (options?: RouteQueryOptions) => {
    return provinces.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employer/api/provinces'
 */
provinces.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employer/api/provinces'
 */
provinces.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: provinces.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employer/api/provinces/{provinceId}/cities'
 */
export const cities = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(args, options),
    method: 'get',
})

cities.definition = {
    methods: ["get","head"],
    url: '/employer/api/provinces/{provinceId}/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employer/api/provinces/{provinceId}/cities'
 */
cities.url = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provinceId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    provinceId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        provinceId: args.provinceId,
                }

    return cities.definition.url
            .replace('{provinceId}', parsedArgs.provinceId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employer/api/provinces/{provinceId}/cities'
 */
cities.get = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employer/api/provinces/{provinceId}/cities'
 */
cities.head = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cities.url(args, options),
    method: 'head',
})
const api = {
    provinces: Object.assign(provinces, provinces),
cities: Object.assign(cities, cities5ebe3c),
}

export default api