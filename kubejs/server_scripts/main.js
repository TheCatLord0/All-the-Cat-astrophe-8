// Banned items
let bannedItems = [
   'easy_villagers:auto_trader',
   'easy_villagers:iron_farm',
   "mekanism:jetpack",
   "mekanism:jetpack_armored",
   "mekanism:module_jetpack_unit",
   "ars_nouveau:glyph_blink",
   "mekanism:cardboard_box",
   "sophisticatedbackpacks:feeding_upgrade",
   "sophisticatedbackpacks:advanced_feeding_upgrade",
   "sophisticatedbackpacks:compacting_upgrade",
   "sophisticatedbackpacks:advanced_compacting_upgrade",
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
   "mekanism:module_gravitational_modulating_unit",
   "occultism:trinity_gem",
   "starbunclemania:fluid_sourcelink",
   "industrialforegoing:infinity_backpack",
   "industrialforegoing:infinity_nuke",
   "industrialforegoing:mechanical_dirt",
   "ars_additions:source_spawner",
   "ars_additions:ender_source_jar",
   "sophisticatedbackpacks:mob_catcher_upgrade",
   "sophisticatedbackpacks:advanced_mob_catcher_upgrade",
   'dimdungeons:item_blank_build_key',
   "ars_nouveau:drygmy_charm",
   'dimdungeons:item_blank_teleporter_key',
   'advanced_ae:quantum_helmet',
   'advanced_ae:quantum_chestplate',
   'advanced_ae:quantum_leggings',
   'advanced_ae:quantum_boots',
   'advanced_ae:quantum_upgrade_base',
   'create_lnl:thruster',
   'ars_zero:staff_telekinesis',
   'ars_nouveau:ritual_flight',
   '#curios:crystal',
   '#curios:wing',
   'hazennstuff:health_upgrade_orb',
   'hazennstuff:melee_upgrade_orb',
   'hazennstuff:archery_upgrade_orb',
   'immersiveengineering:toolbox',
   'spectrum:cotton_cloud_boots'
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
// Direct Item Replace
PlayerEvents.inventoryChanged(event => {
  var itemReplaced = (oldItem, newItem) => {
    let player = event.player
    let inventory = player.inventory.items
    if (event.item.id !== oldItem) return
    player.tell([
      Text.darkRed("[Alert] ").bold(),
      Text.gold(event.item.id).bold(),
      Text.gray(" has been replaced with "),
      Text.gold(newItem).bold(),
      Text.gray("."),
      "\n",
      Text.green("If you have questions why, ask thecatlord0 on Discord.")
    ])
    for (let i = 0; i < inventory.length; i++) {
      let slotItem = inventory[i]

      if (slotItem && slotItem.id === oldItem) {
        inventory.set(i, Item.of(newItem, slotItem.count))
      }
    }
  }
  itemReplaced('fdbosses:phase_sphere', 'kubejs:stompeez')
})
// Remove 

let removedRecipe = [
  "occultism:miner_marid_master",
  "occultism:miner_ancient_eldritch",
  "neoorigins:orb_of_origin",
  'dimdungeons:item_portal_key',
  'hazennstuff:eldritch_rune',
  'hazennstuff:eldritch_upgrade_orb',
  'hazennstuff:health_rune',
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
   "occultism:ritual/resurrect_mob",
]
  removedID.forEach(removedID => {
    event.remove({id: removedID })
  })
})
// Item Tags
ServerEvents.tags('item', event => {
  event.add('malum:scythe', [
    'ess_requiem:scythe_of_rotten_dreams',
    'neovitae:sentient_scythe',
    'eidolon_repraised:reaper_scythe',
    'eidolon_repraised:deathbringer_scythe',
    'irons_spellbooks:decrepit_scythe',
    'irons_spellbooks:hellrazor'])
  event.add('c:dusts/salt', 'ratatouille:salt')
  event.remove('curios:ring', 'eidolon_repraised:angels_sight')
})
// Replacement recipes
ServerEvents.recipes(event => {
event.replaceOutput(
  { output: 'irons_spellbooks:fireward_ring'},
  'irons_spellbooks:fireward_ring',
  'kubejs:firecrowned_ring')
event.replaceInput(
  { output: 'mekanism:upgrade_anchor'},
  'mekanism:dust_diamond',
  'irons_spellbooks:blank_rune')
event.replaceInput(
  { output: 'minecraft:lodestone' },
  'minecraft:netherite_ingot',
  'minecraft:iron_ingot')
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
  "immersiveengineering:ingot_steel")
event.replaceInput(
  { output: "sfm:cable" },
  ["minecraft:black_dye"],
  'mekanism:basic_logistical_transporter')
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
  event.replaceInput(
  { output:'createpropulsion:ion_thruster'},
  ["create:precision_mechanism"],
  "extendedae:concurrent_processor")
  event.replaceInput(
  { output:Fluid.of("aeronautics:levitite_blend")},
  Fluid.of("minecraft:water"),
  Fluid.of("industrialforegoing:ether_gas"))
  event.replaceInput(
  { output:"eidolon_repraised:soul_enchanter"},
  ["minecraft:diamond"],
  "spectrum:stratine_gem")
  event.replaceInput(
  { output:'dimdungeons:item_portal_key'},
  ["minecraft:name_tag"],
  "ars_nouveau:spell_parchment")
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
            "minecraft:bow",
            "minecraft:iron_sword",
            "minecraft:iron_axe",
            "minecraft:iron_pickaxe",
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
  event.recipes.occultism.ritual(
    'occultism:miner_marid_master',
    [
      'occultism:miner_afrit_deeps',
      'occultism:iesnium_pickaxe',
      'occultism:spirit_attuned_crystal',
      /iceandfire:dragonsteel_.*_pickaxe/,
      'minecraft:dragon_breath',
      'minecraft:totem_of_undying',
      'minecraft:nether_star',
      'occultism:marid_essence'
    ],
    'occultism:book_of_binding_bound_marid',
    'occultism:craft_marid'
  )
  .duration(240)
  .ritualType('occultism:craft_miner_spirit')
  .dummy('occultism:ritual_dummy/craft_miner_marid_master')
  .id('occultism:ritual/craft_miner_marid_master')
  // New recipes!
  const enkephalinEnemies = (entityIDs) => {
  event.custom({
  type: "industrialforegoing:laser_drill_fluid",
  catalyst: {
    item: "industrialforegoing:lime_laser_lens"
  },
  entity_data: {
    data: {},
    display: "",
    entity: {
      type: entityIDs
    }
  },
  output: {
    amount: 10,
    fluid: "kubejs:enkephalin"
  },
  rarity: [
    {
      biome_filter: {
        "blacklist": [],
        "whitelist": []
      },
      depth_max: 256,
      depth_min: -64,
      dimension_filter: {
        "blacklist": [],
        "whitelist": []
      },
      weight: 8
      }
    ]
  })
}
  enkephalinEnemies('cataclysm:ender_guardian')
  enkephalinEnemies('cataclysm:netherite_monstrosity')
  enkephalinEnemies('cataclysm:ignis')
  enkephalinEnemies('cataclysm:the_harbinger')
  enkephalinEnemies('cataclysm:the_leviathan')
  enkephalinEnemies('cataclysm:ancient_remnant')
  enkephalinEnemies('cataclysm:maledictus')
  enkephalinEnemies('cataclysm:scylla')
  enkephalinEnemies('ars_nouveau:wilden_boss')
  enkephalinEnemies('irons_spellbooks:dead_king')
  enkephalinEnemies('irons_spellbooks:fire_boss')
event.custom({
  type: "neovitae:alchemytable",
  input: [
    {
      item: "kubejs:enkephalin_bucket"
    },
    {
      item: "malum:imitation_heart"
    },
    {
      item: "kubejs:enkephalin_bucket"
    },
    {
      item: "malum:imitation_flesh"
    },
    {
      item: "malum:imitation_flesh"
    },
    {
      item: "malum:imitation_flesh"
    }
  ],
  output: {
    count: 1,
    id: "kubejs:mimicry"
  },
  syphon: 72000,
  ticks: 72000,
  upgradeLevel: 5
  })
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          'minecraft:potion[potion_contents={potion:"minecraft:healing"}]',
          "minecraft:echo_shard",
          "ars_nouveau:source_gem_block",
          "minecraft:echo_shard",
          'minecraft:potion[potion_contents={potion:"minecraft:healing"}]',

        ], // input items
	    "neovitae:blood_orb_weak", // reagent
	    "kubejs:aeternitas_control", // output
	    10000, // source cost
	    false // NBT
	)
  event.custom({
    type: "neovitae:alchemytable",
    input: [
      { item: "malum:imitation_flesh" },
      { item: "minecraft:wither_skeleton_skull" },
      { item: "minecraft:bone_block" },
      { item: "minecraft:player_head" },
      { item: 'eidolon_repraised:zombie_heart' },
      { item: "occultism:spirit_attuned_crystal" }
    ],
    output: {
      count: 1,
      id: "kubejs:tibia"
    },
    syphon: 64000,
    ticks: 12000,
    upgradeLevel: 4
  })
  event.recipes.occultism.ritual(
    "kubejs:first_blade[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]",
    [
      "minecraft:netherite_sword",
      'neovitae:blood_pearl',
      'neovitae:gore_clotted_fang',
      'irons_spellbooks:blood_rune',
      'iceandfire:dragon_bone_block',
      "malum:complete_design",
      'irons_spellbooks:blood_rune'
    ],
    '#iceandfire:mob_skulls',
    "occultism:craft_marid"
  )
  .duration(2000)
  .ritualType("occultism:craft")
  .id("kubejs:ritual/craft_first_blade")
  .dummy('kubejs:craft_first_blade')
  event.recipes.occultism.ritual(
    "kubejs:mark_of_cain",
    [
      'spectrum:freigeist',
      'minecraft:enchanted_golden_apple',
      Item.of('minecraft:ominous_bottle[ominous_bottle_amplifier=4]'),
      'irons_spellbooks:pyrium_ingot'
      
    ],
    'irons_spellbooks:divine_soulshard',
    'occultism:craft_marid'
  )
    .ritualType('occultism:execute_command')
    .dummy('kubejs:remove_the_mark')
    .duration(200)
    .command('curios clear @p[distance=..10,curios={item:{id:"kubejs:mark_of_cain"},slot:["an_focus"]}] an_focus')
    .id('kubejs:ritual/mark_of_cain_removal')
  event.recipes.occultism.ritual(
    "kubejs:mark_of_cain",
    [
      "eidolon_repraised:shadow_gem",
      "malum:malignant_pewter_ingot",
      "minecraft:wither_skeleton_skull",
      "minecraft:nether_star",
      "minecraft:echo_shard",
      "occultism:spirit_attuned_crystal",
      "minecraft:redstone_block"
    ],
    "occultism:book_of_binding_bound_afrit",
    "occultism:craft_afrit"
  )
  .ritualType('occultism:execute_command')
  .duration(1000)
  .id("kubejs:ritual/craft_mark_of_cain")
  .command('curios replace an_focus 0 @p[distance=..10] with kubejs:mark_of_cain[enchantments={levels:{"ars_elemental:soulbound":1,"minecraft:binding_curse":1}},enchantment_glint_override=false]')
  .dummy('kubejs:craft_the_mark')
  .id('kubejs:ritual/mark_of_cain_creation')

  event.recipes.create.mechanical_crafting("neoorigins:orb_of_origin", [
    '  S  ',
    ' PEP ',
    'SEDES',
    ' PEP ',
    '  S  '
  ], {
    D: /iceandfire:dragonegg_.*/,
    E: "ars_elemental:mark_of_mastery",
    P: "mekanism:pellet_polonium",
    S: "create_enchantment_industry:super_experience_nugget"
  })
	event.recipes.ars_nouveau.enchanting_apparatus(
        [
          "kubejs:cat_plush",
          "kubejs:odins_plush"
        ], // input items
	    'minecraft:nether_star', // reagent
	    "kubejs:yaoi_plush", // output
	    100000, // source cost
	    false // NBT
	)
  event.custom({
  type: "malum:void_favor",
  input: {
    item: "kubejs:odins_plush"
  },
  result: {
    count: 1,
    id: "kubejs:odins_shork"
  }
  })
  event.custom({
  type: "spectrum:midnight_solution_converting",
  ingredient: [
    {
      item: "kubejs:rex_plush"
    }
  ],
  result: {
    id: "kubejs:fox_knight",
    count: 1
  }
  })
  event.recipes.ars_nouveau.imbuement(
      '#c:wools',
      'irons_spellbooks:magic_cloth',
      500,
      []
  )
  event.recipes.ars_nouveau.imbuement(
      'create:sturdy_sheet',
      'irons_spellbooks:blank_rune',
      2000,
      []
  )
  event.recipes.create.filling('minecraft:ender_pearl', [Fluid.of('minecraft:water', 500), 'create:powdered_obsidian'])
  event.recipes.create.compacting('create:refined_radiance', ['minecraft:white_dye', 'create:andesite_alloy']).superheated()
  event.recipes.create.compacting('create:shadow_steel', ['minecraft:black_dye', 'create:andesite_alloy']).superheated()
  {
  var helmet = ['hazennstuff:flesh_mass_helmet', 'hazennstuff:the_wither_helmet']
  var chest = ['hazennstuff:flesh_mass_chestplate', 'hazennstuff:the_wither_chestplate']
  var leg = ['hazennstuff:flesh_mass_leggings', 'hazennstuff:the_wither_leggings']
  var boot = ['hazennstuff:flesh_mass_boots', 'hazennstuff:the_wither_boots']
  helmet.forEach(ingredient => {
  event.shaped(
    'hazennstuff:dead_king_helmet',[
    'RBR',
    'BAB',
    ' K '
    ],{
      R: "irons_spellbooks:blood_rune",
      B: "kubejs:kings_rib",
      A: ingredient,
      K: 'irons_spellbooks:bone_key'
     })
  })
  chest.forEach(ingredient => {
  event.shaped(
    'hazennstuff:dead_king_chestplate',[
    'BAB',
    'RKR',
    'BBB'
    ],{
      R: "irons_spellbooks:blood_rune",
      B: "kubejs:kings_rib",
      A: ingredient,
      K: 'irons_spellbooks:bone_key'
     })
  })
  leg.forEach(ingredient => {
  event.shaped(
    'hazennstuff:dead_king_leggings',[
    'RKR',
    'BAB',
    'B B'
    ],{
      R: "irons_spellbooks:blood_rune",
      B: "kubejs:kings_rib",
      A: ingredient,
      K: 'irons_spellbooks:bone_key'
     })
  })
  boot.forEach(ingredient => {
  event.shaped(
    'hazennstuff:dead_king_boots',[
    'RKR',
    'BAB'
    ],{
      R: "irons_spellbooks:blood_rune",
      B: "kubejs:kings_rib",
      A: ingredient,
      K: 'irons_spellbooks:bone_key'
     })
  })
  }
  event.smithing('hazennstuff:true_nights_edge', 'hazennstuff:shadow_scale', 'hazennstuff:nights_edge', 'hazennstuff:hallowed_ingot')
  event.shaped(
    'hazennstuff:thorn_chakram',[
    ' BR',
    'BCR',
    ' BR'
    ],{
      R: 'irons_spellbooks:nature_rune',
      B: 'hazennstuff:overgrown_bone',
      C: 'hazennstuff:chlorophyte_ingot'
    })
  event.shaped(
    'hazennstuff:meowmere',[
    ' D ',
    'ZCZ',
    'ZEZ'
    ],{
      D: 'hazennstuff:deus_essence',
      Z: 'hazennstuff:zenalite_ingot',
      C: 'kubejs:cat_plush',
      E: 'hazennstuff:excalibur_fragment'
    })
 event.smithing('dimdungeons:item_blank_theme_key[dimdungeons:dungeon_key_data={key_activated:false,built:false,dest_x:-1L,dest_z:-1L,name_type:0,name_part_1:0,name_part_2:0,theme:4,dungeon_type:"BASIC"}]', 'minecraft:ender_eye', 'minecraft:trial_key', 'irons_spellbooks:uncommon_ink')
 event.smithing('dimdungeons:item_blank_theme_key[dimdungeons:dungeon_key_data={key_activated:false,built:false,dest_x:-1L,dest_z:-1L,name_type:0,name_part_1:0,name_part_2:0,theme:5,dungeon_type:"BASIC"}]', 'minecraft:ender_eye', 'minecraft:trial_key', 'mekanism:advanced_control_circuit')
})

