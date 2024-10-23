var amount = 1;
var classification = "Piercing";
var Getskill = "Piercing-Base";

//---------------------------------------------------
var Bukkit = Java.type('org.bukkit.Bukkit');
var Class = Java.type('java.lang.Class');
var UUID = Java.type('java.util.UUID'); // Import the UUID class
var LivingEntity = Java.type('org.bukkit.entity.LivingEntity'); // Import the LivingEntity class

// Cooldown variable to prevent multiple attacks in succession
var lastAttackTime = {};

var Plugin = {
    type: function(pluginName, pluginClass) {
        var plugin = Bukkit.getPluginManager().getPlugin(pluginName);
        if (plugin == null) {
            print("Error: Plugin " + pluginName + " not found or is not loaded.");
            return null;
        }
        var classLoader = plugin.getClass().getClassLoader();
        return Class.forName(pluginClass, true, classLoader).static;
    }
};

function attack(e) {
    try {
        if (e.target == null) {
            print("Error: The target (e.target) is null.");
            return; 
        }

        var npcUuidString = e.target.getUUID(); // Get the UUID as a string
        if (npcUuidString == null || npcUuidString.isEmpty()) {
            print("Error: Could not obtain the target's UUID.");
            return; 
        }

        // Add cooldown per player
        var playerName = e.player.getName();
        var currentTime = new Date().getTime();
        if (lastAttackTime[playerName] && currentTime - lastAttackTime[playerName] < 1000) { // 1 second cooldown
            print("Active cooldown, attack ignored.");
            return;
        }
        lastAttackTime[playerName] = currentTime; // Update the last attack time

        var npcUuid = UUID.fromString(npcUuidString); // Convert the string to UUID
        if (npcUuid == null) {
            print("Error: Invalid UUID or conversion failed.");
            return; 
        }

        var Fabled = Plugin.type('Fabled', 'studio.magemonkey.fabled.Fabled'); // Get the Fabled class
        if (Fabled == null) {
            print("Error: Fabled plugin not found or loaded.");
            return; 
        }

        // Retrieve the Minecraft entity associated with the NPC using the UUID
        var mcNpc = Bukkit.getServer().getEntity(npcUuid);
        if (mcNpc == null) {
            print("Error: No entity found with the provided UUID.");
            return;
        }
        if (!(mcNpc instanceof LivingEntity)) {
            print("Error: The retrieved entity is not a LivingEntity.");
            return;
        }

        // Find the player by name using the Bukkit API
        var bukkitPlayer = Bukkit.getPlayer(e.player.getName());
        if (bukkitPlayer == null) {
            print("Error: Player not found.");
            return;
        }

        // Use Fabled.getSkill().damage to deal damage
        var skill = Fabled.getSkill(Getskill);
        if (skill == null) {
            print("Error: Skill 'Piercing-Base' not found.");
            return;
        }

        // Apply damage to the entity if everything is correct
        skill.damage(mcNpc, amount, bukkitPlayer, classification);
        print("Damage applied successfully.");
    } catch (err) {
        print("Unexpected error: " + err.message); // Catch any unexpected error and print the error message
    }
}
