import { Client } from '@notionhq/client'

export const writeNotion = (databaseId: string, properties: any) => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET_KEY,
  })
  notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: properties,
  })
}