// Cooldowns
let staffs = [
  "ars_zero:novice_spell_staff",
  "ars_zero:mage_spell_staff",
  "ars_zero:archmage_spell_staff",
  "ars_zero:creative_spell_staff"
]
ItemEvents.rightClicked(staffs, event => {
    const { player, server, item } = event
    server.scheduleInTicks(1, callback => {
    player.addItemCooldown(item, 5)
  })
})
let books = [
    "ars_nouveau:novice_spell_book",
    "ars_nouveau:apprentice_spell_book",
    "ars_nouveau:archmage_spell_book",
    "ars_nouveau:creative_spell_book",
    "not_enough_glyphs:spell_binder",
]
ItemEvents.rightClicked(books, event => {
    const { player, server, item } = event
    server.scheduleInTicks(1, callback => {
    player.addItemCooldown(item, 2)
  })
})
ItemEvents.rightClicked('fdbosses:phase_sphere', event => {
    const {player} = event
    const hpPercent = player.getHealth() * 0.5
    player.damage(hpPercent, "minecraft:magic")
})
ServerEvents.tags("entity_type", (event) => {
    event.add("industrialforegoing:mob_duplicator_blacklist", ["minecraft:wither", "minecraft:warden", "@cataclysm", /iceandfire:.*dragon/, "@irons_spellbooks"]) 
    event.add("ars_nouveau:jar_blacklist", ["minecraft:warden", "@cataclysm", /iceandfire:.*dragon/, "@irons_spellbooks"]) 
})

