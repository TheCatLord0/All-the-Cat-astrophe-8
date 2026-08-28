Platform.mods.kubejs.name = 'TheCatLord'
StartupEvents.modifyCreativeTab('kubejs:tab', event => {
	event.icon = 'minecraft:music_disc_cat'
	event.displayName = Text.darkBlue('Patreon Items')
	event.remove('@kubejs')

    event.add('kubejs:justice[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false,irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:divine_smite",index:0,level:5}],maxSpells:1,mustEquip:0b,spellWheel:1b}]')
    event.add('kubejs:splendor[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false,irons_spellbooks:spell_container={data:[{id:"irons_spellbooks:sunbeam",index:0,level:6}],maxSpells:1,mustEquip:0b,spellWheel:1b}]')

    event.add('kubejs:earthshaker[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')
    event.add('kubejs:eternal_earthshaker[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')

    event.add('kubejs:fixer_scythe[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')
    event.add('kubejs:upgraded_fixer_scythe[unbreakable={show_in_tooltip:0b},enchantment_glint_override=false]')
})
StartupEvents.registry('item', event => {
// Rex_The_Knight55
  event.create('justice', 'sword')
    .displayName('§l§6§kAAA §r§c§lJustice§6§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§4§lSplendor is Justice.')
    .tooltip('Using both weapons causes you to rend flesh with holy power.')
    .tooltip('')
    .tooltip('§lMade for Rex_The_Knight55.')
    .parentModel('thecatlord:item/justice')
    .texture('thecatlord:item/justice')
    .speed(9)
    .attackDamageBonus(4)
  event.create('splendor', 'sword')
    .displayName('§l§c§kAAA §r§6§lSplendor§c§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§4§lJustice is Splendor.')
    .tooltip('Using both weapons causes you to rend flesh with holy power.')
    .tooltip('')
    .tooltip('§lMade for Rex_The_Knight55.')
    .parentModel('thecatlord:item/splendor')
    .texture('thecatlord:item/splendor')
    .speed(9)
    .attackDamageBonus(4)
  event.create('divine_justice', 'sword')
    .displayName('Divine Justice')
    .unstackable()
    .fireResistant(true)
    .tooltip('Deprecated! Turn this into Justice using a smithing table!')
    .parentModel('thecatlord:item/divine_justice')
    .texture('thecatlord:item/divine_justice')
    .speed(0)
    .attackDamageBonus(-4)
// ForestQueen558
  event.create('earthshaker', 'axe')
    .displayName('§l§a§kAAA §r§2§lEarthshaker§a§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§2§lCrush even the Earth.')
    .tooltip('Inflicts Slowness X.')
    .tooltip('')
    .tooltip('§lMade for ForestQueen558.')
    .parentModel('thecatlord:item/earthshaker')
    .texture('thecatlord:item/earthshaker')
    .speed(9)
    .attackDamageBonus(4)
  event.create('eternal_earthshaker', 'axe')
    .displayName('§l§a§kAAA §r§2§lEternal Earthshaker§a§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§2§lCrush even the Earth.')
    .tooltip('Inflicts Slowness X.')
    .tooltip('')
    .tooltip('§lMade for ForestQueen558.')
    .parentModel('thecatlord:item/earthshaker')
    .texture('thecatlord:item/earthshaker')
    .speed(9)
    .attackDamageBonus(16)
// Odinshi
  event.create('fixer_scythe', 'sword')
    .displayName('§1§l§kAAA§r§l§6 Scythe of a§o Certain Fixer§r§l§1§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§6§lA scythe used by a certain fixer. Some say it's capable of cutting through the very fabric of space..")
    .tooltip('Grants Resistance 2 on hit.')
    .tooltip('')
    .tooltip('§lMade for Odinshi.')
    .parentModel('thecatlord:item/fixer_scythe')
    .texture('thecatlord:item/fixer_scythe')
    .speed(9)
    .attackDamageBonus(4)
  event.create('upgraded_fixer_scythe', 'sword')
    .displayName('§1§l§kAAA§r§l§6 Scythe of a§o Certain Fixer§r§l§1§k AAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§6§lA scythe used by a certain fixer. Some say it's capable of cutting through the very fabric of space..")
    .tooltip('§8§lUpgraded.')
    .tooltip('Grants Resistance 2 on hit.')
    .tooltip('')
    .tooltip('§lMade for Odinshi.')
    .parentModel('thecatlord:item/fixer_scythe')
    .texture('thecatlord:item/fixer_scythe')
    .speed(9)
    .attackDamageBonus(16)
})
ItemEvents.modification(event => {
  ['kubejs:justice', 'kubejs:splendor'].forEach(id => {
    event.modify(id, item => {
      let name = id.split(':')[1]
      let attributes = Item.of(id).attributeModifiers
        .withModifierAdded(
          'irons_spellbooks:holy_spell_power',
          { amount: 0.1, id: `cat-astrophe:${name}_holy_offhand`, operation: 'add_value' },
          'offhand'
        )
        .withModifierAdded(
          'apothic_attributes:armor_shred',
          { amount: 0.05, id: `cat-astrophe:${name}_shred_offhand`, operation: 'add_value' },
          'offhand'
        )
        .withModifierAdded(
          'irons_spellbooks:holy_spell_power',
          { amount: 0.2, id: `cat-astrophe:${name}_holy_mainhand`, operation: 'add_value' },
          'mainhand'
        )
        .withModifierAdded(
          'apothic_attributes:armor_shred',
          { amount: 0.1, id: `cat-astrophe:${name}_shred_mainhand`, operation: 'add_value' },
          'mainhand'
        )

      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  })
})
