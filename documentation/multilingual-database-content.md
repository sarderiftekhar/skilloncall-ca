# Multilingual Database Content System

## Overview

SkillOnCall uses a hybrid approach for managing multilingual content:

1. **Translation Files** for static reference data (Provinces, Cities)
2. **JSON Columns** with `spatie/laravel-translatable` for dynamic data (Skills, Industries, Certifications, Languages)

This approach balances performance, maintainability, and scalability.

---

## Architecture

### Tier 1: Static Reference Data (Translation Files)

**Used for:** Provinces, Cities  
**Why:** Limited dataset, never changes, minimal memory footprint

**Files:**
- `resources/lang/en/geo.php` - English geographic terms
- `resources/lang/fr/geo.php` - French geographic terms

**Example:**
```php
// resources/lang/en/geo.php
'provinces' => [
    'QC' => 'Quebec',
    'ON' => 'Ontario',
],

// resources/lang/fr/geo.php
'provinces' => [
    'QC' => 'Québec',
    'ON' => 'Ontario',
],
```

**Usage:**
```php
$province = GlobalProvince::find(1); // { id: 1, code: 'QC' }
echo $province->translated_name; // "Quebec" or "Québec" based on locale
```

### Tier 2: Dynamic Searchable Data (JSON Columns)

**Used for:** Skills, Industries, Certifications, Languages  
**Why:** User-searchable, frequently added, needs database indexing

**Package:** `spatie/laravel-translatable` v6.11.4

**Models with Translations:**
- `GlobalSkill` - name, description
- `GlobalIndustry` - name, description
- `GlobalCertification` - name, issuing_authority
- `GlobalLanguage` - name

**Database Structure:**
```sql
-- Skills table with JSON columns
global_skills
├── id (INT)
├── name (JSON) → {"en": "Carpentry", "fr": "Menuiserie"}
├── description (JSON) → {"en": "...", "fr": "..."}
├── category (VARCHAR)
├── is_active (BOOLEAN)
```

**Model Implementation:**
```php
use Spatie\Translatable\HasTranslations;

class GlobalSkill extends Model
{
    use HasTranslations;
    
    public $translatable = ['name', 'description'];
}
```

---

## Usage Guide

### Adding New Translations

#### Static Data (Provinces/Cities)

Edit the translation files:

```php
// resources/lang/en/geo.php
'cities' => [
    'vancouver' => 'Vancouver',
],

// resources/lang/fr/geo.php
'cities' => [
    'vancouver' => 'Vancouver',
],
```

#### Dynamic Data (Skills/Industries)

```php
// Create with both languages at once
$skill = GlobalSkill::create([
    'name' => [
        'en' => 'Carpentry',
        'fr' => 'Menuiserie',
    ],
    'description' => [
        'en' => 'Wood construction',
        'fr' => 'Construction en bois',
    ],
    'category' => 'Construction',
    'is_active' => true,
]);

// Or set translations individually
$skill->setTranslation('name', 'en', 'Carpentry');
$skill->setTranslation('name', 'fr', 'Menuiserie');
$skill->save();
```

### Retrieving Translated Data

#### Automatic Translation (Based on User's Locale)

```php
// Set locale
app()->setLocale('fr');

// Retrieve automatically translated
$skill = GlobalSkill::find(1);
echo $skill->name; // "Menuiserie"

app()->setLocale('en');
echo $skill->name; // "Carpentry"
```

#### Specific Locale

```php
$skill = GlobalSkill::find(1);
echo $skill->getTranslation('name', 'fr'); // "Menuiserie"
echo $skill->getTranslation('name', 'en'); // "Carpentry"
```

#### Get All Translations

```php
$skill = GlobalSkill::find(1);
$allTranslations = $skill->getTranslations('name');
// ['en' => 'Carpentry', 'fr' => 'Menuiserie']
```

### Searching Translated Content

```php
// Search in specific language
GlobalSkill::where('name->en', 'LIKE', '%Carp%')->get();
GlobalSkill::where('name->fr', 'LIKE', '%Menu%')->get();

// Search in current locale
$locale = app()->getLocale();
GlobalSkill::where("name->{$locale}", 'LIKE', '%search%')->get();
```

---

## API Responses

All API endpoints automatically return data in the user's preferred locale:

### Skills API
```http
GET /employee/api/skills
Accept-Language: fr

Response:
[
  { "id": 1, "name": "Menuiserie", "category": "Construction" },
  { "id": 2, "name": "Plomberie", "category": "Construction" }
]
```

### Provinces API
```http
GET /api/location/provinces
Accept-Language: fr

Response:
[
  { "id": 1, "name": "Québec", "code": "QC" },
  { "id": 2, "name": "Ontario", "code": "ON" }
]
```

