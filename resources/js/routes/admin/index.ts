import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import users from './users'
import jobs from './jobs'
import payments from './payments'
import reports from './reports'
import logs from './logs'
import settings from './settings'
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:20
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:20
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:20
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::dashboard
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:20
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
users: Object.assign(users, users),
jobs: Object.assign(jobs, jobs),
payments: Object.assign(payments, payments),
reports: Object.assign(reports, reports),
logs: Object.assign(logs, logs),
settings: Object.assign(settings, settings),
}

export default admin