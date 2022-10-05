export const name = Discord.Events.ClientReady;
export const once = true;


import Discord from "discord.js";
import fs from "fs/promises";

import { choice, partition } from "@magicalbunny31/awesome-utility-stuff";

/**
 * @param {Discord.Client} client
 * @param {import("@google-cloud/firestore").Firestore} firestore
 */
export default async (client, firestore) => {
   // commands
   const [ globalCommands, guildCommands ] = partition(
      await (async () => {
         const commands = [];

         for (const file of await fs.readdir(`./interactions/chat-input`))
            commands.push(await import(`../interactions/chat-input/${file}`));

         return commands;
      })(),
      command => !command.guildOnly
   )
      .map(commands =>
         commands.map(command => command.data)
      );

   await client.application.commands.set(globalCommands);
   await client.application.commands.set(guildCommands, process.env.GUILD_AREA_COMMUNITY);


   // statuses
   setInterval(() => {
      //? list of statuses
      const activities = {
         [Discord.ActivityType.Playing]: [
            `Flooded Area 🌊`,
            `with the waves 🌊`
         ],
         [Discord.ActivityType.Watching]: [
            `the waves 🌊`,
            `your suggestions 📋`
         ],
         [Discord.ActivityType.Listening]: [
            `the waves 🌊`,
            `your suggestions 📋`
         ],
         [Discord.ActivityType.Competing]: [
            `the best boat ⛵`,
            `a challenge 🎯`
         ]
      };

      const activityType = +choice(Object.keys(activities));
      const activityName = choice(activities[activityType]);

      client.user.setPresence({
         status: `online`,
         activities: [{
            type: activityType,
            name: activityName
         }]
      });
   }, 1.8e+6); // 30 minutes


   // log to console once everything is done
   console.log(`Flooded Area 🌊 is ready~`);
};