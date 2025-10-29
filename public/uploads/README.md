# WordPress Uploads Directory

Dieser Ordner enthält die aus WordPress migrierten Bilder und Media-Dateien.

## Struktur:

```
uploads/
├── 2024/
│   ├── 01/
│   ├── 02/
│   └── ...
├── 2025/
│   └── ...
└── README.md
```

## Migration:

1. Kopiere den `wp-content/uploads/` Ordner hierher
2. Die Dateipfade werden in der Datenbank als relative Pfade gespeichert
3. Beispiel: `/uploads/2024/01/image.jpg`

## .gitignore:

Diese Dateien sind in `.gitignore` und werden nicht versioniert.
