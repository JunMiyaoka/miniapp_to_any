import * as functions from 'firebase-functions'
import { writeNotion } from '../writers/writeNotion'

export const miniappPurposes = functions.https.onRequest((req, res) => {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId) return
  const properties = {
    Category: {
      title: [
        {
          text: {
            content: req.body.usage_category,
          },
        },
      ],
    },
    Issue: {
      rich_text: [
        {
          text: {
            content: req.body.usage_issue,
          },
        },
      ],
    },
  }
  writeNotion(databaseId, properties)
  res.status(200)
})
