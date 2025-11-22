import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::index
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:24
 * @route '/employer/employees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::index
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:24
 * @route '/employer/employees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::index
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:24
 * @route '/employer/employees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::index
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:24
 * @route '/employer/employees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::show
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:39
 * @route '/employer/employees/{employee}'
 */
export const show = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::show
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:39
 * @route '/employer/employees/{employee}'
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
* @see \App\Http\Controllers\Employer\EmployerWorkerController::show
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:39
 * @route '/employer/employees/{employee}'
 */
show.get = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::show
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:39
 * @route '/employer/employees/{employee}'
 */
show.head = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::hire
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:61
 * @route '/employer/employees/{employee}/hire'
 */
export const hire = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hire.url(args, options),
    method: 'post',
})

hire.definition = {
    methods: ["post"],
    url: '/employer/employees/{employee}/hire',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::hire
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:61
 * @route '/employer/employees/{employee}/hire'
 */
hire.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return hire.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::hire
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:61
 * @route '/employer/employees/{employee}/hire'
 */
hire.post = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hire.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::rate
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:72
 * @route '/employer/employees/{employee}/rate'
 */
export const rate = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: rate.url(args, options),
    method: 'put',
})

rate.definition = {
    methods: ["put"],
    url: '/employer/employees/{employee}/rate',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::rate
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:72
 * @route '/employer/employees/{employee}/rate'
 */
rate.url = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rate.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerWorkerController::rate
 * @see app/Http/Controllers/Employer/EmployerWorkerController.php:72
 * @route '/employer/employees/{employee}/rate'
 */
rate.put = (args: { employee: string | number } | [employee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: rate.url(args, options),
    method: 'put',
})
const employees = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
hire: Object.assign(hire, hire),
rate: Object.assign(rate, rate),
}

export default employees