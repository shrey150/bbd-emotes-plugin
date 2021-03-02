/**
 * @name BetterEmotes
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website https://github.com/shrey150/bbd-emotes-plugin
 * @source https://raw.githubusercontent.com/shrey150/bbd-emotes-plugin/master/dist/BetterEmotes.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"BetterEmotes","authors":[{"name":"Shrey Pandya","discord_id":"231147918336327680","github_username":"shrey150","twitter_username":"shrey150"}],"version":"0.1.1","description":"Revamps BetterDiscord's emote system","github":"https://github.com/shrey150/bbd-emotes-plugin","github_raw":"https://raw.githubusercontent.com/shrey150/bbd-emotes-plugin/master/dist/BetterEmotes.plugin.js"},"changelog":[{"title":"Minor update","items":["Added forsen emotes"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
    
    const {Logger} = Library;
    const fs = require("fs");
    const request = require("request");
    const path = require("path");

    return class BetterEmotesPlugin extends Plugin {

        onLoad() {}

        onStart() {

            // hardcoded to xqc and forsen emotes for now;
            // TODO add settings menu to configure channels
            request.get(`https://bbd-emotes-generator.herokuapp.com?channels=71092938,22484632`, { json: true }, (err, res, body) => {

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

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/