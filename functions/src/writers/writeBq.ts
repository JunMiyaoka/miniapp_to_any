import { BigQuery } from '@google-cloud/bigquery'

export const writeBq = (datasetName: string, tableName: string, row: any) => {
  const bigQueryClient = new BigQuery({
    credentials: {
      client_email: process.env.SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      ),
    },
    projectId: process.env.BQ_PROJECT_ID,
  })
  bigQueryClient.dataset(datasetName).table(tableName).insert(row)
}
