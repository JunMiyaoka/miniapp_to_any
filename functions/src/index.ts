import * as functions from "firebase-functions";
import { google } from "googleapis";
import { BigQuery } from "@google-cloud/bigquery";
import { Client } from "@notionhq/client";

exports.writeSheet = functions.https.onRequest(async (request, response) => {
  const auth = new google.auth.JWT({
    email: process.env.SERVICE_ACCOUNT_EMAIL,
    key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheet = google.sheets("v4");
  await sheet.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    auth: auth,
    range: "Sheet1",
    valueInputOption: "RAW",
    requestBody: {
      values: [Object.values(request.body)],
    },
  });
});

exports.writeBq = functions.https.onRequest(async (request, response) => {
  const bigQueryClient = new BigQuery({
    credentials: {
      client_email: process.env.SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    },
    projectId: process.env.BQ_PROJECT_ID,
  });
  const rows = [
    { name: request.body.bq_user_name, question: request.body.bq_question },
  ];
  await bigQueryClient
    .dataset("miniapp_to_bq_dev")
    .table("log_miniapp_survey")
    .insert(rows);
});

exports.writeNotion = functions.https.onRequest(async (request, response) => {
  const notion = new Client({
    auth: process.env.NOTION_SECRET_KEY,
  });
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) return;
  await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: request.body.notion_user_name,
            },
          },
        ],
      },
      Question: {
        rich_text: [
          {
            text: {
              content: request.body.notion_question,
            },
          },
        ],
      },
    },
  });
});
