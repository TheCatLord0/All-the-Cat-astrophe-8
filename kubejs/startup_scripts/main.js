import { effect } from "@package/net/minecraft/world"
StartupEvents.registry('attribute', event => {
  event.create('ars_damage_resistance')
    .range(0, 0, 1)
    .syncable(true)
})
const $MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
ItemEvents.modification(event => {
  event.modify("ars_nouveau:mendosteen_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:recovery",
              /* Duration:       */ 60 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:frostaya_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:freezing",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:bastion_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:shielding",
              /* Duration:       */ 60 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("ars_nouveau:bombegranate_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:blasting",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("ars_elemental:flashpine_pod", item => {
    item.setFood({
        nutrition: 2,
        saturation: 0.4,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:night_vision",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:glowing",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:shocked",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        },
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_elemental:static_charged",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("create:blaze_cake", item => {
    item.setFood({
        nutrition: 8,
        saturation: 8.0,
        eatSeconds: 1.6,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "ars_nouveau:blasting",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 4,
              /* Is ambient:     */ false,
              /* Hide particles: */ true
            )
        }
      ]
    })
  })
  event.modify("malum:sacred_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "apothic_attributes:vitality",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:wicked_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "irons_spellbooks:echoing_strikes",
              /* Duration:       */ 10 * 20,
              /* Level:          */ 4,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:arcane_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "irons_spellbooks:hastened",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:eldritch_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "irons_spellbooks:abyssal_shroud",
              /* Duration:       */ 2 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:aerial_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:slow_falling",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:aqueous_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:water_breathing",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:earthen_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:resistance",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify("malum:infernal_spirit", item => {
    item.setFood({
        nutrition: 0,
        saturation: 0.0,
        eatSeconds: 1.0,
        canAlwaysEat: true,
        effects: [
        {
          probability: 1,
          effectSupplier: () =>
            new $MobEffectInstance(
              /* Effect:         */ "minecraft:fire_resistance",
              /* Duration:       */ 30 * 20,
              /* Level:          */ 0,
              /* Is ambient:     */ false,
              /* Hide particles: */ false
            )
        }
      ]
    })
  })
  event.modify('malum:malignant_stronghold_helmet',
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:mana_steal",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "head"
      ).withModifierAdded(
        "aces_spell_utils:mana_rend",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "head"
      ).withModifierAdded(
        "apothic_attributes:life_steal",
        { amount: 0.0625 , id: "identifier", operation: "add_value", },
        "head"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify('malum:malignant_stronghold_chestplate',
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:mana_steal",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "chest"
      ).withModifierAdded(
        "aces_spell_utils:mana_rend",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "chest"
      ).withModifierAdded(
        "apothic_attributes:life_steal",
        { amount: 0.0625 , id: "identifier", operation: "add_value", },
        "chest"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify('malum:malignant_stronghold_leggings',
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:mana_steal",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "legs"
      ).withModifierAdded(
        "aces_spell_utils:mana_rend",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "legs"
      ).withModifierAdded(
        "apothic_attributes:life_steal",
        { amount: 0.0625 , id: "identifier", operation: "add_value", },
        "legs"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify('malum:malignant_stronghold_boots',
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:mana_steal",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "feet"
      ).withModifierAdded(
        "aces_spell_utils:mana_rend",
        { amount: 0.125, id: "identifier", operation: "add_value", },
        "feet"
      ).withModifierAdded(
        "apothic_attributes:life_steal",
        { amount: 0.0625 , id: "identifier", operation: "add_value", },
        "feet"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
// Dragonsteel

  event.modify(/dragonsteel_.*_helmet/,
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:vigor_reap",
        { amount: 0.05, id: "identifier", operation: "add_value", },
        "head"
      ).withModifierAdded(
        "minecraft:generic.attack_damage",
        { amount: 0.125, id: "identifier", operation: "add_multiplied_base", },
        "head"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify(/dragonsteel_.*_chestplate/,
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:vigor_reap",
        { amount: 0.05, id: "identifier", operation: "add_value", },
        "chest"
      ).withModifierAdded(
        "minecraft:generic.attack_damage",
        { amount: 0.125, id: "identifier", operation: "add_multiplied_base", },
        "chest"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify(/dragonsteel_.*_leggings/,
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:vigor_reap",
        { amount: 0.05, id: "identifier", operation: "add_value", },
        "legs"
      ).withModifierAdded(
        "minecraft:generic.attack_damage",
        { amount: 0.125, id: "identifier", operation: "add_multiplied_base", },
        "legs"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
  event.modify(/dragonsteel_.*_boots/,
    item => {
      const entry = Item.of(item.item().id).attributeModifiers;
      const attributes = entry.withModifierAdded(
        "aces_spell_utils:vigor_reap",
        { amount: 0.05, id: "identifier", operation: "add_value", },
        "feet"
      ).withModifierAdded(
        "minecraft:generic.attack_damage",
        { amount: 0.125, id: "identifier", operation: "add_multiplied_base", },
        "feet"
      )
      item.setAttributeModifiersWithTooltip(attributes.modifiers())
    })
})
StartupEvents.registry('fluid', event => {
  event.create('enkephalin')
    .displayName('Enkephalin')
    .type(type => type
      .renderType(3)
      .stillTexture('thecatlord:block/enkephalin_still')
      .flowingTexture('thecatlord:block/enkephalin_flowing')
      .fallDistanceModifier(0)
      .canSwim(false)
      .canDrown(true)
    )
    .tickRate('10')
    .levelDecreasePerBlock('2')
})
StartupEvents.registry('item', (event) => {
    event.create('craft_first_blade', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Craft The First Blade')
        .ritualTooltip('The blade used by the first murderer.')
    event.create('craft_the_mark', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Conjure The Mark Of Cain')
        .ritualTooltip('There is no resisting the Mark or the Blade, there is only remission and relapse.')
    event.create('remove_the_mark', 'occultism:ritual_dummy')
        .pentacleType("craft")
        .displayName('Ritual: Break the Curse of the Mark')
        .ritualTooltip('Removing it however releases a far greater evil...')
})
ItemEvents.modification(event => {
  event.modify(/iceandfire:armor_.*_helmet/, item => {
    item.maxDamage = 165
  })
  event.modify(/iceandfire:armor_.*_chestplate/, item => {
    item.maxDamage = 240
  })
  event.modify(/iceandfire:armor_.*_leggings/, item => {
    item.maxDamage = 225
  })
  event.modify(/iceandfire:armor_.*_boots/, item => {
    item.maxDamage = 195
  })
  event.modify('gaze:encyclopedia_unveiled', item => {
    item.attachCuriosCapability(
      CuriosJSCapabilityBuilder.create()
        .addAttribute(
          'irons_spellbooks:max_mana',
          'kubejs:gaze_mana',
          200,
          'add_value'
        )
        .addAttribute(
          'irons_spellbooks:spell_power',
          'kubejs:gaze_power',
          0.0,
          'add_value'
        )
        .addAttribute(
          'irons_spellbooks:ender_spell_power',
          'kubejs:gaze_ender',
          0.0,
          'add_value'
        )
        .addAttribute(
          'irons_spellbooks:eldritch_spell_power',
          'kubejs:gaze_eldritch',
          0.1,
          'add_value'
        )
    )
  })
  event.modify('eidolon_repraised:warded_mail', item => {
    item.attachCuriosCapability(
      CuriosJSCapabilityBuilder.create()
        .addAttribute(
          'irons_spellbooks:spell_resist',
          'kubejs:warded_spell_resist',
          0.2,
          'add_value'
        )
        .addAttribute(
          'kubejs:ars_damage_resistance',
          'kubejs:warded_ars_resist',
          0.1,
          'add_value'
        )
    )
  })
  event.modify('irons_spellbooks:teleportation_amulet', item => {
    item.attachCuriosCapability(
      CuriosJSCapabilityBuilder.create()
        .addAttribute(
          'irons_spellbooks:cooldown_reduction',
          'kubejs:teleportation_amulet_cooldown',
          -0.2,
          'add_value'
        )
    )
  })
})
EntityJSEvents.attributes(event => {
  let skeleton = ['minecraft:skeleton', 'minecraft:stray', 'minecraft:bogged']
  let zombie = ['minecraft:zombie', 'minecraft:drowned', 'minecraft:husk']
  skeleton.forEach(skeleton => {
    event.modify(skeleton, attribute => {
        attribute.add("minecraft:generic.max_health", 12)
    })
  })
  zombie.forEach(zombie => {
    event.modify(zombie, attribute => {
        attribute.add("apothic_attributes:armor_shred", 0.2)
    })
  })
})