import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\LocationController::code
 * @see app/Http/Controllers/LocationController.php:45
 * @route '/employer/api/provinces/code/{provinceCode}/cities'
 */
export const code = (args: { provinceCode: string | number } | [provinceCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: code.url(args, options),
    method: 'get',
})

code.definition = {
    methods: ["get","head"],
    url: '/employer/api/provinces/code/{provinceCode}/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::code
 * @see app/Http/Controllers/LocationController.php:45
 * @route '/employer/api/provinces/code/{provinceCode}/cities'
 */
code.url = (args: { provinceCode: string | number } | [provinceCode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provinceCode: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    provinceCode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        provinceCode: args.provinceCode,
                }

    return code.definition.url
            .replace('{provinceCode}', parsedArgs.provinceCode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::code
 * @see app/Http/Controllers/LocationController.php:45
 * @route '/employer/api/provinces/code/{provinceCode}/cities'
 */
code.get = (args: { provinceCode: string | number } | [provinceCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: code.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::code
 * @see app/Http/Controllers/LocationController.php:45
 * @route '/employer/api/provinces/code/{provinceCode}/cities'
 */
code.head = (args: { provinceCode: string | number } | [provinceCode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: code.url(args, options),
    method: 'head',
})
const by = {
    code: Object.assign(code, code),
}

export default by