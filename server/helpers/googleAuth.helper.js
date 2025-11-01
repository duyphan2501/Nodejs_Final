import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const clientId = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(clientId);

const verifyToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const payload = await ticket.getPayload();

  return payload;
};

export { verifyToken };
