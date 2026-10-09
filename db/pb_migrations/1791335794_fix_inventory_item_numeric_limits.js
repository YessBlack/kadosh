/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  const fieldNames = [
    "salesPrice",
    "unitCost",
    "initialStock",
    "minStock",
    "estimatedCost",
    "durationMin"
  ]

  for (const fieldName of fieldNames) {
    const field = collection.fields.getByName(fieldName)
    if (field) field.max = 999999999999
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  const fieldNames = [
    "salesPrice",
    "unitCost",
    "initialStock",
    "minStock",
    "estimatedCost",
    "durationMin"
  ]

  for (const fieldName of fieldNames) {
    const field = collection.fields.getByName(fieldName)
    if (field?.max === 999999999999) field.max = 0
  }

  return app.save(collection)
})