import axios from "axios";
import * as cheerio from "cheerio";

export async function getLinkPreview(url: string) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const getMetaTag = (name: string) =>
      $(`meta[property='${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content");

    return {
      title: $("title").text() || getMetaTag("og:title"),
      description: getMetaTag("description") || getMetaTag("og:description"),
      image: getMetaTag("og:image"),
      url,
    };
  } catch (error) {
    console.error("🔗 שגיאה בתצוגת קישור:", error);
    return null;
  }
}
