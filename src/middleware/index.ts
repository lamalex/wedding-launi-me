import { sequence } from "astro:middleware";
import { auth } from "./auth";
import { adminAuth } from "./adminauth";

export const onRequest = sequence(auth, adminAuth);
