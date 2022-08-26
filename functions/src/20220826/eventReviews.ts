import * as functions from 'firebase-functions'
import { writeSheet } from '../writers/writeSheet'
import { writeBq } from '../writers/writeBq'

const SHEET_NAME = 'イベント評価'
const BQ_DATASET_NAME = '20220826_event'
const BQ_TABLE_NAME = 'event_reviews'

export const eventReviews = functions.https.onRequest((req, res) => {
  const satisfaction = Number(req.body.satisfaction.split('（')[0])
  const useful = Number(req.body.useful.split('（')[0])
  const canInterview = req.body.can_interview === 'いいよ！'
  const canPost = req.body.can_post === 'いいよ！'
  const isInterested = req.body.is_interested === 'あるよ！'
  const rowForSheet = {
    satisfaction_score: satisfaction,
    useful_score: useful,
    attendance_plan: req.body.attendance_plan,
    can_interview:
      req.body.can_interview === 'いいよ！' ? 'いいよ！' : 'よくない！',
    can_post: req.body.can_post === 'いいよ！' ? 'いいよ！' : 'よくない！',
    is_interested:
      req.body.is_interested === 'あるよ！' ? 'あるよ！' : 'ありません！',
  }
  const rowForBq = [
    {
      satisfaction_score: satisfaction,
      useful_score: useful,
      attendance_plan: req.body.attendance_plan,
      can_interview: canInterview,
      is_interested: isInterested,
      can_post: canPost,
    },
  ]
  writeSheet(SHEET_NAME, rowForSheet)
  writeBq(BQ_DATASET_NAME, BQ_TABLE_NAME, rowForBq)
  res.status(200)
})
