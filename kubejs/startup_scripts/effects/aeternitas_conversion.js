StartupEvents.modifyCreativeTab('kubejs:custom_items', event => {
	event.add('kubejs:aeternitas_control')
})
StartupEvents.modifyCreativeTab('kubejs:tab', event => {
	event.remove('kubejs:aeternitas_control')
})
StartupEvents.registry('mob_effect', event => {
  event.create('aeternitas_conversion')
    .beneficial()
    .color(0x3AA6FF)
})
  const KEY_ID = 'aeternitas_conversion'

  KeyBindEvents.registry(event => {
    event.register('aeternitas_conversion', 'KEY_P')
      .inGame()
      .category('key.categories.kubejs.thecatlord')
})
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
const $ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
const $Registries = Java.loadClass('net.minecraft.core.registries.Registries')
const $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')

const AETERNITAS_EFFECT_ID = 'kubejs:aeternitas_conversion'
const AETERNITAS_ACTIVE_KEY = 'aeternitas_conversion_active'

function getAeternitasEffect() {
  return $BuiltInRegistries.MOB_EFFECT.getHolderOrThrow(
    $ResourceKey.create(
      $Registries.MOB_EFFECT,
      $ResourceLocation.parse(AETERNITAS_EFFECT_ID)
    )
  )
}

function disableAeternitasConversion(entity) {
  if (entity == null) return

  entity.removeEffect(getAeternitasEffect())

  if (entity.persistentData != null) {
    entity.persistentData.putBoolean(AETERNITAS_ACTIVE_KEY, false)
  }
}

StartupEvents.registry('item', event => {
  event.create('aeternitas_control')
  .maxStackSize(1)
  .displayName('§5§lControl of Internal Aeternitas')
  .tooltip('§o§dAeternitas is within everyone and everything, including your very blood.')
  .tooltip('')
  .tooltip('Inverts all healing to turn into Mana')
  .tooltip('Use P Key (Default) to activate.')
  .texture('thecatlord:item/aeternitas_control')
    .tag('curios:charm')

    .attachCuriosCapability(
      CuriosJSCapabilityBuilder.create()
        .onUnequip((slotContext, oldStack, newStack) => {
          disableAeternitasConversion(slotContext.entity())
        })
        .canEquip((slotContext, stack) => true)
        .canUnequip((slotContext, stack) => true)
    )
})
