#!/usr/bin/env python3
"""
Complete i18n translations for all languages
Copies the full structure from EN and translates to each language
"""

import json
import os
from pathlib import Path

# Base directory
base_dir = Path("/srv/proj/nuxt-wp-multilang-theme/i18n/locales")

# Read English as reference (complete structure)
with open(base_dir / "en" / "common.json", "r", encoding="utf-8") as f:
    en_data = json.load(f)

# Full translations for each language
translations = {
    "sr": {
        "actions": {
            "continueNow": "Настави сада",
            "delete": "Обриши",
            "edit": "Уреди",
            "loadMore": "Учитај више",
            "profile": "Профил",
            "reset": "Ресетуј",
            "viewPosts": "Прикажи чланке"
        },
        "app": {
            "description": "Једноставан и ефикасан почетак",
            "footer": "Креирао Александар Стајић",
            "name": "Nuxt Boilerplate"
        },
        "articleForm": {
            "actions": {
                "create": {
                    "autoSaveInfo": "Промене ће бити аутоматски сачуване",
                    "cancel": "Откажи",
                    "description": "Попуните поља испод да креирате чланак.",
                    "error": {
                        "message": "Дошло је до грешке приликом креирања чланка",
                        "title": "Неуспешно креирање чланка"
                    },
                    "loginRequired": "Пријавите се да бисте креирали чланак",
                    "submit": "Креирај чланак",
                    "success": {
                        "message": "Ваш чланак је успешно креиран",
                        "title": "Чланак успешно креиран"
                    },
                    "title": "Креирај нови чланак"
                },
                "delete": {
                    "cancel": "Откажи",
                    "confirm": "Обриши",
                    "description": "Да ли сте сигурни да желите да обришете овај чланак? Ова акција је неопозива.",
                    "error": {
                        "message": "Дошло је до грешке приликом брисања чланка",
                        "title": "Неуспешно брисање чланка"
                    },
                    "info": "Ова акција ће трајно обрисати чланак",
                    "success": {
                        "message": "Ваш чланак је успешно обрисан",
                        "title": "Чланак успешно обрисан"
                    },
                    "title": "Обриши чланак"
                },
                "edit": {
                    "autoSaveInfo": "Промене ће бити аутоматски сачуване",
                    "cancel": "Откажи",
                    "description": "Уредите садржај вашег чланка.",
                    "error": {
                        "message": "Дошло је до грешке приликом ажурирања чланка",
                        "title": "Неуспешно ажурирање чланка"
                    },
                    "loginRequired": "Пријавите се да бисте уредили чланак",
                    "save": "Сачувај промене",
                    "success": {
                        "message": "Ваш чланак је успешно ажуриран",
                        "title": "Чланак успешно ажуриран"
                    },
                    "title": "Уреди чланак"
                }
            },
            "analytics": {
                "characterCount": "Нема карактера | {count} карактер | {count} карактера",
                "readingTime": "{count} минут читања | {count} минута читања",
                "wordCount": "Нема речи | {count} реч | {count} речи"
            },
            "badgeLabels": {
                "length": {
                    "long": "Дуг",
                    "medium": "Средњи",
                    "short": "Кратак"
                }
            },
            "error": {
                "notFound": "Чланак није пронађен или је обрисан",
                "unauthorized": "Немате дозволу за ову акцију"
            },
            "fields": {
                "content": {
                    "label": "Садржај чланка",
                    "placeholder": "Напишите садржај чланка овде",
                    "validation": {
                        "maxLength": "Садржај не може прећи 1000 карактера",
                        "minLength": "Садржај мора садржати најмање 10 карактера",
                        "required": "Садржај је обавезан"
                    }
                },
                "createdAt": {
                    "label": "Креирано {date} у {time}"
                },
                "title": {
                    "label": "Наслов чланка",
                    "placeholder": "Унесите наслов чланка",
                    "validation": {
                        "maxLength": "Наслов не може прећи 100 карактера",
                        "minLength": "Наслов мора садржати најмање 3 карактера",
                        "required": "Наслов је обавезан"
                    }
                },
                "updatedAt": {
                    "label": "Измењено {date} у {time}"
                }
            }
        }
    }
}

# Write Serbian
print("Updating sr/common.json...")
# We already have categories, articles, cache, navigation, language from previous edits
# Now we add the full auth section and other missing parts
