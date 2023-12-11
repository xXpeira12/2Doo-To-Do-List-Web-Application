/**
 * @typedef {Object} Item
 * @property {string} _id
 * @property {string} name
 * @property {date} endTime
 * @property {date} startTime
 * @property {string} day
 */

/** @typedef {Omit<Item, "_id">} ItemPayload */

// เปลี่ยน localhost -> Public IPv4 address
// export const BACKEND_URL = "http://localhost:3222";
export const BACKEND_URL = "https://backend-service-kdww.onrender.com";

// export const MEMBERS = [
//   "ติณณา เจียรวาปี",
//   "ปภาวิน ตั้งจิตร์พร",
//   "เพ็ญพิชชา อยู่หุ่น",
//   "ศิรสิทธิ์ ธนาจิรวัฒน์",
//   "อัมพิกาภา ทาทอง"
// ];