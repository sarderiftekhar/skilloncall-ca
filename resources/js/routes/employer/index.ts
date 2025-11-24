import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import onboarding from './onboarding'
import api from './api'
import jobs from './jobs'
import employees from './employees'
import applications from './applications'
import payments from './payments'
import messages from './messages'
import profile from './profile'
import reviews from './reviews'
/**
* @see \App\Http\Controllers\Employer\EmployerDashboardController::dashboard
 * @see app/Http/Controllers/Employer/EmployerDashboardController.php:20
 * @route '/employer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/employer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\EmployerDashboardController::dashboard
 * @see app/Http/Controllers/Employer/EmployerDashboardController.php:20
 * @route '/employer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\EmployerDashboardController::dashboard
 * @see app/Http/Controllers/Employer/EmployerDashboardController.php:20
 * @route '/employer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\EmployerDashboardController::dashboard
 * @see app/Http/Controllers/Employer/EmployerDashboardController.php:20
 * @route '/employer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})
const employer = {
    onboarding: Object.assign(onboarding, onboarding),
api: Object.assign(api, api),
dashboard: Object.assign(dashboard, dashboard),
jobs: Object.assign(jobs, jobs),
employees: Object.assign(employees, employees),
applications: Object.assign(applications, applications),
payments: Object.assign(payments, payments),
messages: Object.assign(messages, messages),
profile: Object.assign(profile, profile),
reviews: Object.assign(reviews, reviews),
}

export default employer