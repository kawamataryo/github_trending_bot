import * as functions from "firebase-functions";
import {
  tweetAllLanguagesTrends,
  updateAllLanguagesTrends,
} from "../core/allLanguages";
import { tweetFrontendTrends, updateFrontendTrends } from "../core/frontend";
import { updatePythonTrends, tweetPythonTrends } from "../core/python";
import { tweetRustTrends, updateRustTrends } from "../core/rust";

const runtimeOpts = {
  timeoutSeconds: 180,
  memory: "512MB" as const,
};

export const scrappingGitHubTrends = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (_req, res) => {
    try {
      await Promise.all([
        updateAllLanguagesTrends(),
        updateFrontendTrends(),
        updatePythonTrends(),
        updateRustTrends(),
      ]);
      console.info("update trends");
    } catch (e) {
      console.error(e);
      res.send(`error: ${JSON.stringify(e)}`);
      return;
    }
    res.send("success");
  });

export const tweetGitHubTrends = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (_req, res) => {
    try {
      await Promise.all([
        tweetAllLanguagesTrends(),
        tweetFrontendTrends(),
        tweetPythonTrends(),
        tweetRustTrends(),
      ]);
    } catch (e) {
      console.error(e);
      res.send(`error: ${JSON.stringify(e)}`);
      return;
    }
    res.send("success");
  });
