/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as consultations from "../consultations.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as lib_tz from "../lib/tz.js";
import type * as partners from "../partners.js";
import type * as passkeys from "../passkeys.js";
import type * as passkeysNode from "../passkeysNode.js";
import type * as pricing from "../pricing.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  analytics: typeof analytics;
  auth: typeof auth;
  consultations: typeof consultations;
  crons: typeof crons;
  http: typeof http;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/rateLimit": typeof lib_rateLimit;
  "lib/tz": typeof lib_tz;
  partners: typeof partners;
  passkeys: typeof passkeys;
  passkeysNode: typeof passkeysNode;
  pricing: typeof pricing;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
