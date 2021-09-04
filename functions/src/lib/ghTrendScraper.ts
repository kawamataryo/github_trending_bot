import got from "got";
import {parse, HTMLElement} from "node-html-parser";
import {GHTrend} from "../types/types";

export class GHTrendScraper {
  constructor(private params = "") {}

  async scrapping(): Promise<GHTrend[]> {
    const res = await got.get(`https://github.com/trending${this.params}`);
    const dom = parse(res.body);
    const rows = dom.querySelectorAll(".Box-row");

    return rows.map((row) => {
      const {owner, repository} = GHTrendScraper.getOwnerAndRepoName(row);
      const {description} = GHTrendScraper.getDescription(row);
      const {starCount} = GHTrendScraper.getStarCount(row);
      const {forkCount} = GHTrendScraper.getForkCount(row);
      const {todayStarCount} = GHTrendScraper.getTodayStarCount(row);
      const {language} = GHTrendScraper.getLanguage(row);

      return {
        owner,
        repository,
        language: language ?? "",
        description: description ?? "",
        starCount: starCount ?? "",
        forkCount: forkCount ?? "",
        todayStarCount: todayStarCount ?? "",
        url: `https://github.com/${owner}/${repository}`,
      };
    });
  }

  private static getOwnerAndRepoName(dom: HTMLElement) {
    const path = dom.querySelector("> h1 a").attributes.href;
    const result = path.split("/");
    return {
      owner: result[1],
      repository: result[2],
    };
  }

  private static getDescription(dom: HTMLElement) {
    const description = dom.querySelector("> p")?.innerText?.trim();
    return {
      description,
    };
  }

  private static getStarCount(dom: HTMLElement) {
    const starCount = dom
        .querySelector("a[href$=\"stargazers\"]")
      ?.innerText?.trim();
    return {
      starCount,
    };
  }

  private static getForkCount(dom: HTMLElement) {
    const forkCount = dom
        .querySelector("a[href*=\"network/members\"]")
      ?.innerText?.trim();
    return {
      forkCount,
    };
  }

  private static getTodayStarCount(dom: HTMLElement) {
    const text = dom.querySelector("span.float-sm-right")?.innerText?.trim();
    return {
      todayStarCount: text?.split(/\s/)[0],
    };
  }

  private static getLanguage(dom: HTMLElement) {
    const language = dom
        .querySelector("[itemprop=\"programmingLanguage\"]")
      ?.innerText?.trim();
    return {
      language,
    };
  }
}
