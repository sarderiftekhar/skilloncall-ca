import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import onboarding from './onboarding'
import api from './api'
import jobs from './jobs'
import applications from './applications'
import profile from './profile'
import skills from './skills'
import availability from './availability'
import payments from './payments'
import reviews from './reviews'
/**
* @see \App\Http\Controllers\Employee\EmployeeDashboardController::dashboard
 * @see app/Http/Controllers/Employee/EmployeeDashboardController.php:20
 * @route '/employee/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/employee/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeDashboardController::dashboard
 * @see app/Http/Controllers/Employee/EmployeeDashboardController.php:20
 * @route '/employee/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeDashboardController::dashboard
 * @see app/Http/Controllers/Employee/EmployeeDashboardController.php:20
 * @route '/employee/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeDashboardController::dashboard
 * @see app/Http/Controllers/Employee/EmployeeDashboardController.php:20
 * @route '/employee/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::savedJobs
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:148
 * @route '/employee/saved-jobs'
 */
export const savedJobs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedJobs.url(options),
    method: 'get',
})

savedJobs.definition = {
    methods: ["get","head"],
    url: '/employee/saved-jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::savedJobs
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:148
 * @route '/employee/saved-jobs'
 */
savedJobs.url = (options?: RouteQueryOptions) => {
    return savedJobs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::savedJobs
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:148
 * @route '/employee/saved-jobs'
 */
savedJobs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: savedJobs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeJobController::savedJobs
 * @see app/Http/Controllers/Employee/EmployeeJobController.php:148
 * @route '/employee/saved-jobs'
 */
savedJobs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: savedJobs.url(options),
    method: 'head',
})
const employee = {
    onboarding: Object.assign(onboarding, onboarding),
api: Object.assign(api, api),
dashboard: Object.assign(dashboard, dashboard),
jobs: Object.assign(jobs, jobs),
savedJobs: Object.assign(savedJobs, savedJobs),
applications: Object.assign(applications, applications),
profile: Object.assign(profile, profile),
skills: Object.assign(skills, skills),
availability: Object.assign(availability, availability),
payments: Object.assign(payments, payments),
reviews: Object.assign(reviews, reviews),
}

export default employee