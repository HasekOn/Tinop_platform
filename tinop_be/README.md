# Popis projektu a cíle práce

Tento projekt je aplikace pro malé firmy, která pomáhá s digitalizací a centralizací všech firemních procesů.

Do budoucna je aplikace zamýšlena jako samostatné řešení pro jednoho uživatele nebo malý tým.

Aplikace obsahuje čtyři záložky:

1. **Tasks** – slouží pro správu úkolů přiřazených přímo mně. Úkoly lze filtrovat a řadit podle různých kritérií.
2. **Projects** – umožňuje seskupovat úkoly do projektů, což zvyšuje přehlednost a soukromí.
3. **TimeSheet** – přehled pracovní doby, kde se podle konfigurace automaticky zobrazují informace, zda uživatel pracuje
   z kanceláře, z home office, je na dovolené apod.
4. **Ideas** – nástěnka pro nápady; každý uživatel zde může připnout svůj návrh (například: „Jdu na čínu, kdo se
   přidá?“) nebo zde sdílet tipy na zlepšení firmy či upomínky.

# Architektura systému

Tento projekt je back-endová aplikace napsaná v Laravelu, vystavující RESTful API pro navazující front-end.

## 1. Hlavní vrstvy a součásti

1. **Routing**
    - `routes/api.php` definuje všechny API cesty.
    - Každá trasa je chráněna pomocí Laravel Sanctum a middleware pro ověřování uživatelů.

2. **Kontrolery (Controllers)**
    - Po autorizaci volají jednotlivé metody kontrolerů.
    - Každý kontroler je zodpovědný za konkrétní entitu (např. `TaskController`, `ProjectController`).

3. **Politiky (Policies)**
    - Ve složce `app/Policies` se kontroluje, zda má uživatel právo na danou operaci (čtení, úprava, odstranění).

4. **Data modely (Models)**
    - `app/Models` obsahuje Eloquent modely připojené k databázovým tabulkám.
    - Každý model definuje vztahy (hasMany, belongsTo, atd.).

5. **Filtry a dotazy (Filters & Queries)**
    - Ve složce `app/Filters` jsou třídy, které podle vstupních parametrů upravují Eloquent dotazy (filtrování, řazení,
      stránkování).

6. **Resource třídy (Resources)**
    - `app/Http/Resources` formátují výstup do JSON struktury (tzv. JSON API).

7. **Databázové migrace a seedy (Migrations & Seeders)**
    - `database/migrations` pro strukturu tabulek.
    - `database/seeders` pro výchozí data v testovacím/development prostředí.

8. **Konfigurace a prostředí**
    - `.env` pro citlivé údaje (DB, mail, třetí strany).
    - `config/*` pro přizpůsobení chování frameworku a balíčků.

## 2. Průběh requestu

1. **Klient** pošle HTTP požadavek na `/api/...`.
2. Laravel Sanctum middleware ověří token a načte uživatele.
3. Z routing souboru se vybere správný kontroler a metoda.
4. Politika zkontroluje oprávnění.
5. Model společně s filtrem sestaví dotaz do DB.
6. Resource třída vrátí naformátovaná data jako JSON.
7. Middleware pro logování/nahrávání chyb zachytí případné výjimky.

# Bezpečnostní mechanismy

Pro zabezpečení API a ochranu citlivých dat aplikace využívá:

- **Autentizace a autorizace**
    - Laravel Sanctum pro správu a validaci API tokenů
    - Middleware `auth:sanctum` zajišťuje přístup pouze pro přihlášené uživatele

- **Šifrování komunikace**
    - Vynucené HTTPS v produkčním prostředí pomocí `URL::forceScheme('https')`

- **Ochrana proti masivnímu přiřazení (Mass Assignment)**
    - Validace vstupních dat pomocí Form Request tříd
    - Nastavení `$fillable` a `$hidden` v Eloquent modelech

- **Autorizace zdrojů (Policies)**
    - Policy třídy kontrolují oprávnění uživatele pro každou akci (zobrazení, úprava, smazání)

- **Rate limiting**
    - Omezení počtu požadavků na citlivé endpointy pomocí Laravel throttle middleware

- **Logování a zpracování chyb**
    - Vlastní Exception Handler (`app/Exceptions/Handler.php`) vrací jednotné JSON odpovědi
    - Logování bezpečnostních událostí do Laravel logů

# Ukázky validace a zpětné vazby API

Všechny třídy pro validaci najdeš ve složce 'tinop_be/app/Http/Requests'

Zde je ukázka správné a špatné odpovědi na tasks enpoint pro vytvořeni tásku

POST /api/tasks HTTP/1.1
Content-Type: application/json

```JSON
{
    "name": "Implement user authentication",
    "status": "TO DO",
    "effort": "HARD",
    "priority": "MEDIUM",
    "timeEst": "20. 03. 2026",
    "description": "I am description"
}
```

HTTP/1.1 201 Created
Content-Type: application/json

```JSON
{
    "data": {
        "id": 1,
        "name": "Implement user authentication",
        "status": "TO DO",
        "effort": "HARD",
        "priority": "MEDIUM",
        "timeEst": "20. 03. 2026",
        "description": "I am description"
    }
}
```

HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

```JSON
{
    "message": "The given data was invalid.",
    "errors": {
        "name": [
            "The name field is required."
        ],
        "status": [
            "The selected status is invalid."
        ],
        "effort": [
            "The selected status is invalid."
        ],
        "priority": [
            "The selected priority is invalid."
        ],
        "timeEst": [
            "The time est must be Date"
        ]
    }
}
```

# Informace o logování a monitoringu

Aplikace využívá vestavěný Laravel logger (Monolog) pro záznam událostí do různých kanálů definovaných v
`config/logging.php`.

Hlavní body:

- **Logovací kanály**
    - `single` pro jednoduché soubory s otočným zapisováním
    - `daily` pro denní rotaci logů
    - `stack` pro kombinaci více kanálů (např. soubory + Slack)

- **Úrovně logování**
    - `debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`
    - Doporučeno používat `info` pro běžné události a `error`+ pro zachycení výjimek

- **Monitoring chyb a výjimek**
    - Integrace s externími službami (např. Sentry, Bugsnag) přes Laravel balíčky
    - V reálném čase upozornění na kritické chyby přímo do Slack/Teams kanálu

- **Laravel Telescope** *(volitelně)*
    - Záznam HTTP požadavků, databázových dotazů, výjimek, mailů a více
    - Grafické rozhraní pro snadnou analýzu během vývoje

Takový přístup zajistí, že budete mít vždy přehled o tom, co se v aplikaci děje, a rychle odhalíte i ty nejkritičtější
problémy.

# Odkaz na generovanou API dokumentaci

API dokumentace není generována externím nástrojem. Veškeré veřejné metody jsou detailně okomentovány pomocí PHPDoc s
direktivou `@inheritDoc`, díky čemuž je struktura a účel každé třídy a metody patrný přímo ve zdrojovém kódu.  