---

## Database Setup

### 1. Run Migrations

```bash
php artisan migrate
```

This will:
- Add `locale` column to `users` table
- Convert `name` and `description` columns to JSON in global reference tables

### 2. Seed Sample Data

```bash
php artisan db:seed --class=BilingualReferenceDataSeeder
```

This creates sample bilingual data for:
- 5 Skills (Carpentry, Plumbing, Electrical, Welding, Customer Service)
- 5 Industries (Construction, Hospitality, Healthcare, Manufacturing, Retail)
- 3 Certifications (Red Seal, Electrician, Food Handler)
- 4 Languages (English, French, Spanish, Mandarin)

---

## Frontend Integration

### Accessing Translated Data

```tsx
// In React components
const skills = await fetch('/employee/api/skills').then(r => r.json());
// Skills are already translated based on user's locale

skills.map(skill => (
    <option key={skill.id} value={skill.id}>
        {skill.name} {/* Already in correct language */}
    </option>
));
```

### Language Switching

When user changes language:
1. Update user's locale in database (via `/settings/locale`)
2. Store in localStorage
3. Reload page with `?lang=` parameter
4. All API calls return data in new language

---

## Performance Considerations

### Static Data (Translation Files)
- ✅ **Zero database queries** for provinces/cities
- ✅ **Loaded once** and cached by Laravel
- ✅ **Minimal memory** footprint
- ✅ **Fast** lookups

### Dynamic Data (JSON Columns)
- ⚠️ **Eloquent required** (can't use `toBase()->get()`)
- ✅ **Searchable** with MySQL JSON operators
- ✅ **Indexable** for performance
- ✅ **Memory efficient** (only stores needed translations)

### Optimization Tips

1. **Cache API responses:**
```php
public function getSkills() {
    return Cache::remember("skills_{$locale}", 3600, function() {
        return GlobalSkill::active()->ordered()->get();
    });
}
```

2. **Eager load translations:**
```php
GlobalSkill::with(['translations'])->get(); // If using translation table
```

3. **Select only needed languages:**
```php
// For bilingual apps, store only en/fr, not all languages
$skill->setTranslations('name', [
    'en' => 'Carpentry',
    'fr' => 'Menuiserie',
    // Don't store 'es', 'de', etc. if not needed
]);
```

---

## Adding New Languages

### Step 1: Create Translation File

```php
// resources/lang/es/geo.php
return [
    'provinces' => [
        'QC' => 'Quebec',
        'ON' => 'Ontario',
        // ...
    ],
];
```

### Step 2: Add Translations to Database

```php
$skill = GlobalSkill::find(1);
$skill->setTranslation('name', 'es', 'Carpintería');
$skill->save();
```

### Step 3: Update Language Switcher

Add Spanish to the language selection modal and settings page.

---

## Migration from English-Only

If you have existing English-only data:

```php
// Convert existing English data to JSON format
DB::table('global_skills')->get()->each(function ($skill) {
    DB::table('global_skills')
        ->where('id', $skill->id)
        ->update([
            'name' => json_encode(['en' => $skill->name]),
            'description' => json_encode(['en' => $skill->description]),
        ]);
});

// Then add French translations
GlobalSkill::all()->each(function ($skill) {
    $skill->setTranslation('name', 'fr', translate_to_french($skill->getTranslation('name', 'en')));
    $skill->save();
});
```

---

## Troubleshooting

### Issue: Translations not showing

**Check:**
1. Locale is set correctly: `app()->getLocale()`
2. Model has `HasTranslations` trait
3. Field is in `$translatable` array
4. Column is JSON type in database
5. Using Eloquent (not `toBase()->get()`)

### Issue: Search not working

**Solution:**
Use JSON extraction in queries:
```php
// ❌ Wrong
GlobalSkill::where('name', 'LIKE', '%term%')->get();

// ✅ Correct
GlobalSkill::where('name->en', 'LIKE', '%term%')->get();
```

### Issue: Performance problems

**Solutions:**
1. Cache translated data
2. Use `select()` to limit columns
3. Paginate results
4. Add database indexes on JSON columns (MySQL 5.7+)

---

## Best Practices

1. **Always provide both EN and FR** when creating data
2. **Use translation files** for static lists (<100 items)
3. **Use JSON columns** for user-generated or searchable content
4. **Cache API responses** for frequently accessed data
5. **Test with both locales** before deploying
6. **Validate translations** exist before saving

---

## References

- [Spatie Laravel Translatable Documentation](https://github.com/spatie/laravel-translatable)
- [Laravel Localization Guide](https://laravel.com/docs/localization)
- [MySQL JSON Functions](https://dev.mysql.com/doc/refman/8.0/en/json-function-reference.html)

