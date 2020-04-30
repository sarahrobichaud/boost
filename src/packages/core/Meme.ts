import IModule from "../../interfaces/IModule";
import { RichEmbed } from "discord.js";
import random from "random-puppy";
const Meme: IModule = {
  name: "Random image from r/dankmemes",
  cmd: "meme",
  execute: (props, args) => {
    const { channel, author } = props;
    //Create Rich embed
    const memeEmbed = new RichEmbed()
      .setColor("#8b096a")
      .setFooter(`Requested by ${author.username}`, author.avatarURL)
      .setTimestamp()
      .setAuthor(`Dank Boost`, props.client.user.avatarURL);

    //Mimic typing
    channel.startTyping();

    //Get random image
    random("dankmemes")
      .then(async url => {
        if (!url) {
          throw new Error("No images found!");
        }
        memeEmbed.setImage(url); // Set image of embed

        await channel
          .send(memeEmbed)
          .then(() => {
            channel.stopTyping(true);
            props.delete();
          })
          .catch(err => {
            console.log(err);
            channel.stopTyping(true);
            channel.send("Something went wrong!");
          });
      })
      .catch(err => {
        console.log(err);
        channel.send("Something went wrong! Try searching for something else");
      });
  }
};
export default Meme;
