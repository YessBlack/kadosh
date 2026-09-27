/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")
  const batchSize = 200
  let offset = 0

  while (true) {
    const records = app.findRecordsByFilter(collection.id, "isDeleted = true", "id", batchSize, offset)
    if (records.length === 0) break

    for (const record of records) {
      const originalEmail = record.getString("email")
      const aliasPrefix = `deleted-${record.id}`
      const emailLocalPart = originalEmail.split("@")[0]
      const aliasSuffix = emailLocalPart.slice(aliasPrefix.length)
      const matchesAliasPrefix = emailLocalPart === aliasPrefix || emailLocalPart.startsWith(`${aliasPrefix}-`)
      const alreadyReleased = originalEmail.endsWith("@deleted.invalid") && matchesAliasPrefix &&
        (aliasSuffix === "" || /^-\d+$/.test(aliasSuffix))

      if (alreadyReleased) continue

      let releasedEmail = ""
      for (let suffix = 0; suffix < 1000; suffix += 1) {
        const localPart = suffix === 0 ? aliasPrefix : `${aliasPrefix}-${suffix}`
        const candidate = `${localPart}@deleted.invalid`
        const matches = app.findRecordsByFilter(
          collection.id,
          "email = {:email}",
          "",
          1,
          0,
          { email: candidate }
        )

        if (matches.length === 0 || matches[0].id === record.id) {
          releasedEmail = candidate
          break
        }
      }

      if (!releasedEmail) {
        throw new Error(`Unable to allocate a deleted email alias for user ${record.id}`)
      }

      record.set("deletedEmail", record.getString("deletedEmail") || originalEmail)
      record.set("email", releasedEmail)
      app.save(record)
    }

    offset += records.length
  }
}, (app) => {
  // Released email addresses may already belong to new accounts, so restoring them is unsafe.
})