// Global Loot
LootJS.modifiers(event => {
  event.addTableModifier(/chests/).removeLoot(["minecraft:netherite_scrap", "minecraft:netherite_ingot", "minecraft:ancient_debris", "minecraft:diamond", 'ars_additions:codex_entry'])

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

const isNamedForestQueen558 = entity => {
  if (entity == null) return false
  return entity.getName().getString() == 'ForestQueen558'
}
  event.addEntityModifier(["minecraft:player", "minecraft:snow_golem"])
       .matchEntityCustom(isNamedForestQueen558)
       .addLoot("kubejs:forest_plush")

const isNamedCotyn__ = entity => {
  if (entity == null) return false
  return entity.getName().getString() == 'Cotyn__'
}
  event.addEntityModifier(["minecraft:player", "minecraft:snow_golem"])
       .matchEntityCustom(isNamedCotyn__)
       .addLoot("kubejs:cotyn_plush")

const isNamedRexTheKnight55 = entity => {
  if (entity == null) return false
  return entity.getName().getString() == 'RexTheKnight55'
}
  event.addEntityModifier(["minecraft:player", "minecraft:snow_golem"])
       .matchEntityCustom(isNamedRexTheKnight55)
       .addLoot("kubejs:rex_plush")


  event.addEntityModifier("cataclysm:ender_guardian")
    .addLoot("cataclysm:void_core")
  event.addTableModifier("fdbosses:entities/chesed")
    .replaceLoot("fdbosses:phase_sphere", "kubejs:stompeez")
  event.addTableModifier(/.*/)
    .replaceLoot("irons_spellbooks:fireward_ring", "kubejs:firecrowned_ring")
  event.addEntityModifier("irons_spellbooks:dead_king")
    .addLoot(LootEntry.of("kubejs:kings_rib").setCount([1, 3]).applyEnchantmentBonus([0, 2]))
    
})

