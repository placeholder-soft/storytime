import { log } from "firebase-functions/logger";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";

export const serve = onRequest(
  { region: "asia-east1", memory: "8GiB", timeoutSeconds: 3600 },
  async (req, res) => {
    try {
      console.log(`request: ${req.url}`);
      if (req.url === "/hello") {
        res.send("hello");
      } else if (req.url.startsWith("/story")) {
        const id = req.url.split("/")[2];
        res.send({
          id,
          story: "This is a story",
        });
      } else {
        res.send({ routes: ["/story", "/hello"] });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }
);
