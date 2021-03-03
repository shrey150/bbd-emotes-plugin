/**
 * @name BetterEmotes
 * @version 0.1.2
 * @authorLink https://twitter.com/shrey150
 * @authorId 231147918336327680
 * @donate https://www.paypal.me/ShreyPandya
 * @source https://raw.githubusercontent.com/shrey150/bbd-emotes-plugin/master/dist/BetterEmotes.plugin.js
 * @updateUrl https://raw.githubusercontent.com/shrey150/bbd-emotes-plugin/master/dist/BetterEmotes.plugin.js
 */

module.exports = (Plugin, Library) => {
    
    const {Logger} = Library;
    const fs = require("fs");
    const request = require("request");
    const path = require("path");

    return class BetterEmotesPlugin extends Plugin {

        onLoad() {}

        onStart() {

            // hardcoded to xqc and forsen emotes for now;
            // TODO add settings menu to configure channels
            request.get(`https://bbd-emotes-generator.herokuapp.com?channels=22484632,71092938`, { json: true }, (err, res, body) => {

                if (err) {
                    BdApi.alert("Error loading emotes", "There was a problem loading your custom emotes, please try again later.");
                    return;
                }

                console.log(body);

                // overwrite emote data JSON file
                fs.writeFileSync(path.join(BdApi.Plugins.folder, "../emote_data.json"), JSON.stringify(body));

                // force reload emotes from the JSON file
                emoteModule.__proto__.loadEmoteData();

                Logger.log("Loaded custom emotes.");
                BdApi.showToast("Loaded custom emotes.", { type: "success" });

            });

        }

        onStop() {}

    }

}