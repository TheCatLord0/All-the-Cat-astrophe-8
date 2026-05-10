// Banned items
let bannedItems = [
   'easy_villagers:auto_trader',
   'easy_villagers:iron_farm',
   "ars_nouveau:glyph_glide",
   "minecraft:elytra",
   "mekanism:hdpe_elytra",
   "mekanism:module_elytra_unit",
   "cataclysm:ignitium_elytra_chestplate",
   "mekanism:jetpack",
   "mekanism:jetpack_armored",
   "mekanism:module_jetpack_unit",
   "ars_nouveau:glyph_blink",
   "mekanism:cardboard_box",
   "mekanism:upgrade_anchor",
   "sophisticatedbackpacks:feeding_upgrade",
   "sophisticatedbackpacks:advanced_feeding_upgrade",
   "sophisticatedbackpacks:refill_upgrade",
   "sophisticatedbackpacks:advanced_refill_upgrade",
   "sophisticatedbackpacks:compacting_upgrade",
   "sophisticatedbackpacks:advanced_compacting_upgrade",
   "sophisticatedbackpacks:smelting_upgrade",
   "sophisticatedbackpacks:auto_smelting_upgrade",
   "sophisticatedbackpacks:smoking_upgrade",
   "sophisticatedbackpacks:auto_smoking_upgrade",
   "sophisticatedbackpacks:blasting_upgrade",
   "sophisticatedbackpacks:auto_blasting_upgrade",
   "sophisticatedbackpacks:inception_upgrade"
]

PlayerEvents.inventoryChanged(event => {
  let player = event.player;
  let inventory = player.inventory.items; // NeoForge inventory access

  if (!bannedItems.includes(event.item.id)) return;

  // Alert the player
  player.tell([
    Text.darkRed("[Alert] ").bold(), 
    Text.gold(event.item.id).bold(), 
    Text.gray(" has been deleted."),
    "\n",
    Text.green("If you have questions why, ask thecatlord0 on Discord.")
  ])

  // Remove all instances of the banned item
  for (let i = 0; i < inventory.length; i++) {
    let slotItem = inventory[i];
    if (slotItem && slotItem.id === event.item.id) {
      slotItem.count = 0 // Clears the stack
    }
  }
})
LootJS.modifiers(event => {
  bannedItems.forEach(bannedItems => {
    event.addTableModifier(/.*/).removeLoot(bannedItems)
  })
})
ServerEvents.recipes(event => {
  bannedItems.forEach(bannedItems => {
    event.remove({output: bannedItems })
  })
})
ServerEvents.tags('item', event => {
  bannedItems.forEach(bannedItems => {
    event.add('cat:removal', bannedItems)
  })
})
// Replacement recipes
ServerEvents.recipes(event => {
event.replaceInput(
  { output: 'industrialforegoing:mob_duplicator' },
  ['minecraft:nether_wart', 'minecraft:magma_cream'],
  'mekanism:pellet_antimatter')
event.replaceInput(
  { output: 'simulated:red_portable_engine' },
  ['minecraft:blast_furnace'],
  'create:blaze_burner')
event.replaceInput(
  { output: 'ars_nouveau:ritual_flight' },
  ['minecraft:feather', "minecraft:ender_pearl"],
  "minecraft:nether_star")
event.replaceInput(
  { output: "mekanism:digital_miner" },
  ["mekanism:basic_control_circuit"],
  "ae2:quantum_entangled_singularity")
event.replaceInput(
  { output: "mekanism:digital_miner" },
  ["mekanism:logistical_sorter"],
  "ae2:quantum_link")
event.replaceInput(
  { output: ["industrialforegoing:ore_laser_base", "industrialforegoing:fluid_laser_base"] },
  ["minecraft:redstone"],
  "mekanism:ultimate_control_circuit")
event.replaceInput(
  { output: ["industrialforegoing:ore_laser_base", "industrialforegoing:fluid_laser_base"] },
  ["industrialforegoing:plastic"],
  "#iceandfire:dragon_steels")
event.replaceInput(
  { output: ["industrialforegoing:ore_laser_base", "industrialforegoing:fluid_laser_base"] },
  ["industrialforegoing:diamond_gear"],
  "immersiveengineering:component_steel")
event.replaceInput(
  { output: "computercraft:turtle_normal" },
  ["minecraft:iron_ingot"],
  "mekanism:ingot_steel")
event.replaceInput(
  { output: "computercraft:turtle_advanced" },
  ["minecraft:gold_ingot"],
  "create:brass_ingot")
event.replaceInput(
  { output: ["computercraft:turtle_advanced", "computercraft:turtle_normal"] },
  ["minecraft:chest"],
  "mekanism:advanced_control_circuit")
event.replaceInput(
  { output: "create:empty_blaze_burner" },
  ["create:iron_sheet"],
  "immersiveengineering:plate_steel")
event.replaceInput(
  { output: "fluxnetworks:flux_dust" },
  ["minecraft:redstone"],
  "create:powdered_obsidian")
event.replaceInput(
  { output: "fluxnetworks:flux_controller" },
  ["fluxnetworks:flux_dust"],
  "ae2:quantum_entangled_singularity")
event.replaceInput(
  { output: "fluxnetworks:flux_core" },
  ["minecraft:ender_eye"],
  "mekanism:ultimate_control_circuit")
event.replaceInput(
  { output: "ae2:wireless_receiver" },
  ["ae2:quartz_fiber"],
  "mekanism:teleportation_core")
event.replaceInput(
  { output: "ae2:quantum_link" },
  ["#ae2:smart_dense_cable"],
  "mekanism:teleportation_core")
event.replaceInput(
  { output: "sfm:manager" },
  ["#c:chests"],
  "ae2:engineering_processor")
event.replaceInput(
  { output: "sfm:cable" },
  ["minecraft:light_weighted_pressure_plate"],
  "mekanism:ingot_steel")
event.replaceInput(
  { output: "sfm:cable" },
  ["minecraft:black_dye"],
  /mekanism:.*_logistical_transporter/)
event.replaceInput(
  { output: ["functionalstorage:storage_controller", "functionalstorage:framed_storage_controller"] },
  ["minecraft:comparator"],
  "create:precision_mechanism")
event.replaceInput(
  { output: "ars_technica:glyph_fuse" },
  ["ars_nouveau:manipulation_essence"],
  "create:blaze_burner")
event.replaceInput(
  { output: "ars_technica:glyph_fuse" },
  ["ars_nouveau:fire_essence"],
  "create:blaze_cake")
event.replaceInput(
  { output: "ars_technica:glyph_obliterate" },
  ["minecraft:diamond_block","minecraft:anvil"],
  "create:crushing_wheel")
event.replaceInput(
  { output: "ars_technica:glyph_pack" },
  ["minecraft:iron_block"],
  "create:mechanical_press")
event.replaceInput(
  { output: "ars_technica:glyph_whirl" },
  ["ars_nouveau:air_essence"],
  "create:encased_fan")
event.replaceInput(
  { output: "mekanismgenerators:heat_generator" },
  ["mekanism:ingot_osmium"],
  "create:blaze_burner")
})

