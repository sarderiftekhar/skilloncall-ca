import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import cities5ebe3c from './cities'
/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employee/api/provinces'
 */
export const provinces = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(options),
    method: 'get',
})

provinces.definition = {
    methods: ["get","head"],
    url: '/employee/api/provinces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employee/api/provinces'
 */
provinces.url = (options?: RouteQueryOptions) => {
    return provinces.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employee/api/provinces'
 */
provinces.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: provinces.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::provinces
 * @see app/Http/Controllers/LocationController.php:15
 * @route '/employee/api/provinces'
 */
provinces.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: provinces.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employee/api/provinces/{provinceId}/cities'
 */
export const cities = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(args, options),
    method: 'get',
})

cities.definition = {
    methods: ["get","head"],
    url: '/employee/api/provinces/{provinceId}/cities',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employee/api/provinces/{provinceId}/cities'
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
 * @route '/employee/api/provinces/{provinceId}/cities'
 */
cities.get = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cities.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocationController::cities
 * @see app/Http/Controllers/LocationController.php:31
 * @route '/employee/api/provinces/{provinceId}/cities'
 */
cities.head = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cities.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::skills
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:18
 * @route '/employee/api/skills'
 */
export const skills = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skills.url(options),
    method: 'get',
})

skills.definition = {
    methods: ["get","head"],
    url: '/employee/api/skills',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::skills
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:18
 * @route '/employee/api/skills'
 */
skills.url = (options?: RouteQueryOptions) => {
    return skills.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::skills
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:18
 * @route '/employee/api/skills'
 */
skills.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skills.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::skills
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:18
 * @route '/employee/api/skills'
 */
skills.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: skills.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::industries
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:38
 * @route '/employee/api/industries'
 */
export const industries = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: industries.url(options),
    method: 'get',
})

industries.definition = {
    methods: ["get","head"],
    url: '/employee/api/industries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::industries
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:38
 * @route '/employee/api/industries'
 */
industries.url = (options?: RouteQueryOptions) => {
    return industries.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::industries
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:38
 * @route '/employee/api/industries'
 */
industries.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: industries.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::industries
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:38
 * @route '/employee/api/industries'
 */
industries.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: industries.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::languages
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:57
 * @route '/employee/api/languages'
 */
export const languages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: languages.url(options),
    method: 'get',
})

languages.definition = {
    methods: ["get","head"],
    url: '/employee/api/languages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::languages
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:57
 * @route '/employee/api/languages'
 */
languages.url = (options?: RouteQueryOptions) => {
    return languages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::languages
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:57
 * @route '/employee/api/languages'
 */
languages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: languages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::languages
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:57
 * @route '/employee/api/languages'
 */
languages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: languages.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::certifications
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:78
 * @route '/employee/api/certifications'
 */
export const certifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certifications.url(options),
    method: 'get',
})

certifications.definition = {
    methods: ["get","head"],
    url: '/employee/api/certifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::certifications
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:78
 * @route '/employee/api/certifications'
 */
certifications.url = (options?: RouteQueryOptions) => {
    return certifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::certifications
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:78
 * @route '/employee/api/certifications'
 */
certifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: certifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\ReferenceDataController::certifications
 * @see app/Http/Controllers/Employee/ReferenceDataController.php:78
 * @route '/employee/api/certifications'
 */
certifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: certifications.url(options),
    method: 'head',
})
const api = {
    provinces: Object.assign(provinces, provinces),
cities: Object.assign(cities, cities5ebe3c),
skills: Object.assign(skills, skills),
industries: Object.assign(industries, industries),
languages: Object.assign(languages, languages),
certifications: Object.assign(certifications, certifications),
}

export default api