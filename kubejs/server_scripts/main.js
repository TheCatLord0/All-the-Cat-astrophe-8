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
   "sophisticatedbackpacks:inception_upgrade",
   "ars_zero:augment_amplify_two",
   "ars_zero:augment_amplify_three",
   "ars_zero:augment_aoe_two",
   "ars_zero:augment_aoe_three",
   "ars_zero:effect_conjure_blight",
   "ars_zero:zero_gravity_effect",
   "ars_zero:anchor_effect",
   "ars_zero:effect_convergence",
   "ars_nouveau:glyph_explosion",
   'ars_additions:codex_entry'
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
// Remove 

let removedRecipe = [
]
ServerEvents.recipes(event => {
  removedRecipe.forEach(removedRecipe => {
    event.remove({output: removedRecipe })
  })
let removedID = [
  "ars_nouveau:novice_spell_book",
    "ars_nouveau:novice_spellbook_alt",
  "ars_zero:novice_spell_staff",
  "ars_nouveau:apprentice_spell_book",
    "ars_nouveau:apprentice_book_upgrade",
  "ars_zero:mage_spell_staff",
  "ars_nouveau:archmage_spell_book",
    "ars_nouveau:archmage_book_upgrade",  
  "ars_zero:archmage_spell_staff",
   "ars_zero:spellcasting_circlet",
]
  removedID.forEach(removedID => {
    event.remove({id: removedID })
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
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
            "minecraft:bow",
            "minecraft:iron_sword",
            "minecraft:iron_axe",
            "minecraft:iron_hoe",
            "minecraft:iron_shovel",
            "ars_nouveau:source_gem_block",
        ], // input items
	    ["ars_nouveau:worn_notebook", "minecraft:book"], // reagent
	    "ars_nouveau:novice_spell_book", // output
	    10000, // source cost
	    // true // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "create:blaze_burner",
          "ars_nouveau:source_gem_block",
          "minecraft:diamond",
          "minecraft:diamond",
          "minecraft:quartz_block",
          "minecraft:quartz_block",
          "minecraft:obsidian",
          "malum:soul_stained_steel_ingot",
        ], // input items
	    "ars_nouveau:novice_spell_book", // reagent
	    "ars_nouveau:apprentice_spell_book", // output
	    50000, // source cost
	    true // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "ars_nouveau:wilden_tribute",
          "minecraft:nether_star",
          "minecraft:totem_of_undying",
          "malum:malignant_pewter_ingot",
          "irons_spellbooks:pyrium_ingot",
          "minecraft:echo_shard",
          "cataclysm:void_core",
          "minecraft:dragon_breath",
        ], // input items
	    "ars_nouveau:apprentice_spell_book", // reagent
	    "ars_nouveau:archmage_spell_book", // output
	    100000, // source cost
	    true // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "ars_zero:archwood_rod",
          "ars_zero:archwood_rod",
          "minecraft:gold_block",
          "minecraft:ender_pearl",
          "minecraft:phantom_membrane",
          "eidolon_repraised:shadow_gem",
        ], // input items
	    "ars_nouveau:novice_spell_book", // reagent
	    "ars_zero:novice_spell_staff", // output
	    10000, // source cost
	    false // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "irons_spellbooks:epic_ink",
          "minecraft:blaze_rod",
          "minecraft:blaze_rod",
          "minecraft:crying_obsidian",
          "malum:hallowed_gold_ingot",
          "iceandfire:pixie_dust",
          "#iceandfire:scales/dragon",
          "minecraft:diamond",
        ], // input items
	    "ars_nouveau:apprentice_spell_book", // reagent
	    "ars_zero:mage_spell_staff", // output
	    20000, // source cost
	    false // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "irons_spellbooks:mithril_ingot",
          "irons_spellbooks:legendary_ink",
          "irons_spellbooks:ruined_book",
          "minecraft:heart_of_the_sea",
          "cataclysm:ignitium_ingot",
          "malum:complete_design",
          "minecraft:heavy_core",
          "#iceandfire:dragon_steels", 
        ], // input items
	    "ars_nouveau:archmage_spell_book", // reagent
	    "ars_zero:archmage_spell_staff", // output
	    30000, // source cost
	    false // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "irons_spellbooks:epic_ink",
          "minecraft:blaze_rod",
          "minecraft:blaze_rod",
          "minecraft:crying_obsidian",
          "malum:hallowed_gold_ingot",
          "iceandfire:pixie_dust",
          "#iceandfire:scales/dragon",
          "minecraft:diamond",
          "ars_nouveau:apprentice_spell_book",
        ], // input items
	    "ars_zero:novice_spell_staff", // reagent
	    "ars_zero:mage_spell_staff", // output
	    20000, // source cost
	    false // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "irons_spellbooks:mithril_ingot",
          "irons_spellbooks:legendary_ink",
          "irons_spellbooks:ruined_book",
          "minecraft:heart_of_the_sea",
          "cataclysm:ignitium_ingot",
          "malum:complete_design",
          "minecraft:heavy_core",
          "#iceandfire:dragon_steels",
          "ars_nouveau:archmage_spell_book", 
        ], // input items
	    "ars_zero:mage_spell_staff", // reagent
	    "ars_zero:archmage_spell_staff", // output
	    30000, // source cost
	    true // NBT
	)
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "irons_spellbooks:mithril_ingot",
          "irons_spellbooks:legendary_ink",
          "irons_spellbooks:ruined_book",
          "minecraft:heart_of_the_sea",
          "cataclysm:ignitium_ingot",
          "malum:complete_design",
          "minecraft:heavy_core",
          "#iceandfire:dragon_steels",
          "ars_nouveau:archmage_spell_book", 
        ], // input items
	    "ars_zero:dull_circlet", // reagent
	    "ars_zero:spellcasting_circlet", // output
	    50000, // source cost
	    false // NBT
	)
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
const isNamedTheCatLord0 = entity => {
  if (entity == null) return false
  return entity.getName().getString() == 'TheCatLord0'
}
  event.addEntityModifier(["minecraft:player", "minecraft:snow_golem"])
       .matchEntityCustom(isNamedTheCatLord0)
       .addLoot("kubejs:cat_plush")

  event.addEntityModifier("cataclysm:ender_guardian")
    .addLoot("cataclysm:void_core")
})