/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1218262561")

  // add field
  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "select3791253581",
    "maxSelect": 0,
    "name": "stockPolicy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "WARN"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1218262561")

  // remove field
  collection.fields.removeById("select3791253581")

  return app.save(collection)
})
