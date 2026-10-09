/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  const field = collection.fields.getByName("unitCostSnapshot")

  if (field) collection.fields.removeById(field.id)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  if (!collection.fields.getByName("unitCostSnapshot")) {
    collection.fields.addAt(collection.fields.length, new Field({
      "help": "",
      "hidden": false,
      "id": "number17914888402",
      "max": 999999999999,
      "min": 0,
      "name": "unitCostSnapshot",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    }))
  }

  return app.save(collection)
})