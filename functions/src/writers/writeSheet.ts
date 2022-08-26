import { google } from 'googleapis'

export const writeSheet = (sheetName: string, row: any) => {
  const auth = new google.auth.JWT({
    email: process.env.SERVICE_ACCOUNT_EMAIL,
    key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheet = google.sheets('v4')
  sheet.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    auth: auth,
    range: sheetName,
    valueInputOption: 'RAW',
    requestBody: {
      values: [Object.values(row)],
    },
  })
}
