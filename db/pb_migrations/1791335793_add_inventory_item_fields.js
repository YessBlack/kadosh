/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  const fields = [
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357931",
      "max": 999999999999,
      "min": 0,
      "name": "sku",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357932",
      "max": 999999999999,
      "min": 0,
      "name": "name",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357933",
      "max": 999999999999,
      "min": 0,
      "name": "description",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357934",
      "max": 999999999999,
      "min": 0,
      "name": "category",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357935",
      "max": 999999999999,
      "min": 0,
      "name": "barcode",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17913357936",
      "max": 999999999999,
      "min": 0,
      "name": "unit",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357931",
      "max": 0,
      "min": 0,
      "name": "salesPrice",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357932",
      "max": 0,
      "min": 0,
      "name": "unitCost",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357933",
      "max": 0,
      "min": 0,
      "name": "initialStock",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357934",
      "max": 0,
      "min": 0,
      "name": "minStock",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357935",
      "max": 0,
      "min": 0,
      "name": "estimatedCost",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17913357936",
      "max": 0,
      "min": 0,
      "name": "durationMin",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "bool1791335793",
      "name": "isActive",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "bool"
    },
    {
      "help": "",
      "hidden": false,
      "id": "select17913357931",
      "maxSelect": 1,
      "name": "type",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": ["PRODUCT", "SERVICE"]
    },
    {
      "help": "",
      "hidden": false,
      "id": "select17913357932",
      "maxSelect": 1,
      "name": "priceMode",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": ["FIXED", "VARIABLE"]
    },
    {
      "help": "",
      "hidden": false,
      "id": "file1791335793",
      "maxSelect": 1,
      "maxSize": 0,
      "mimeTypes": null,
      "name": "image",
      "presentable": false,
      "protected": false,
      "required": false,
      "system": false,
      "thumbs": null,
      "type": "file"
    }
  ]

  for (const field of fields) {
    const existingField = collection.fields.getByName(field.name)
    if (!existingField) {
      collection.fields.addAt(collection.fields.length, new Field(field))
    } else if (field.type === "number" && existingField.max === 0) {
      existingField.max = field.max
    }
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  const fieldIds = [
    "text17913357931",
    "text17913357932",
    "text17913357933",
    "text17913357934",
    "text17913357935",
    "text17913357936",
    "number17913357931",
    "number17913357932",
    "number17913357933",
    "number17913357934",
    "number17913357935",
    "number17913357936",
    "bool1791335793",
    "select17913357931",
    "select17913357932",
    "file1791335793"
  ]

  for (const fieldId of fieldIds) {
    collection.fields.removeById(fieldId)
  }

  for (const fieldName of ["estimatedCost", "durationMin"]) {
    const field = collection.fields.getByName(fieldName)
    if (field?.max === 999999999999) {
      field.max = 0
    }
  }

  return app.save(collection)
})