// Drygmys
const DRYGMY_UUID = '7400926d-1007-4e53-880f-b43e67f2bf29';

function onlyDrygmy(event, entity) {
    return event.addEntityModifier(entity).matchAttackerCustom((attacker) => attacker.uuid.toString() == DRYGMY_UUID);
}
ServerEvents.tags("entity_type", (event) => {
  event.add("ars_nouveau:drygmy_blacklist", ["minecraft:ender_dragon", "minecraft:wither", "minecraft:warden", "@cataclysm", /iceandfire:.*dragon/, "@irons_spellbooks"])
    event.add("industrialforegoing:mob_duplicator_blacklist", ["minecraft:wither", "minecraft:warden", "@cataclysm", /iceandfire:.*dragon/, "@irons_spellbooks"]) 
    event.add("ars_nouveau:jar_blacklist", ["minecraft:wither", "minecraft:warden", "@cataclysm", /iceandfire:.*dragon/, "@irons_spellbooks"]) 
})

// Global Loot
LootJS.modifiers(event => {
  event.addTableModifier(/chests/).removeLoot(["minecraft:netherite_scrap", "minecraft:netherite_ingot", "minecraft:ancient_debris", "minecraft:diamond"])
const isNamedOdinshi = entity => {
  if (entity == null) return false
  return entity.getName().getString() == 'Odinshi'
}
  event.addEntityModifier(["minecraft:player", "minecraft:snow_golem"])
       .matchEntityCustom(isNamedOdinshi)
       .addLoot("kubejs:odins_plush")
})