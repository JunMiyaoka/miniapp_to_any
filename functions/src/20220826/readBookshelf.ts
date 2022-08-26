import * as functions from 'firebase-functions'
import { readNotion } from '../readers/readNotion'

const DATABSE_ID = 'c0260a03f2b442cca364ccb0ae5f39d0'

export const readBookshelf = functions.https.onRequest(async (req, res) => {
  const searchString = req.query['searchString'] as string
  const filter = {
    and: [
      {
        property: 'Name',
        rich_text: {
          contains: searchString,
        },
      },
    ],
  }
  const { data } = await readNotion(DATABSE_ID, filter)
  // FIXME: any
  const resBody = data.results.map((row: any, index: number) => {
    const name =
      row.properties.Name.title[0] && row.properties.Name.title[0].plain_text
    const link = row.properties.URL.url
    const image =
      row.properties.Image.rich_text[0] &&
      row.properties.Image.rich_text[0].plain_text
    const auther =
      row.properties.Auther.rich_text[0] &&
      row.properties.Auther.rich_text[0].plain_text
    return {
      id: index + 1,
      title: name,
      auther: auther,
      link: link,
      image: image,
    }
  })
  res.status(200).send(resBody)
})
