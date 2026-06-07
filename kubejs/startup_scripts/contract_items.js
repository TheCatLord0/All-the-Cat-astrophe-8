StartupEvents.modifyCreativeTab('kubejs:tab', event => {
	event.remove('kubejs:martyr_core')
})
StartupEvents.registry('creative_mode_tab', event => {
	event.create('custom_items').icon(() => 'kubejs:martyr_core').displayName('Custom Items').content((showRestrictedITems => [
    'kubejs:martyr_core'
  ]))
})
  const EQUIPPED_TICKS_LEFT_NBT = 'martyr_core_equipped_ticks_left'

  StartupEvents.registry('item', event => {
    event.create('martyr_core')
      .displayName('§4§lMartyr Core')
      .tooltip("§o§cAt the cost of one's life, release a charge of Aeternitas causing massive damage.")
      .maxStackSize(1)
      .tag('curios:necklace')
      .parentModel('thecatlord:item/contract/martyr_core')
      .texture('thecatlord:item/contract/martyr_core')
      .attachCuriosCapability(
        CuriosJSCapabilityBuilder.create()
          .onEquip((slotContext, oldStack, newStack) => {
            const entity = slotContext.entity()
            if (!entity) return

            entity.persistentData.putInt(EQUIPPED_TICKS_LEFT_NBT, 40)
          })
          .onUnequip((slotContext, oldStack, newStack) => {
            const entity = slotContext.entity()
            if (!entity) return

            entity.persistentData.putInt(EQUIPPED_TICKS_LEFT_NBT, 0)
          })
          .curioTick((slotContext, stack) => {
            const entity = slotContext.entity()
            if (!entity) return

            entity.persistentData.putInt(EQUIPPED_TICKS_LEFT_NBT, 40)
          })

          .canEquip((slotContext, stack) => true)
          .canUnequip((slotContext, stack) => true)
      )
  })
  KeyBindEvents.registry(event => {
    event.register('martyr_core_blast', 'KEY_I')
      .inGame()
      .category('key.categories.kubejs.contract_items')
})
