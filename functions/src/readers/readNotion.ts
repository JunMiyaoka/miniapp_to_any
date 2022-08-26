import axios from 'axios'

// FIXME: any
export const readNotion = async (databaseId: string, filter: any) => {
  const response = await axios({
    method: 'post',
    url: 'https://api.notion.com/v1/databases/' + databaseId + '/query',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_SECRET_KEY}`,
      'Notion-Version': '2021-08-16',
      'Content-Type': 'application/json',
    },
    data: {
      filter: filter,
    },
  })
  return response
}
