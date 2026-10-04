const ItemAttributeModifiers = Java.loadClass('net.minecraft.world.item.component.ItemAttributeModifiers')

const damage = 'minecraft:generic.attack_damage'
const maxMana = 'irons_spellbooks:max_mana'
const manaRegeneration = 'irons_spellbooks:mana_regen'
const spellPower = 'irons_spellbooks:spell_power'
const spellResist = 'irons_spellbooks:spell_resist'
const arsDamageResist = 'ars_nouveau:sauce.perk.spell_resistance'
const fireSpellPower = 'irons_spellbooks:fire_spell_power'
const enderSpellPower = 'irons_spellbooks:ender_spell_power'
const eldritchSpellPower = 'irons_spellbooks:eldritch_spell_power'
const bloodSpellPower = 'irons_spellbooks:blood_spell_power'
const occultSpellPower = 'discerning_the_eldritch:ritual_spell_power'
const cooldownReduction = 'irons_spellbooks:cooldown_reduction'
const castTimeReduction = 'irons_spellbooks:cast_time_reduction'
const manaSteal = 'aces_spell_utils:mana_steal'
const manaRend = 'aces_spell_utils:mana_rend'
const vigorReap = 'aces_spell_utils:vigor_reap'
const lifeSteal = 'apothic_attributes:life_steal'

