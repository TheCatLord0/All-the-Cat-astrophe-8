ServerEvents.tags('item', event => {
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_fire_ingot')
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_ice_ingot')
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_lightning_ingot')
})
// Patreon recipes
ServerEvents.recipes(event => {
event.shaped(
  'kubejs:justice[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false],irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:divine_smite",index:0,level:6}],maxSpells:1,mustEquip:0b,spellWheel:1b},irons_spellbooks:casting_implement={}]',
  [
    ' D ',
    ' NG',
    ' BG'
  ],
  {
    D: 'minecraft:diamond',
    B: 'minecraft:blaze_rod',
    G: 'minecraft:gold_ingot',
    N: 'minecraft:netherite_ingot'
  }
)
event.smithing('kubejs:divine_justice[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false],irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:divine_smite",index:0,level:6}],maxSpells:1,mustEquip:0b,spellWheel:1b},irons_spellbooks:casting_implement={}]',
  'minecraft:netherite_upgrade_smithing_template',
  'kubejs:justice',
  '#thecatlord:dragonsteel'
)
event.shaped(
  'kubejs:earthshaker[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
  [
    'ODO',
    'ANA',
    ' L '
  ],
  {
    N: 'minecraft:netherite_ingot',
    O: 'minecraft:dark_oak_leaves',
    A: 'minecraft:flowering_azalea_leaves',
    L: 'minecraft:dark_oak_log',
    D: 'minecraft:diamond'
  }
)
event.smithing(
 'kubejs:eternal_earthshaker[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
  'minecraft:netherite_upgrade_smithing_template',
  'kubejs:earthshaker',
  '#thecatlord:dragonsteel'
)
event.shaped(
  'kubejs:fixer_scythe[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
  [
    'IDG',
    ' NI',
    'G  '
  ],
  {
    N: 'minecraft:netherite_ingot',
    D: 'minecraft:diamond',
    G: 'minecraft:gold_ingot',
    I: 'minecraft:iron_ingot'
  }
)
event.smithing(
 'kubejs:upgraded_fixer_scythe[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]',
  'minecraft:netherite_upgrade_smithing_template',
  'kubejs:fixer_scythe',
  '#thecatlord:dragonsteel'
)
})
// Give Patreon item upon first join
PlayerEvents.loggedIn(event => {
  const p = event.player
  const name = p.username ?? p.name?.string

  if (name !== 'Rex_The_Knight55') return
  if (p.stages.has('first_join')) return

  p.runCommandSilent('kubejs stages add @s first_join')
  p.give('kubejs:justice[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false],irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:divine_smite",index:0,level:6}],maxSpells:1,mustEquip:0b,spellWheel:1b},irons_spellbooks:casting_implement={}]')
})
PlayerEvents.loggedIn(event => {
  const p = event.player
  const name = p.username ?? p.name?.string

  if (name !== 'ForestQueen558') return
  if (p.stages.has('first_join')) return

  p.runCommandSilent('kubejs stages add @s first_join')
  p.give('kubejs:earthshaker[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')
})
PlayerEvents.loggedIn(event => {
  const p = event.player
  const name = p.username ?? p.name?.string

  if (name !== 'Odinshi') return
  if (p.stages.has('first_join')) return

  p.runCommandSilent('kubejs stages add @s first_join')
  p.give('kubejs:fixer_scythe[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')
})

ServerEvents.tags('item', event => {
    event.add('malum:scythe', 'kubejs:fixer_scythe')
    event.add('malum:scythe', 'kubejs:upgraded_fixer_scythe')
})
// Effects on hit
EntityEvents.afterHurt(event => {
    const { entity, source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:earthshaker') return
    entity.potionEffects.add("minecraft:slowness", 20, 9, true, true)
})
EntityEvents.afterHurt(event => {
    const { entity, source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:eternal_earthshaker') return
    entity.potionEffects.add("minecraft:slowness", 20, 9, true, true)
})
EntityEvents.afterHurt(event => {
    const { source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:fixer_scythe') return
    attackingEntity.potionEffects.add("minecraft:resistance", 120, 1, true, true)
})
EntityEvents.afterHurt(event => {
    const { source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:upgraded_fixer_scythe') return
    attackingEntity.potionEffects.add("minecraft:resistance", 120, 1, true, true)
})