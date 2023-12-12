import { log } from "firebase-functions/logger";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { firestore } from "./firebase";

export const serve = onRequest(
  { region: "asia-east1", memory: "8GiB", timeoutSeconds: 3600 },
  async (req, res) => {
    try {
      console.log(`request: ${req.url}`);
      if (req.url === "/hello") {
        res.send("hello");
        return;
      }

      if (req.url.startsWith("/story")) {
        const id = req.url.match(/\/sui-(\w+)/)?.[1];
        if (id) {
          const result = await firestore
            .collection("mints")
            .where("object_id", "==", id)
            .get();
          if (result.empty) {
            res.status(404).send("Not found");
            return;
          }
          const data = result.docs[0].data();

          res.redirect(`https://app.storytime.one/story/${data.project_id}`);
          return;
        }
      }

      if (req.url.startsWith("/images/sui-")) {
        const id = req.url.match(/\/sui-(\w+)/)?.[1];
        if (id) {
          const result = await firestore
            .collection("mints")
            .where("object_id", "==", id)
            .get();
          if (result.empty) {
            res.status(404).send("Not found");
            return;
          }
          const data = result.docs[0].data();
          const project = await firestore
            .collection("projects")
            .doc(data.project_id)
            .get();

          res.redirect(project.data()?.coverImage);
          return;
        }
      }

      res.send({ routes: ["/story", "/hello"] });
    } catch (e) {
      res.status(500).send(e);
    }
  }
);