// Item Tags
ServerEvents.tags("item", (event) => {
  event.remove("ars_nouveau:magic_food", "@ars_nouveau")
  event.remove("curios:face", "spectrum:glow_vision_goggles")
  event.add("curios:head", "spectrum:glow_vision_goggles")
  event.add("curios:ring", "cataclysm:ring_of_grudged")
  event.remove("curios:rings", "cataclysm:ring_of_grudged")
  event.add("curios:belt", "cataclysm:belt_of_beginner")
  event.remove("curios:waist", "cataclysm:belt_of_beginner")
  event.add("curios:belt", "cataclysm:belt_of_monstrosity")
  event.remove("curios:waist", "cataclysm:belt_of_monstrosity")

})
// EMI Information
RecipeViewerEvents.addInformation('fluid', event => {
	event.add('kubejs:enkephalin', [
		'Obtained from Cataclysm Bosses, Wilden Chimera, Dead King, and Tyros using a Liquid Laser drill.'
	])
})
RecipeViewerEvents.addInformation('item', event => {
	event.add('kubejs:enkephalin_bucket', [
		'Obtained from Cataclysm Bosses, Wilden Chimera, Dead King, and Tyros using a Liquid Laser drill.'
	])
})
EntityJSEvents.biomeSpawns(event => {
    event.removeSpawn('irons_spellbooks:necromancer', ['#minecraft:is_overworld'])
    event.removeSpawn('irons_spellbooks:necromancer', ['#minecraft:is_overworld'])
})
const LivingIncomingDamageEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')
const EntityJoinLevelEvent = Java.loadClass('net.neoforged.neoforge.event.entity.EntityJoinLevelEvent')
const LivingEntity = Java.loadClass('net.minecraft.world.entity.LivingEntity')
const PlayerCurio = Java.loadClass('net.minecraft.world.entity.player.Player')
const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const Registries = Java.loadClass('net.minecraft.core.registries.Registries')
const ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

