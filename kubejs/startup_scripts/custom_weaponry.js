Platform.mods.kubejs.name = 'TheCatLord'
StartupEvents.registry('creative_mode_tab', event => {
	event.create('weaponry').icon(() => 'kubejs:mimicry').displayName(('Weaponry')).content(showRestrictedItems => [
            'kubejs:executioner',
            'kubejs:mimicry',
            'kubejs:ego_mimicry',
            'kubejs:tibia',
            'kubejs:callisto_tibia',
            'kubejs:first_blade',
            'kubejs:mark_of_cain',
            'kubejs:stompeez',
            'kubejs:palindrome',
            'kubejs:debt'
  ])
})
StartupEvents.modifyCreativeTab('kubejs:weaponry', event => {
    event.remove('kubejs:executioner')
    event.remove('kubejs:mimicry')
    event.remove('kubejs:ego_mimicry')
    event.remove('kubejs:tibia')
    event.remove('kubejs:callisto_tibia')
    event.remove('kubejs:first_blade')
    event.remove('kubejs:mark_of_cain')
    event.remove('kubejs:stompeez')
    event.remove('kubejs:palindrome')
    event.remove('kubejs:debt')

    event.add([
        Item.of('kubejs:executioner[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:mimicry[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:ego_mimicry[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:tibia[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:callisto_tibia[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:first_blade[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:palindrome[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:debt[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:mark_of_cain[enchantment_glint_override=false]'),
        Item.of('kubejs:stompeez[enchantment_glint_override=false]')
    ])
})
StartupEvents.registry('item', event => {
  event.create('mimicry', 'sword')
    .displayName('§8§l§kAAA §r§4Mimicry §8§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§4§lThe yearning to imitate the human form is sloppily reflected on the E.G.O, as if it were a reminder that it should remain a mere desire.")
    .tooltip("§4§lWhen the unfamiliar and otherworldly eyes stare at you, you will feel a chill up your spine.")
    .tooltip('Heals you for 25% of your damage while this is in your hand.')
    .parentModel('thecatlord:item/mimicry')
    .texture('thecatlord:item/mimicry')
    .speed(9)
    .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('tibia', 'sword')
  .displayName('§4§l§kAAA §r§7Tibia §4§l§kAAA')
  .unstackable()
  .fireResistant(true)
  .rarity('EPIC')
  .tooltip("§7§lVeins and arteries. The bicolor shades of red that will flow out of you... Aah...! Marvelous art!")
  .tooltip('Inflicts Corpus which causes burst damage at 10 stacks.')
  .parentModel('thecatlord:item/tibia')
  .texture('thecatlord:item/tibia')
  .speed(9)
  .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('executioner', 'sword')
    .displayName("§0§l§kAAA §r§6Executioner's Sword §0§l§kAAA")
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§6§lEven if I'm the only one, I want to keep my eyes open.")
    .tooltip('Instantly kills any mob.')
    .parentModel('thecatlord:item/executioner_sword')
    .texture('kubejs:item/executioner_sword')
})
StartupEvents.registry('item', event => {
  event.create('first_blade', 'sword')
    .displayName('§8§l§kAAA §r§cThe First Blade §8§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§4§lA blade fashioned from the jaw of a donkey, only one linked to the first killer can use its power.')
    .parentModel('thecatlord:item/first_blade')
    .texture('thecatlord:item/first_blade')
    .speed(9)
    .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('palindrome', 'sword')
    .displayName('§6§l§kAAA §r§bPalindrome §6§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§b§lDraw, O Coward!')
    .tooltip('')
    .tooltip('After 3 hits it will repeat the damage of those 3 hits.')
    .parentModel('thecatlord:item/palindrome')
    .texture('thecatlord:item/palindrome')
    .speed(9)
    .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('debt', 'pickaxe')
    .displayName('§8§l§kAAA §r§6Debt §8§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip('§6§lAll the world will be mine.')
    .tooltip('')
    .tooltip('Stores damage dealt to be used later either as defense or offense.')
    .tooltip('Right Click to activate.')
    .parentModel('thecatlord:item/debt')
    .texture('thecatlord:item/debt')
    .speed(2)
    .attackDamageBonus(8)
})
StartupEvents.registry('item', event => {
  event.create('mark_of_cain')
    .displayName('§8§l§kAAAA §r§4The Mark Of Cain §8§l§kAAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§4§lThe Mark didn't change you, it just made you more of what you already were.")
    .texture('thecatlord:item/mark_of_cain')
    .tag('curios:an_focus')
    .attachCuriosCapability(
        CuriosJSCapabilityBuilder.create()
            .addAttribute(
                "malum:healing_received",
                "cdc642c8-25e3-4d23-9a11-7bc6963f4639",
                -0.5,
                'add_value'
            )
            .addAttribute(
                "minecraft:generic.attack_damage",
                "024f9ec8-618b-4354-b855-6d175d3e11c0",
                0.5,
                'add_multiplied_total'
            )
    )
  event.create('stompeez')
    .displayName('§b§l§kAA §r§1STOMPEEZ §b§l§kAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§1§lI call them the Stompeez! For when your legs need that extra kick!")
    .tooltip('')
    .tooltip('Dashes in the direction of your current momentium.')
    .tooltip('Use Left Alt (Default) to activate.')
    .texture('thecatlord:item/stompeez')
    .tag('curios:feet')
    .attachCuriosCapability(
      CuriosJSCapabilityBuilder.create()
        .addAttribute(
          'minecraft:generic.movement_speed',
          'kubejs:stompeez_speed',
          0.1,
          'add_multiplied_base'
        )
        .addAttribute(
          'minecraft:generic.jump_strength',
          'kubejs:stompeez_jump',
          0.5,
          'add_multiplied_base'
        )
    )
})
    const CORPUS_EFFECT = 'kubejs:corpus'

    const CORPUS_MAX_STACKS = 10
    const CORPUS_BURST_PERCENT = 0.25
    const CORPUS_MIN_BURST_DAMAGE = 2

    function getAmplifier(effectInstance) {
        if (effectInstance == null) return -1
        return effectInstance.amplifier
    }

    function dealCorpusDamage(entity) {
        let hpBase = entity.getMaxHealth()
        let damage = Math.max(CORPUS_MIN_BURST_DAMAGE, hpBase * CORPUS_BURST_PERCENT)

        try {
            entity.invulnerableTime = 0
        } catch (e) {}

        entity.attack(entity.damageSources().magic(), damage)
    }

    StartupEvents.registry('mob_effect', event => {
        event.create('corpus')
            .harmful()
            .color(0x8b0000)
            .effectTick((entity, amplifier) => {
                let active = entity.potionEffects.getActive(CORPUS_EFFECT)
                let currentAmp = getAmplifier(active)

                if (currentAmp < CORPUS_MAX_STACKS - 1) return

                entity.removeEffect(CORPUS_EFFECT)
                dealCorpusDamage(entity)
            })
})
