import * as functions from 'firebase-functions'
import { writeSheet } from '../writers/writeSheet'
import { writeBq } from '../writers/writeBq'

const SHEET_NAME = '参加者アンケート'
const BQ_DATASET_NAME = '20220826_event'
const BQ_TABLE_NAME = 'participant_surveys'

export const participantSurveys = functions.https.onRequest(
  async (req, res) => {
    const row = [
      {
        job_category: req.body.guest_job_category,
        line_experience: req.body.guest_line_experience,
        dev_experience: req.body.guest_dev_experience,
        area: req.body.guest_area,
      },
    ]
    writeSheet(SHEET_NAME, row[0])
    writeBq(BQ_DATASET_NAME, BQ_TABLE_NAME, row)
    res.status(200)
  }
)