const arsDamageResistance = BuiltInRegistries.ATTRIBUTE
  .getHolder(ResourceLocation.parse('kubejs:ars_damage_resistance'))
  .orElseThrow()

const bossTag = ResourceLocation.parse('c:bosses')

const reducedDamageTypes = [
  'ars_nouveau:windshear',
  'ars_nouveau:crush',
  'ars_nouveau:flare',
  'ars_nouveau:frost',
  'ars_nouveau:spell',
  'ars_elemental:water_jet',
  'ars_elemental:spark',
  'ars_elemental:poison',
  'ars_elemental:hellfire',
  'ars_elemental:beheading',
  'ars_elemental:cavitation',
  'minecraft:thrown'
].map(id => ResourceKey.create(
  Registries.DAMAGE_TYPE,
  ResourceLocation.parse(id)
))

NativeEvents.onEvent(EntityJoinLevelEvent, event => {
  if (event.getLevel().isClientSide()) return

  const entity = event.getEntity()

  if (!(entity instanceof LivingEntity)) return

  const attribute = entity.getAttribute(arsDamageResistance)

  if (attribute == null) return

  const entityTypeHolder = BuiltInRegistries.ENTITY_TYPE.wrapAsHolder(entity.getType())

  if (entityTypeHolder.isTag(bossTag)) {
    attribute.setBaseValue(0.95)
  } else if (entity instanceof PlayerCurio) {
    attribute.setBaseValue(0.6)
  } else {
    attribute.setBaseValue(0.25)
  }
})
var LivingDamagePre = Java.loadClass(
  'net.neoforged.neoforge.event.entity.living.LivingDamageEvent$Pre'
)
NativeEvents.onEvent(LivingDamagePre, event => {
  const source = event.getSource()
  if (!reducedDamageTypes.some(type => source.is(type))) return
  const resistance = Math.max(
    0,
    Math.min(1, event.getEntity().getAttributeValue(arsDamageResistance))
  )
  if (resistance <= 0) return
  const damage = event.getNewDamage()
  event.setNewDamage(damage * (1 - resistance))
})