ItemEvents.modification(event => {
  const attributeAddition = (itemID, slot, attribute, value, operation) => {
    const modifierAttribute = attribute.replace(':', '_')
    const modifierItem = itemID.replace(':', '_')
    event.modify(itemID, item => {
      const entry = Item.of(item.item().id).attributeModifiers
      const attributes = entry.withModifierAdded(
        attribute,
        {
          amount: value,
          id: `thecatlord:${modifierAttribute}_${modifierItem}`,
          operation: operation
        },
        slot
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  }
  const attributeReplace = (itemID, slot, replacements) => {
    const modifierItem = itemID.replace(':', '_')
    event.modify(itemID, item => {
      const entry = Item.of(item.item().id).attributeModifiers
      const replacedAttributes = replacements.map(replacement => replacement[0])
      const keptModifiers = entry.modifiers().filter(modifier => {
        const modifierAttribute = modifier.attribute().unwrapKey().get().location().toString()
        return !replacedAttributes.includes(modifierAttribute)
      })
      let attributes = ItemAttributeModifiers.builder()
      keptModifiers.forEach(modifier => {
        attributes.add(
          modifier.attribute(),
          modifier.modifier(),
          modifier.slot()
        )
      })
      replacements.forEach(replacement => {
        const attribute = replacement[0]
        const value = replacement[1]
        const operation = replacement[2]
        const modifierAttribute = attribute.replace(':', '_')
        attributes.add(
          attribute,
          {
            amount: value,
            id: `thecatlord:${modifierAttribute}_${modifierItem}`,
            operation: operation
          },
          slot
        )
      })
      item.setAttributeModifiersWithTooltip(attributes.build().modifiers())
    })
  }

  attributeAddition('iceandfire:dragonsteel_fire_helmet', 'head', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_fire_chestplate', 'chest', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_fire_leggings', 'legs', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_fire_boots', 'feet', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_fire_helmet', 'head', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_fire_chestplate', 'chest', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_fire_leggings', 'legs', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_fire_boots', 'feet', vigorReap, 0.125, 'add_value')

  attributeAddition('iceandfire:dragonsteel_ice_helmet', 'head', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_ice_chestplate', 'chest', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_ice_leggings', 'legs', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_ice_boots', 'feet', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_ice_helmet', 'head', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_ice_chestplate', 'chest', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_ice_leggings', 'legs', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_ice_boots', 'feet', vigorReap, 0.125, 'add_value')

  attributeAddition('iceandfire:dragonsteel_lightning_helmet', 'head', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_lightning_chestplate', 'chest', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_lightning_leggings', 'legs', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_lightning_boots', 'feet', damage, 0.125, 'add_multiplied_base')
  attributeAddition('iceandfire:dragonsteel_lightning_helmet', 'head', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_lightning_chestplate', 'chest', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_lightning_leggings', 'legs', vigorReap, 0.125, 'add_value')
  attributeAddition('iceandfire:dragonsteel_lightning_boots', 'feet', vigorReap, 0.125, 'add_value')

  attributeAddition('malum:malignant_stronghold_helmet', 'head', manaSteal, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_chestplate', 'chest', manaSteal, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_leggings', 'legs', manaSteal, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_boots', 'feet', manaSteal, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_helmet', 'head', manaRend, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_chestplate', 'chest', manaRend, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_leggings', 'legs', manaRend, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_boots', 'feet', manaRend, 0.125, 'add_value')
  attributeAddition('malum:malignant_stronghold_helmet', 'head', lifeSteal, 0.0625, 'add_value')
  attributeAddition('malum:malignant_stronghold_chestplate', 'chest', lifeSteal, 0.0625, 'add_value')
  attributeAddition('malum:malignant_stronghold_leggings', 'legs', lifeSteal, 0.0625, 'add_value')
  attributeAddition('malum:malignant_stronghold_boots', 'feet', lifeSteal, 0.0625, 'add_value')

  attributeAddition('kubejs:earthshaker', 'mainhand', 'minecraft:player.entity_interaction_range', 2, 'add_value')

  attributeReplace('hazennstuff:hazel_helmet', 'head', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:hazel_chestplate', 'chest', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:hazel_leggings', 'legs', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:hazel_boots', 'feet', [
    [spellPower, 0.05, 'add_value']
  ])

  attributeReplace('hazennstuff:lemon_god_helmet', 'head', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:lemon_god_chestplate', 'chest', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:lemon_god_leggings', 'legs', [
    [spellPower, 0.05, 'add_value']
  ])
  attributeReplace('hazennstuff:lemon_god_boots', 'feet', [
    [spellPower, 0.05, 'add_value']
  ])

  attributeReplace('hazennstuff:pyrium_battlemage_helmet', 'head', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:pyrium_battlemage_chestplate', 'chest', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:pyrium_battlemage_leggings', 'legs', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:pyrium_battlemage_boots', 'feet', [
    [maxMana, 200, 'add_value']
  ])

  attributeReplace('hazennstuff:dead_king_helmet', 'head', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:dead_king_chestplate', 'chest', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:dead_king_leggings', 'legs', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:dead_king_boots', 'feet', [
    [maxMana, 200, 'add_value']
  ])

  attributeReplace('hazennstuff:garments_of_the_first_flamebearer_helmet', 'head', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:garments_of_the_first_flamebearer_chestplate', 'chest', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:garments_of_the_first_flamebearer_leggings', 'legs', [
    [maxMana, 200, 'add_value']
  ])
  attributeReplace('hazennstuff:garments_of_the_first_flamebearer_boots', 'feet', [
    [maxMana, 200, 'add_value']
  ])

  attributeReplace('hazennstuff:sacred_robes_helmet', 'head', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:sacred_robes_chestplate', 'chest', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:sacred_robes_leggings', 'legs', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:sacred_robes_boots', 'feet', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])

  attributeReplace('hazennstuff:iron431_helmet', 'head', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:iron431_chestplate', 'chest', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:iron431_leggings', 'legs', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:iron431_boots', 'feet', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])

  attributeReplace('hazennstuff:arbitrium_robes_helmet', 'head', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:arbitrium_robes_chestplate', 'chest', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:arbitrium_robes_leggings', 'legs', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
  attributeReplace('hazennstuff:arbitrium_robes_boots', 'feet', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.15, 'add_value']
  ])
})

ItemEvents.modification(event => {
  const curiosFix = (itemID, attribute, value, operation) => {
    const entries = Array.isArray(attribute)
      ? attribute
      : [[attribute, value, operation]]

    const modifierItem = itemID.replace(':', '_')

    event.modify(itemID, item => {
      const builder = CuriosJSCapabilityBuilder.create()
        .modifyAttribute(context => {
          const slot = context.getSlotContext()
          const slotID = `${slot.identifier()}_${slot.index()}`

          entries.forEach((entry, index) => {
            const modifierAttribute = entry[0].replace(':', '_')

            context.modify(
              entry[0],
              `thecatlord:${modifierAttribute}_${modifierItem}_${slotID}_${index}`,
              entry[1],
              entry[2]
            )
          })
        })

      item.attachCuriosCapability(builder)
    })
  }

  curiosFix('irons_spellbooks:teleportation_amulet', cooldownReduction, -0.2, 'add_value')

  curiosFix('hazennstuff:blade_of_the_legate', fireSpellPower, 0.05, 'add_value')
  curiosFix('hazennstuff:the_prefects_ring', fireSpellPower, 0.05, 'add_value')
  curiosFix('hazennstuff:the_tribunes_medallion', fireSpellPower, 0.05, 'add_value')

  curiosFix('irons_spellbooks:cooldown_ring', cooldownReduction, 0.1, 'add_value')

  curiosFix('eidolon_repraised:warded_mail', [
    [spellResist, 0.2, 'add_value'],
    [arsDamageResist, 0.1, 'add_value']
  ])

  curiosFix('gaze:encyclopedia_unveiled', [
    [eldritchSpellPower, 0.1, 'add_value'],
    [maxMana, 200, 'add_value']
  ])

  curiosFix('discerning_the_eldritch:the_apocrypha_spellbook', [
    [maxMana, 200, 'add_value'],
    [eldritchSpellPower, 0.15, 'add_value'],
    [cooldownReduction, 0.1, 'add_value']
  ])

  curiosFix('discerning_the_eldritch:diary_of_decay', [
    [maxMana, 200, 'add_value'],
    [occultSpellPower, 0.05, 'add_value'],
    [spellResist, 0.05, 'add_value'],
    [bloodSpellPower, 0.15, 'add_value']
  ])

  curiosFix('gametechbcs_spellbooks:gtbcs_magical_repository', [
    [maxMana, 200, 'add_value'],
    [spellPower, 0.05, 'add_value'],
    [cooldownReduction, 0.1, 'add_value']
  ])

  curiosFix('hazennstuff:scroll_sheath', [
    [spellPower, 0.1, 'add_value'],
    [spellResist, 0.1, 'add_value']
  ])

  curiosFix('discerning_the_eldritch:casters_mantle', [
    [castTimeReduction, 0.075, 'add_value'],
    [manaRegeneration, 0.075, 'add_value']
  ])

  curiosFix('firesenderexpansion:crystal_heart', [
    [castTimeReduction, 0.05, 'add_value'],
    [enderSpellPower, 0.05, 'add_value']
  ])

  curiosFix('hazennstuff:ring_of_efficiency', [
    [cooldownReduction, 0.075, 'add_value'],
    [castTimeReduction, 0.1, 'add_value']
  ])
})

EntityJSEvents.attributes(event => {
  const skeleton = ['minecraft:skeleton', 'minecraft:stray', 'minecraft:bogged']
  const zombie = ['minecraft:zombie', 'minecraft:drowned', 'minecraft:husk']

  skeleton.forEach(skeleton => {
    event.modify(skeleton, attribute => {
      attribute.add('minecraft:generic.max_health', 12)
      attribute.add('apothic_attributes:dodge_chance', 0.4)
    })
  })

  zombie.forEach(zombie => {
    event.modify(zombie, attribute => {
      attribute.add('apothic_attributes:armor_shred', 0.2)
      attribute.add('apothic_attributes:life_steal', 0.4)
    })

    event.modify('minecraft:spider', attribute => {
      attribute.add('apothic_attributes:dodge_chance', 0.2)
    })
    event.modify('minecraft:cave_spider', attribute => {
      attribute.add('apothic_attributes:dodge_chance', 0.3)
    })
    event.modify('minecraft:creeper', attribute => {
      attribute.add('minecraft:generic.knockback_resistance', 1.0)
    })
  })
})