import { effect } from "@package/net/minecraft/world"
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
  event.create('kings_rib')
    .displayName('Rib of a Fallen King')
    .texture('thecatlord:item/kings_rib')
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
})
