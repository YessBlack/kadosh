/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  const fields = [
    {
      "cascadeDelete": false,
      "collectionId": "pbc_1406054367",
      "hidden": false,
      "id": "relation17914888401",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "item_id",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "relation"
    },
    {
      "hidden": false,
      "id": "select17914888401",
      "maxSelect": 1,
      "name": "type",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": ["IN", "OUT"]
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17914888401",
      "max": 0,
      "min": 0,
      "name": "quantity",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "date17914888401",
      "max": "",
      "min": "",
      "name": "date",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "date"
    },
    {
      "hidden": false,
      "id": "select17914888402",
      "maxSelect": 1,
      "name": "source",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": ["PURCHASE", "SALE", "ADJUSTMENT", "MANUAL", "RETURN_IN", "RETURN_OUT"]
    },
    {
      "help": "",
      "hidden": false,
      "id": "number17914888402",
      "max": 0,
      "min": 0,
      "name": "unitCostSnapshot",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text17914888401",
      "max": 0,
      "min": 0,
      "name": "note",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "cascadeDelete": false,
      "collectionId": "_pb_users_auth_",
      "hidden": false,
      "id": "relation17914888402",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "createdBy",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "relation"
    }
  ]

  for (const field of fields) {
    if (!collection.fields.getByName(field.name)) {
      collection.fields.addAt(collection.fields.length, new Field(field))
    }
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  const fieldIds = [
    "relation17914888401",
    "select17914888401",
    "number17914888401",
    "date17914888401",
    "select17914888402",
    "number17914888402",
    "text17914888401",
    "relation17914888402"
  ]

  for (const id of fieldIds) {
    collection.fields.removeById(id)
  }

  return app.save(collection)
})