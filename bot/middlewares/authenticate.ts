import { adminAcc } from "../modules/firebase";

export const authenticate = async (req: any, res: any, next: any) => {
  const token: string = req.headers["token"];
  const uid: string = req.headers["uid"];

  if (!token) {
    return res.json({ success: false, message: "unauthorized_user" })
  }

  try {
    const decodedData = await adminAcc.auth().verifyIdToken(token);

    if (!uid) {
      return res.json({ success: false, message: "uid_not_provided " })
    }

    if (uid !== decodedData.user_id) {
      return res.json({ success: false, message: "id_missmatch_unauthorized" })
    }

    req.user = decodedData;
    req.userId = uid;
    next();

  } catch (error) {
    console.log("Some error", error);
    res.json({ success: false, message: "unknown_error" })
  }
}