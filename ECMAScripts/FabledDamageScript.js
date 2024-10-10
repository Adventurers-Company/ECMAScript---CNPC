var Bukkit = Java.type('org.bukkit.Bukkit');
var Class = Java.type('java.lang.Class');
var UUID = Java.type('java.util.UUID'); // Import the UUID class

var Plugin = {
  type: function(pluginName, pluginClass) {
    var plugin = Bukkit.getPluginManager().getPlugin(pluginName);
    if (plugin == null) {
        print("Error: Plugin " + pluginName + " not found or is not loaded.");
        return null;
    }
    var classLoader = plugin.getClass().getClassLoader();
    return Class.forName(pluginClass, false, classLoader).static;
  }
};

function interact(e) {
    var npcUuidString = e.npc.getUUID(); // Get the UUID as a string
    var npcUuid = UUID.fromString(npcUuidString); // Convert the string to a UUID

    var Fabled = Plugin.type('Fabled', 'studio.magemonkey.fabled.Fabled'); // Get Fabled class
    if (Fabled == null) return; // Ensure Fabled plugin is loaded
    
    // Retrieve the Minecraft entity associated with the NPC
    var mcNpc = Bukkit.getEntity(npcUuid); 
    if (mcNpc == null || !(mcNpc instanceof org.bukkit.entity.LivingEntity)) return;

    // Find the player by name using the Bukkit API
    var bukkitPlayer = Bukkit.getPlayer(e.player.getName());
    if (bukkitPlayer == null) return;
    
    // Use Fabled.getSkill().damage to deal damage
    var skill = Fabled.getSkill("MobBase");
    var amount = 10;
    var classification = "base";
    
    skill.damage(mcNpc, amount, bukkitPlayer, classification);
}