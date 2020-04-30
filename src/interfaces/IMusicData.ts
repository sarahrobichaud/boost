import { StreamDispatcher } from "discord.js";
import { YouTubeSearchResults } from "youtube-search";
//Setup music queues.
export interface IMusicData {
  dispatcher: StreamDispatcher;
  queue: YouTubeSearchResults[];
}
