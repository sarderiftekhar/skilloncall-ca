import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminReportController::index
 * @see app/Http/Controllers/Admin/AdminReportController.php:21
 * @route '/admin/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminReportController::index
 * @see app/Http/Controllers/Admin/AdminReportController.php:21
 * @route '/admin/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminReportController::index
 * @see app/Http/Controllers/Admin/AdminReportController.php:21
 * @route '/admin/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminReportController::index
 * @see app/Http/Controllers/Admin/AdminReportController.php:21
 * @route '/admin/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminReportController::users
 * @see app/Http/Controllers/Admin/AdminReportController.php:33
 * @route '/admin/reports/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/reports/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminReportController::users
 * @see app/Http/Controllers/Admin/AdminReportController.php:33
 * @route '/admin/reports/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminReportController::users
 * @see app/Http/Controllers/Admin/AdminReportController.php:33
 * @route '/admin/reports/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminReportController::users
 * @see app/Http/Controllers/Admin/AdminReportController.php:33
 * @route '/admin/reports/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminReportController::jobs
 * @see app/Http/Controllers/Admin/AdminReportController.php:46
 * @route '/admin/reports/jobs'
 */
export const jobs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jobs.url(options),
    method: 'get',
})

jobs.definition = {
    methods: ["get","head"],
    url: '/admin/reports/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminReportController::jobs
 * @see app/Http/Controllers/Admin/AdminReportController.php:46
 * @route '/admin/reports/jobs'
 */
jobs.url = (options?: RouteQueryOptions) => {
    return jobs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminReportController::jobs
 * @see app/Http/Controllers/Admin/AdminReportController.php:46
 * @route '/admin/reports/jobs'
 */
jobs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jobs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminReportController::jobs
 * @see app/Http/Controllers/Admin/AdminReportController.php:46
 * @route '/admin/reports/jobs'
 */
jobs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jobs.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminReportController::payments
 * @see app/Http/Controllers/Admin/AdminReportController.php:59
 * @route '/admin/reports/payments'
 */
export const payments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})

payments.definition = {
    methods: ["get","head"],
    url: '/admin/reports/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminReportController::payments
 * @see app/Http/Controllers/Admin/AdminReportController.php:59
 * @route '/admin/reports/payments'
 */
payments.url = (options?: RouteQueryOptions) => {
    return payments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminReportController::payments
 * @see app/Http/Controllers/Admin/AdminReportController.php:59
 * @route '/admin/reports/payments'
 */
payments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminReportController::payments
 * @see app/Http/Controllers/Admin/AdminReportController.php:59
 * @route '/admin/reports/payments'
 */
payments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminReportController::exportMethod
 * @see app/Http/Controllers/Admin/AdminReportController.php:72
 * @route '/admin/reports/export/{type}'
 */
export const exportMethod = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/reports/export/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminReportController::exportMethod
 * @see app/Http/Controllers/Admin/AdminReportController.php:72
 * @route '/admin/reports/export/{type}'
 */
exportMethod.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                }

    return exportMethod.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminReportController::exportMethod
 * @see app/Http/Controllers/Admin/AdminReportController.php:72
 * @route '/admin/reports/export/{type}'
 */
exportMethod.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminReportController::exportMethod
 * @see app/Http/Controllers/Admin/AdminReportController.php:72
 * @route '/admin/reports/export/{type}'
 */
exportMethod.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})
const reports = {
    index: Object.assign(index, index),
users: Object.assign(users, users),
jobs: Object.assign(jobs, jobs),
payments: Object.assign(payments, payments),
export: Object.assign(exportMethod, exportMethod),
}

export default reports