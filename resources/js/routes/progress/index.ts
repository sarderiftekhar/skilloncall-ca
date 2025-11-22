import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::index
 * @see app/Http/Controllers/SkillOnCallProgressController.php:29
 * @route '/progress'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::index
 * @see app/Http/Controllers/SkillOnCallProgressController.php:29
 * @route '/progress'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::index
 * @see app/Http/Controllers/SkillOnCallProgressController.php:29
 * @route '/progress'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::index
 * @see app/Http/Controllers/SkillOnCallProgressController.php:29
 * @route '/progress'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::create
 * @see app/Http/Controllers/SkillOnCallProgressController.php:69
 * @route '/progress/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/progress/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::create
 * @see app/Http/Controllers/SkillOnCallProgressController.php:69
 * @route '/progress/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::create
 * @see app/Http/Controllers/SkillOnCallProgressController.php:69
 * @route '/progress/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::create
 * @see app/Http/Controllers/SkillOnCallProgressController.php:69
 * @route '/progress/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::store
 * @see app/Http/Controllers/SkillOnCallProgressController.php:77
 * @route '/progress'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/progress',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::store
 * @see app/Http/Controllers/SkillOnCallProgressController.php:77
 * @route '/progress'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::store
 * @see app/Http/Controllers/SkillOnCallProgressController.php:77
 * @route '/progress'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::show
 * @see app/Http/Controllers/SkillOnCallProgressController.php:163
 * @route '/progress/{progress}'
 */
export const show = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/progress/{progress}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::show
 * @see app/Http/Controllers/SkillOnCallProgressController.php:163
 * @route '/progress/{progress}'
 */
show.url = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { progress: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    progress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        progress: args.progress,
                }

    return show.definition.url
            .replace('{progress}', parsedArgs.progress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::show
 * @see app/Http/Controllers/SkillOnCallProgressController.php:163
 * @route '/progress/{progress}'
 */
show.get = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::show
 * @see app/Http/Controllers/SkillOnCallProgressController.php:163
 * @route '/progress/{progress}'
 */
show.head = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::edit
 * @see app/Http/Controllers/SkillOnCallProgressController.php:176
 * @route '/progress/{progress}/edit'
 */
export const edit = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/progress/{progress}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::edit
 * @see app/Http/Controllers/SkillOnCallProgressController.php:176
 * @route '/progress/{progress}/edit'
 */
edit.url = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { progress: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    progress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        progress: args.progress,
                }

    return edit.definition.url
            .replace('{progress}', parsedArgs.progress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::edit
 * @see app/Http/Controllers/SkillOnCallProgressController.php:176
 * @route '/progress/{progress}/edit'
 */
edit.get = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::edit
 * @see app/Http/Controllers/SkillOnCallProgressController.php:176
 * @route '/progress/{progress}/edit'
 */
edit.head = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::update
 * @see app/Http/Controllers/SkillOnCallProgressController.php:191
 * @route '/progress/{progress}'
 */
export const update = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/progress/{progress}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::update
 * @see app/Http/Controllers/SkillOnCallProgressController.php:191
 * @route '/progress/{progress}'
 */
update.url = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { progress: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    progress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        progress: args.progress,
                }

    return update.definition.url
            .replace('{progress}', parsedArgs.progress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::update
 * @see app/Http/Controllers/SkillOnCallProgressController.php:191
 * @route '/progress/{progress}'
 */
update.put = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\SkillOnCallProgressController::update
 * @see app/Http/Controllers/SkillOnCallProgressController.php:191
 * @route '/progress/{progress}'
 */
update.patch = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::destroy
 * @see app/Http/Controllers/SkillOnCallProgressController.php:271
 * @route '/progress/{progress}'
 */
export const destroy = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/progress/{progress}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::destroy
 * @see app/Http/Controllers/SkillOnCallProgressController.php:271
 * @route '/progress/{progress}'
 */
destroy.url = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { progress: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    progress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        progress: args.progress,
                }

    return destroy.definition.url
            .replace('{progress}', parsedArgs.progress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::destroy
 * @see app/Http/Controllers/SkillOnCallProgressController.php:271
 * @route '/progress/{progress}'
 */
destroy.delete = (args: { progress: string | number } | [progress: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::uploadScreenshot
 * @see app/Http/Controllers/SkillOnCallProgressController.php:303
 * @route '/progress/upload-screenshot'
 */
export const uploadScreenshot = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadScreenshot.url(options),
    method: 'post',
})

uploadScreenshot.definition = {
    methods: ["post"],
    url: '/progress/upload-screenshot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::uploadScreenshot
 * @see app/Http/Controllers/SkillOnCallProgressController.php:303
 * @route '/progress/upload-screenshot'
 */
uploadScreenshot.url = (options?: RouteQueryOptions) => {
    return uploadScreenshot.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SkillOnCallProgressController::uploadScreenshot
 * @see app/Http/Controllers/SkillOnCallProgressController.php:303
 * @route '/progress/upload-screenshot'
 */
uploadScreenshot.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadScreenshot.url(options),
    method: 'post',
})
const progress = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
uploadScreenshot: Object.assign(uploadScreenshot, uploadScreenshot),
}

export default progress