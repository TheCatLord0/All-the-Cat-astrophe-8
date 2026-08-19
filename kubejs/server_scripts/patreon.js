// Configuration

// Earthshaker
const EARTHSHAKER_TIME = 25
const EARTHSHAKER_POWER = 9
// Blue Reverbiation
const REVERB_TIME = 120
const REVERB_POWER = 1

// Actual code
ServerEvents.tags('item', event => {
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_fire_ingot')
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_ice_ingot')
  event.add('thecatlord:dragonsteel', 'iceandfire:dragonsteel_lightning_ingot')
})
// Patreon recipes
ServerEvents.recipes(event => {
event.shaped(
  'kubejs:justice[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false],irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:divine_smite",index:0,level:5}],maxSpells:1,mustEquip:0b,spellWheel:1b}]',
  [
    'LNL',
    'GDG',
    ' B '
  ],
  {
    L: 'minecraft:lapis_lazuli',
    N: 'minecraft:netherite_ingot',
    G: 'minecraft:gold_ingot',
    D: 'minecraft:diamond_sword',
    B: 'minecraft:blaze_rod',
  }
)
event.shaped(
  'kubejs:splendor[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false],irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:sunbeam",index:0,level:6}],maxSpells:1,mustEquip:0b,spellWheel:1b}]',
  [
    'GNG',
    'LDL',
    ' B '
  ],
  {
    L: 'minecraft:lapis_lazuli',
    N: 'minecraft:netherite_ingot',
    G: 'minecraft:gold_ingot',
    D: 'minecraft:diamond_sword',
    B: 'minecraft:blaze_rod',
  }
)
event.smithing('kubejs:justice',
  'minecraft:iron_nugget',
  'kubejs:divine_justice'
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
    D: 'minecraft:diamond_axe'
  }
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
    D: 'minecraft:diamond_sword',
    G: 'minecraft:gold_ingot',
    I: 'minecraft:iron_ingot'
  }
)
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
    entity.potionEffects.add("minecraft:slowness", EARTHSHAKER_TIME, EARTHSHAKER_POWER, true, true)
})
EntityEvents.afterHurt(event => {
    const { entity, source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:eternal_earthshaker') return
    entity.potionEffects.add("minecraft:slowness", EARTHSHAKER_TIME, EARTHSHAKER_POWER, true, true)
})
EntityEvents.afterHurt(event => {
    const { source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:fixer_scythe') return
    attackingEntity.potionEffects.add("minecraft:resistance", REVERB_TIME, REVERB_POWER, true, true)
})
EntityEvents.afterHurt(event => {
    const { source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:upgraded_fixer_scythe') return
    attackingEntity.potionEffects.add("minecraft:resistance", REVERB_TIME, REVERB_POWER, true, true)
})
const bloodKey = ResourceKey.create(Registries.ATTRIBUTE, ResourceLocation.parse('irons_spellbooks:blood_spell_power'))
const Reduction = Java.loadClass('net.neoforged.neoforge.common.damagesource.DamageContainer$Reduction')
NativeEvents.onEvent(LivingIncomingDamageEvent, event => {
    let target = event.entity
    let player = event.source.player
    if (!player) return

    let main = player.mainHandItem.id
    let off = player.offHandItem.id
    if (!((main === 'kubejs:justice' && off === 'kubejs:splendor') || (main === 'kubejs:splendor' && off === 'kubejs:justice'))) return

    let access = target.level.registryAccess()
    let blood = target.getAttributeValue(access.registryOrThrow(Registries.ATTRIBUTE).getHolderOrThrow(bloodKey))

    if (target.isInvertedHealAndHarm() || blood > 0) event.amount *= 1.5
    event.addReductionModifier(Reduction.ENCHANTMENTS, (container, reduction) => 0)
})