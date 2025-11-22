import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::index
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:23
 * @route '/employee/skills'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/skills',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::index
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:23
 * @route '/employee/skills'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::index
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:23
 * @route '/employee/skills'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::index
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:23
 * @route '/employee/skills'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::store
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:36
 * @route '/employee/skills'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employee/skills',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::store
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:36
 * @route '/employee/skills'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::store
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:36
 * @route '/employee/skills'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::destroy
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:47
 * @route '/employee/skills/{skill}'
 */
export const destroy = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employee/skills/{skill}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::destroy
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:47
 * @route '/employee/skills/{skill}'
 */
destroy.url = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { skill: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { skill: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    skill: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return destroy.definition.url
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\EmployeeSkillController::destroy
 * @see app/Http/Controllers/Employee/EmployeeSkillController.php:47
 * @route '/employee/skills/{skill}'
 */
destroy.delete = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const skills = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default skills