const ONESHOT_AMOUNT = 0.9
const ONESHOT_BLACKLIST = [
  'createbigcannons:big_cannon_projectile',
  'createbigcannons:cannon_projectile',
  'create:potato_cannon'
]
NativeEvents.onEvent(LivingDamagePre, event => {
let player = event.entity
  if (!player || !player.isPlayer()) return
let damage = event.getOriginalDamage()
let source = event.getSource()
let damageTypeKey = source.typeHolder().unwrapKey()
  if (damageTypeKey.isEmpty()) return
let damageTypeId = damageTypeKey.get().location().toString()
  if (ONESHOT_BLACKLIST.includes(damageTypeId)) return
let maxHealth = player.getMaxHealth()
let currentHealth = player.getHealth()
  if (currentHealth < maxHealth * ONESHOT_AMOUNT) return
  if (maxHealth * ONESHOT_AMOUNT < damage) {
      event.setNewDamage(maxHealth * ONESHOT_AMOUNT) 
      player.potionEffects.add('kubejs:grace', 1*20, 0)
      player.runCommandSilent(`execute positioned ${player.x} ${player.y} ${player.z} run playsound minecraft:block.respawn_anchor.set_spawn player @a[distance=..12] ~ ~ ~ 2 1`)
      player.runCommandSilent('particle minecraft:cherry_leaves ~ ~2 ~ 1.5 1.5 1.5 0 25 normal')
      player.runCommandSilent('particle minecraft:totem_of_undying ~ ~2 ~ 1.5 1.5 1.5 0 25 normal')
      }
})