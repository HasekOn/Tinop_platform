# Software Design Document

Tento dokument popisuje návrh softwarové architektury a klíčových komponent aplikace **Tino Platform**. Je určen pro vývojový tým, testery i administrátory a navazuje na uživatelskou i administrátorskou příručku.

---

## 1. Úvod

Dokument shrnuje cíle, rozsah a základní architektonické principy aplikace Ratio Platform.

## 2. Cíle a rozsah

* **Popis modulů**: Definovat hlavní moduly a jejich interakce.
* **Datový model**: Uvést strukturu databáze.
* **API**: Specifikovat REST rozhraní.
* **Nasazení**: Popis technologie a nasazovací scénáře.

---

## 3. Přehled architektury

Aplikace je třívrstvá webová aplikace postavená na frameworku Laravel (PHP) s databází MySQL. Klientská část je realizována jako SPA v JavaScriptu (Vue.js/React).

### 3.1. Vrstvy

1. **Prezentace**: SPA v JavaScriptu (Vue.js/React)
2. **Obchodní logika**: Laravel Controllers, Services
3. **Datová vrstva**: Eloquent ORM, MySQL

---

## 4. Modul Autentizace

### 4.1. Registrace a přihlášení

* Formulář registrace s validací emailu.
* Emailová verifikace pomocí Laravel Notifications.
* Přihlášení a správa relací přes Laravel Auth.

### 4.2. Role a autorizace

* Role: `user`, `admin`.
* Middleware pro ochranu rout.

---

## 5. Modul Tasks

### 5.1. Use case scénáře

* **Vytvoření úkolu**: `POST /api/tasks`.
* **Seznam úkolů**: `GET /api/tasks`.
* **Filtrování**: `GET /api/tasks?status={status}`.
* **Detail úkolu**: `GET /api/tasks/{id}`.

### 5.2. Datový model

```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open','in_progress','done') DEFAULT 'open',
  user_id INT NOT NULL,
  project_id INT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

## 6. Modul Projects

### 6.1. Use case scénáře

* **Vytvoření projektu**: `POST /api/projects`.
* **Pozvání uživatele**: `POST /api/projects/{id}/invite`.
* **Přijetí pozvánky**: `POST /api/invitations/{token}/accept`.
* **Správa členů**: `GET/DELETE /api/projects/{id}/members`.
* **Úkoly v projektu**: CRUD operace analogické modulu Tasks.

### 6.2. Datový model

```sql
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  owner_id INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE invitations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL,
  status ENUM('pending','accepted','declined') DEFAULT 'pending',
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE project_user (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('member','admin') DEFAULT 'member',
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 7. Modul Profil

### 7.1. Zobrazení a editace profilu

* **Získání detailu**: `GET /api/users/{id}`.
* **Úprava vlastního profilu**: `PUT /api/users/{id}`.
* Avatar generovaný z iniciál.

### 7.2. Datový model

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(512),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 8. Modul TimeSheet

### 8.1. Use case scénáře

* **Nastavení statusu**: `POST /api/timesheet`.
* **Typy statusů**:

    * `office`
    * `homeoffice`
    * `vacation`
    * `unavailable`
* Volitelná zpráva pro tým.

### 8.2. Datový model

```sql
CREATE TABLE timesheet_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('office','homeoffice','vacation','unavailable') NOT NULL,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 9. Modul Idea Page

### 9.1. Use case scénáře

* **Vytvoření příspěvku**: `POST /api/ideas`.
* **Komentáře**: `POST /api/ideas/{id}/comments`.
* **Reakce**: `POST /api/ideas/{id}/react`.

### 9.2. Datový model

```sql
CREATE TABLE ideas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (idea_id) REFERENCES ideas(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  idea_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('up','down') NOT NULL,
  FOREIGN KEY (idea_id) REFERENCES ideas(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 10. API a integrace

* Všechny endpointy pod `/api/*`.
* Autentizace pomocí Laravel Sanctum (token-based) nebo JWT.
* Validace requestů přes Form Requests.

---

## 11. Bezpečnost a autorizace

* **CSRF**: Ochrana pro webové routy.
* **CORS**: Nastavení pro mobilní a externí klienty.
* **Policies**: Kontrola vlastnictví a rolí.

---

## 12. Nasazení

* **Docker**: Kontejnery pro PHP, MySQL, Redis.
* **CI/CD**: GitHub Actions pipeline pro testy a nasazení.
* **Migrace a seed**: `php artisan migrate --seed`.

---

## 13. Závěr

Tento návrh slouží jako podklad pro implementaci a další rozvoj Ratio Platform. Pro podrobnosti viz komentáře v kódu a oficiální dokumentaci Laravel frameworku.
