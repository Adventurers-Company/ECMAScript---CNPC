var Bukkit = Java.type('org.bukkit.Bukkit');
var Class = Java.type('java.lang.Class');
var UUID = Java.type('java.util.UUID'); // Importa a classe UUID
var LivingEntity = Java.type('org.bukkit.entity.LivingEntity'); // Importa a classe LivingEntity

// Variável de cooldown para impedir múltiplos ataques em sequência
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
            return; 
        }

        var npcUuidString = e.target.getUUID(); // Obtém o UUID como string
        if (npcUuidString == null || npcUuidString.isEmpty()) {
            print("Error: UUID do alvo não pôde ser obtido.");
            return; 
        }

        // Adiciona o cooldown por jogador
        var playerName = e.player.getName();
        var currentTime = new Date().getTime();
        if (lastAttackTime[playerName] && currentTime - lastAttackTime[playerName] < 1) { // 1 segundo de cooldown
            print("Cooldown ativo, ataque ignorado.");
            return;
        }
        lastAttackTime[playerName] = currentTime; // Atualiza o tempo do último ataque

        var npcUuid = UUID.fromString(npcUuidString); // Converte a string em UUID
        if (npcUuid == null) {
            print("Error: UUID inválido ou conversão falhou.");
            return; 
        }

        var Fabled = Plugin.type('Fabled', 'studio.magemonkey.fabled.Fabled'); // Obtém a classe Fabled
        if (Fabled == null) {
            print("Error: Plugin Fabled não foi encontrado ou carregado.");
            return; 
        }

        // Recupera a entidade do Minecraft associada ao NPC usando o UUID
        var mcNpc = Bukkit.getServer().getEntity(npcUuid);
        if (mcNpc == null) {
            print("Error: Nenhuma entidade encontrada com o UUID fornecido.");
            return;
        }
        if (!(mcNpc instanceof LivingEntity)) {
            print("Error: A entidade recuperada não é uma LivingEntity.");
            return;
        }

        // Encontra o jogador pelo nome usando a API do Bukkit
        var bukkitPlayer = Bukkit.getPlayer(e.player.getName());
        if (bukkitPlayer == null) {
            print("Error: Jogador não encontrado.");
            return;
        }

        // Usa Fabled.getSkill().damage para causar dano
        var skill = Fabled.getSkill("Piercing-Base");
        if (skill == null) {
            print("Error: Habilidade 'Piercing-Base' não encontrada.");
            return;
        }

        var amount = 15;
        var classification = "Piercing";

        // Aplica o dano à entidade se tudo estiver correto
        skill.damage(mcNpc, amount, bukkitPlayer, classification);
        print("Dano aplicado com sucesso.");
    } catch (err) {
        print("Erro inesperado: " + err.message); // Captura qualquer erro inesperado e imprime a mensagem de erro
    }
}
