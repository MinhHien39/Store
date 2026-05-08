# Database Seed

## Overview

| Script                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `admin.py`              | Seeds the default admin account                                              |
| `manager.py`            | Seeds default manager accounts                                               |
| `property_photo.py`     | Seeds many confirmed property photos for report batching tests               |
| `templates/__init__.py` | Seeds `property_templates` from local template folders (upsert by folder id) |

---

## Run Admin and Manager Seeds

You can run seeds individually or both together.

```bash
# From the /backend directory

# Seed ONLY the admin account
python -m app.db.seed.admin

# Seed ONLY the company
python -m app.db.seed.company

# Seed ONLY the manager accounts
python -m app.db.seed.manager

# Seed ONLY templates
Link To: Seed Property Templates

# Seed ONLY confirmed property photos for report test
python -m app.db.seed.property_photo

# Seed ONLY confirmed property photos with custom total
python -m app.db.seed.property_photo 250

# Run BOTH seed_admin + seed_company + seed_manager
python -m app.db.seed

```

---

## Seed Property Templates

Seeds (upserts) `property_templates` records from local folders, uploading files to S3.

### Folder structure

```
app/db/seed/templates/
  register/
    local/        ← source folders for local env
      4/
        4.html    (required)
        4.json    (required)
        4.png     (optional)
    dev/          ← source folders for dev env
      4/
        ...
    prd/          ← source folders for prd env
      4/
        ...
  uploaded/
    local/        ← successfully processed folders (local)
    dev/          ← successfully processed folders (dev)
    prd/          ← successfully processed folders (prd)
```

> **Folder name = DB primary key (`id`)**  
> Folder `4/` → `property_templates.id = 4`.  
> If a record already exists it is **updated** (upsert); otherwise it is **inserted**.

### Required / optional files per folder

| File               | Required   | Maps to                           |
| ------------------ | ---------- | --------------------------------- |
| `<N>.html`         | ✅ Yes      | `html_path` (S3) + `html_content` |
| `<N>.json`         | ✅ Yes      | `config` (JSON)                   |
| `<N>.png` / `.jpg` | ❌ Optional | `image_path` (S3)                 |

Folders missing `.html` or `.json` are **skipped**.  
Successfully processed folders are **moved** to `uploaded/<env>/`.

### Environment variables

| Variable         | Values                    | Description                                            |
| ---------------- | ------------------------- | ------------------------------------------------------ |
| `ENV`            | `local` \| `dev` \| `prd` | Selects register/uploaded sub-folder and S3 env prefix |
| `S3_BUCKET_NAME` | e.g. `store-bucket`     | Target S3 bucket                                       |
| `DATABASE_URL`   | DB connection string      | Target database                                        |

### Run commands

```bash
# From the /backend directory

# Use current ENV from .env
python -m app.db.seed.template.main

# local
ENV=local python -m app.db.seed.template.main

# dev
ENV=dev python -m app.db.seed.template.main

# prd
ENV=prd python -m app.db.seed.template.main
```

### S3 path format

```
<ENV>/templates/<folder_name>/<filename>.<ext>

# Example (dev, folder 4)
dev/templates/4/4.html
dev/templates/4/4.png
```

### Expected log output

```
🚀 seed_template started | env=dev | bucket=store-bucket
   register : .../templates/register/dev
   uploaded : .../templates/uploaded/dev
📂 Processing folder: 4
  ✅ Uploaded HTML  → dev/templates/4/4.html
  ✅ Uploaded image → dev/templates/4/4.png
  💾 PropertyTemplate created | id=4
  📦 Moved → uploaded/dev/4 | took 1.23s
📂 Processing folder: 5
  ⚠️  [5] No .html file found — skipped
🎉 seed_template completed | success=1 skip=1 error=0 | total time: 2.45s
```
