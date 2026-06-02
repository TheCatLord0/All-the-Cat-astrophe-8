var DISSONANT_CONTRACT_ITEMS = [
    'kubejs:executioner',
    'kubejs:cat_plush'
]

var DISSONANT_CONTRACTS = [
    {
        id: 'embers',
        short: 'Fire',
        name: 'Fear no Fire',
        desc: "Having been afraid of fire all one's life will make them gravitate towards this type of Contract which lowers one's health but grants them the magical effect of Fire Resistance. (-1 Hearts, +Fire Resistance)",
        attrs: [{ attr: 'minecraft:generic.max_health', id: 'dissonant:embers_health', amount: -2 }],
        fx: [{ id: 'minecraft:fire_resistance', amp: 0 }]
    },
    {
        id: 'knight',
        short: 'Metal',
        name: 'Metal Ossification',
        desc: 'This #Contract slowly, painfully, eternally changes your bones to be that of metal causing you to move extremely slowly however your bones will not break. (+6 Armor, +Slowness I)',
        attrs: [{ attr: 'minecraft:generic.armor', id: 'dissonant:knight_armor', amount: 6 }],
        fx: [{ id: 'minecraft:slowness', amp: 0 }]
    },
    {
        id: 'waif',
        short: 'Tiny',
        name: "Tiny Soul, Large Heart",
        desc: 'You were always the smaller person at heart, having this Contract will make you faster at the cost of there being less surface area to protect from any attack. (-40% Size, +20% Speed, -3 Heart)',
        attrs: [
            { attr: 'minecraft:generic.scale', id: 'dissonant:waif_scale', amount: -0.4 },
            { attr: 'minecraft:generic.movement_speed', id: 'dissonant:waif_speed', amount: 0.2, op: 'add_multiplied_base' },
            { attr: 'minecraft:generic.max_health', id: 'dissonant:waif_health', amount: -6 }
        ],
        fx: []
    },
    {
        id: 'revenant',
        short: 'Revenant',
        name: 'Revenant',
        desc: "One dies only when their soul escapes their corpse, what if we locked it to this plane? Which the Revenant Contract does exactly however, the body doesn't take the time to recover causing them to be frailer. (Death Prevention, -1 Heart per Prevention)",
        attrs: [],
        fx: []
    },
    {
        id: 'leviathan',
        short: 'Leviathan',
        name: 'Leviathan',
        desc: 'You were always fascinated by the Deep, drawn towards it, your soul screams to be within it, your body disallowed it, this Contract will force it into the Deep. (Water Breathing, 3x Swim Speed, -20% Land Speed)',
        attrs: [
            { attr: 'minecraft:generic.water_movement_efficiency', id: 'dissonant:leviathan_swim', amount: 2 },
            { attr: 'minecraft:generic.movement_speed', id: 'dissonant:leviathan_land', amount: -0.2, op: 'add_multiplied_base' }
        ],
        fx: [{ id: 'minecraft:water_breathing', amp: 0 }]
    },
    {
        id: 'colossus',
        short: 'Large',
        name: "Large Soul, Tiny Heart",
        desc: "Always the bigger person even if the other was wrong, your soul reflected that you wished to be a wall for others but your frail body wouldn't allow it, until this Contract was branded onto you. (+50% Size, +4 Attack, +Gravity, Hunger I)",
        attrs: [
            { attr: 'minecraft:generic.scale', id: 'dissonant:colossus_scale', amount: 0.5 },
            { attr: 'minecraft:generic.attack_damage', id: 'dissonant:colossus_damage', amount: 4 },
            { attr: 'minecraft:generic.gravity', id: 'dissonant:colossus_gravity', amount: 0.05 }
        ],
        fx: [{ id: 'minecraft:hunger', amp: 0 }]
    },
    {
        id: 'void_chord',
        short: 'Void Song',
        name: 'Song of the Void',
        desc: "Contrary to the believe that Resonant are Angels they are nothing more than another creature in the world that have free will, so they will make a deal with a Dissonant to use darker powers. (Channel consumes 3 Hearts)",
        attrs: [],
        fx: [],
        color: 'aqua',
        originReq: 'resonant_is_owner'
    },
    {
        id: 'overclock',
        short: '20000 Volts',
        name: "DEATH AT 20,000 VOLTS",
        desc: 'Less of a Contract between Automaton and Dissonant and more of a modification to your core circuits, letting you turn your Potential Energy into Electric. (80%< Momentium turns attacks electric, Uses 40% Momentium per hit)',
        attrs: [],
        fx: [],
        color: 'yellow',
        originReq: 'automaton_is_owner'
    }
]


function dissonantGetcontract(id) {
    for (var i = 0; i < DISSONANT_CONTRACTS.length; i++) {
        if (DISSONANT_CONTRACTS[i].id === id) return DISSONANT_CONTRACTS[i]
    }
    return null
}

function dissonantGetPlayercontracts(player) {
    try {
        if (!player.persistentData.contains('dissonant_contracts')) return []
        return JSON.parse(player.persistentData.getString('dissonant_contracts'))
    } catch(e) { return [] }
}

function dissonantSavePlayercontracts(player, list) {
    player.persistentData.putString('dissonant_contracts', JSON.stringify(list))
}

function dissonantGetcontractOwners(player) {
    try {
        if (!player.persistentData.contains('dissonant_contract_owners')) return {}
        return JSON.parse(player.persistentData.getString('dissonant_contract_owners'))
    } catch(e) { return {} }
}

function dissonantSavecontractOwners(player, owners) {
    player.persistentData.putString('dissonant_contract_owners', JSON.stringify(owners))
}

function dissonantCanRemovecontract(dissonantName, target, contractId) {
    try {
        if (!target.persistentData.contains('dissonant_contract_owners')) return true
        var owners = JSON.parse(target.persistentData.getString('dissonant_contract_owners'))
        if (!owners[contractId]) return true
        return owners[contractId] === dissonantName
    } catch(e) { return true }
}

function dissonantFilterRemovable(dissonantName, target, contractList) {
    var result = []
    for (var i = 0; i < contractList.length; i++) {
        if (dissonantCanRemovecontract(dissonantName, target, contractList[i])) result.push(contractList[i])
    }
    return result
}

function dissonantApplyAttrs(player, contract) {
    var srv = player.level.getServer()
    for (var i = 0; i < contract.attrs.length; i++) {
        var a = contract.attrs[i]
        srv.runCommandSilent('attribute ' + player.username + ' ' + a.attr + ' modifier remove ' + a.id)
        srv.runCommandSilent('attribute ' + player.username + ' ' + a.attr + ' modifier add ' + a.id + ' ' + a.amount + ' ' + (a.op || 'add_value'))
    }
}

function dissonantRemoveAttrs(player, contract) {
    var srv = player.level.getServer()
    for (var i = 0; i < contract.attrs.length; i++) {
        srv.runCommandSilent('attribute ' + player.username + ' ' + contract.attrs[i].attr + ' modifier remove ' + contract.attrs[i].id)
    }
}

function dissonantApplyFx(player, contract) {
    var srv = player.level.getServer()
    for (var i = 0; i < contract.fx.length; i++) {
        srv.runCommandSilent('effect give ' + player.username + ' ' + contract.fx[i].id + ' 999999 ' + contract.fx[i].amp + ' true')
    }
}

function dissonantApplyCost(player) {
    var hp = player.health
    if (hp <= 1.0) return
    var dmg = Math.min(8.0, hp - 1.0)
    player.level.getServer().runCommandSilent('damage ' + player.username + ' ' + dmg + ' minecraft:out_of_world')
}

function dissonantApplycontract(player, contractId, dissonantName) {
    var contract = dissonantGetcontract(contractId)
    if (!contract) return false
    var list = dissonantGetPlayercontracts(player)
    if (list.indexOf(contractId) !== -1) return false
    list.push(contractId)
    dissonantSavePlayercontracts(player, list)
    var owners = dissonantGetcontractOwners(player)
    owners[contractId] = dissonantName || ''
    dissonantSavecontractOwners(player, owners)
    dissonantApplyAttrs(player, contract)
    dissonantApplyFx(player, contract)
    return true
}

function dissonantRevenantCleanup(player) {
    player.level.getServer().runCommandSilent('attribute ' + player.username + ' minecraft:generic.max_health modifier remove dissonant:revenant_drain')
    player.persistentData.remove('dissonant_revenant_drain')
    player.persistentData.remove('dissonant_revenant_pending')
    player.persistentData.remove('dissonant_revenant_x')
    player.persistentData.remove('dissonant_revenant_y')
    player.persistentData.remove('dissonant_revenant_z')
    player.persistentData.remove('dissonant_revenant_dim')
}

function dissonantPurgeAllcontracts(target) {
    var list = dissonantGetPlayercontracts(target)
    var srv = target.level.getServer()
    for (var i = 0; i < list.length; i++) {
        var contract = dissonantGetcontract(list[i])
        if (!contract) continue
        dissonantRemoveAttrs(target, contract)
        for (var j = 0; j < contract.fx.length; j++) {
            srv.runCommandSilent('effect clear ' + target.username + ' ' + contract.fx[j].id)
        }
    }
    srv.runCommandSilent('attribute ' + target.username + ' minecraft:generic.max_health modifier remove dissonant:revenant_drain')
    target.persistentData.remove('dissonant_contracts')
    target.persistentData.remove('dissonant_revenant_drain')
    target.persistentData.remove('dissonant_revenant_pending')
    target.persistentData.remove('dissonant_revenant_x')
    target.persistentData.remove('dissonant_revenant_y')
    target.persistentData.remove('dissonant_revenant_z')
    target.persistentData.remove('dissonant_revenant_dim')
    target.persistentData.remove('dissonant_contract_owners')
    dissonantClearIncoming(target)
}

function dissonantRemovecontract(player, contractId) {
    var contract = dissonantGetcontract(contractId)
    if (!contract) return false
    var list = dissonantGetPlayercontracts(player)
    var idx = list.indexOf(contractId)
    if (idx === -1) return false
    list.splice(idx, 1)
    dissonantSavePlayercontracts(player, list)
    var owners = dissonantGetcontractOwners(player)
    delete owners[contractId]
    dissonantSavecontractOwners(player, owners)
    dissonantRemoveAttrs(player, contract)
    if (contractId === 'revenant') dissonantRevenantCleanup(player)
    for (var i = 0; i < contract.fx.length; i++) {
        var stillNeeded = false
        for (var j = 0; j < list.length; j++) {
            var p2 = dissonantGetcontract(list[j])
            if (!p2) continue
            for (var k = 0; k < p2.fx.length; k++) {
                if (p2.fx[k].id === contract.fx[i].id) { stillNeeded = true; break }
            }
            if (stillNeeded) break
        }
        if (!stillNeeded) {
            player.level.getServer().runCommandSilent('effect clear ' + player.username + ' ' + contract.fx[i].id)
        }
    }
    return true
}

function dissonantRestoreFx(player) {
    var list = dissonantGetPlayercontracts(player)
    for (var i = 0; i < list.length; i++) {
        var contract = dissonantGetcontract(list[i])
        if (contract) dissonantApplyFx(player, contract)
    }
}

function dissonantRestoreAttrs(player) {
    var list = dissonantGetPlayercontracts(player)
    var srv = player.level.getServer()
    for (var i = 0; i < list.length; i++) {
        var contract = dissonantGetcontract(list[i])
        if (!contract) continue
        for (var j = 0; j < contract.attrs.length; j++) {
            var a = contract.attrs[j]
            srv.runCommandSilent('attribute ' + player.username + ' ' + a.attr + ' modifier remove ' + a.id)
            srv.runCommandSilent('attribute ' + player.username + ' ' + a.attr + ' modifier add ' + a.id + ' ' + a.amount + ' ' + (a.op || 'add_value'))
        }
    }
}

function dissonantFindPlayer(server, name) {
    try {
        var players = server.getPlayerList().getPlayers()
        var iter = players.iterator()
        while (iter.hasNext()) {
            var p = iter.next()
            if (String(p.username) === name) return p
        }
    } catch(e) {
        try {
            var players = server.getPlayerList().getPlayers()
            for (var i = 0; i < players.size(); i++) {
                if (String(players.get(i).username) === name) return players.get(i)
            }
        } catch(e2) {}
    }
    return null
}

function dissonantGiveItem(player) {
    var itemId = DISSONANT_CONTRACT_ITEMS[Math.floor(Math.random() * DISSONANT_CONTRACT_ITEMS.length)]
    player.level.getServer().runCommandSilent('give ' + player.username + ' ' + itemId + '[enchantments={levels:{"minecraft:binding_curse":1,"minecraft:vanishing_curse":1}}]')
}

function dissonantTellraw(player, components) {
    var wrapped = [components[0],
        { text: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n', color: 'dark_red', bold: true }
    ]
    for (var i = 1; i < components.length; i++) wrapped.push(components[i])
    wrapped.push({ text: '\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬', color: 'dark_red', bold: true })
    player.level.getServer().runCommandSilent('tellraw ' + player.username + ' ' + JSON.stringify(wrapped))
}

function dissonantClearFlow(player) {
    player.persistentData.remove('dissonant_flow_target')
    player.persistentData.remove('dissonant_flow_step')
    player.persistentData.remove('dissonant_flow_contract')
}

function dissonantClearIncoming(player) {
    player.persistentData.remove('dissonant_incoming_from')
    player.persistentData.remove('dissonant_incoming_contract')
    player.persistentData.remove('dissonant_incoming_type')
}

function dissonantGetFlowVal(player, key) {
    return player.persistentData.contains(key) ? String(player.persistentData.getString(key)) : ''
}

function dissonantSendSelectPlayer(dissonant) {
    var nearby = []
    try {
        var players = dissonant.level.players
        var iter = players.iterator()
        while (iter.hasNext()) {
            var p = iter.next()
            if (String(p.uuid) === String(dissonant.uuid)) continue
            var dx = p.x - dissonant.x, dy = p.y - dissonant.y, dz = p.z - dissonant.z
            if (dx*dx + dy*dy + dz*dz <= 25) nearby.push(String(p.username))
        }
    } catch(e) {}

    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: 'Select a target:\n', color: 'gray' },
        {
            text: '[ Yourself ]',
            color: 'gold', bold: true,
            clickEvent: { action: 'run_command', value: '/dissonant select _self' }
        }
    ]
    for (var i = 0; i < nearby.length; i++) {
        parts.push({ text: '  ' })
        parts.push({
            text: '[ ' + nearby[i] + ' ]',
            color: 'yellow', bold: true,
            clickEvent: { action: 'run_command', value: '/dissonant select ' + nearby[i] }
        })
    }
    parts.push({ text: '  ' })
    parts.push({ text: '[ Cancel ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant cancel' } })
    dissonantTellraw(dissonant, parts)
}

function dissonantSendActionMenu(dissonant, targetName) {
    var display = targetName === '_self' ? 'yourself' : targetName
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: 'Target: ', color: 'gray' },
        { text: display + '\n', color: 'yellow' },
        { text: '[ Make Contract ]', color: 'light_purple', bold: true, clickEvent: { action: 'run_command', value: '/dissonant action contract' } },
        { text: '  ' },
        { text: '[ Give Item ]', color: 'aqua', bold: true, clickEvent: { action: 'run_command', value: '/dissonant action item' } },
        { text: '  ' },
        { text: '[ Remove Contract ]', color: 'red', clickEvent: { action: 'run_command', value: '/dissonant action remove' } },
        { text: '  ' },
        { text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } }
    ]
    dissonantTellraw(dissonant, parts)
}

function dissonantSendcontractMenu(dissonant) {
    var targetName = dissonantGetFlowVal(dissonant, 'dissonant_flow_target')
    var targetPlayer = targetName === '_self' ? dissonant : dissonantFindPlayer(dissonant.level.getServer(), targetName)
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: 'Choose a Contract:\n', color: 'gray' }
    ]
    for (var i = 0; i < DISSONANT_CONTRACTS.length; i++) {
        var p = DISSONANT_CONTRACTS[i]
        if (p.originReq && (!targetPlayer || targetPlayer.persistentData.getInt(p.originReq) !== 1)) continue
        parts.push({ text: '\n  ' })
        parts.push({
            text: '[ ' + p.short + ' ]',
            color: p.color || 'light_purple',
            clickEvent: { action: 'run_command', value: '/dissonant contract ' + p.id },
            hoverEvent: { action: 'show_text', value: p.desc }
        })
        parts.push({ text: ' — ', color: 'dark_gray' })
        parts.push({ text: p.name, color: 'gray', italic: true })
    }
    parts.push({ text: '\n' })
    parts.push({ text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } })
    dissonantTellraw(dissonant, parts)
}

function dissonantSendRemoveMenu(dissonant, targetcontracts) {
    if (targetcontracts.length === 0) {
        var emptyParts = ['',
            { text: '[', color: 'dark_red' },
            { text: '♦ Soul Contractor', color: 'red', bold: true },
            { text: '] ', color: 'dark_red' },
            { text: 'No active Contracts to remove.\n', color: 'gray' },
            { text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } }
        ]
        dissonantTellraw(dissonant, emptyParts)
        return
    }
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: 'Remove which Contract?\n', color: 'gray' }
    ]
    for (var i = 0; i < targetcontracts.length; i++) {
        var p = dissonantGetcontract(targetcontracts[i])
        if (!p) continue
        if (i > 0) parts.push({ text: '  ' })
        parts.push({
            text: '[ ' + p.short + ' ]',
            color: 'red',
            clickEvent: { action: 'run_command', value: '/dissonant remove ' + p.id },
            hoverEvent: { action: 'show_text', value: p.desc }
        })
    }
    parts.push({ text: '\n' })
    parts.push({ text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } })
    dissonantTellraw(dissonant, parts)
}

function dissonantSendConfirm(dissonant, targetName, contract, isRemove) {
    var display = targetName === '_self' ? 'yourself' : targetName
    var action = isRemove ? 'Remove' : 'Offer'
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: action + ' ', color: 'gray' },
        { text: contract.name, color: 'light_purple' },
        { text: ' to ' + display + '?\n', color: 'gray' },
        { text: contract.desc + '\n', color: 'dark_gray', italic: true },
        { text: '[ Confirm ]', color: 'green', bold: true, clickEvent: { action: 'run_command', value: '/dissonant confirm' } },
        { text: '  ' },
        { text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } }
    ]
    dissonantTellraw(dissonant, parts)
}

function dissonantSendItemConfirm(dissonant, targetName) {
    var display = targetName === '_self' ? 'yourself' : targetName
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' },
        { text: 'Give a Contract item to ' + display + '?\n', color: 'gray' },
        { text: '[ Confirm ]', color: 'green', bold: true, clickEvent: { action: 'run_command', value: '/dissonant confirm' } },
        { text: '  ' },
        { text: '[ Back ]', color: 'dark_gray', clickEvent: { action: 'run_command', value: '/dissonant back' } }
    ]
    dissonantTellraw(dissonant, parts)
}

function dissonantSendInvite(target, dissonantName, contract, type) {
    var parts = ['',
        { text: '[', color: 'dark_red' },
        { text: '♦ Soul Contractor', color: 'red', bold: true },
        { text: '] ', color: 'dark_red' }
    ]
    if (type === 'contract') {
        parts.push({ text: dissonantName, color: 'yellow' })
        parts.push({ text: ' offers you ', color: 'gray' })
        parts.push({ text: contract.name, color: 'light_purple' })
        parts.push({ text: ':\n', color: 'gray' })
        parts.push({ text: contract.desc + '\n', color: 'dark_gray', italic: true })
    } else if (type === 'remove') {
        parts.push({ text: dissonantName, color: 'yellow' })
        parts.push({ text: ' wants to remove your ', color: 'gray' })
        parts.push({ text: contract.name, color: 'light_purple' })
        parts.push({ text: '.\n', color: 'gray' })
    } else {
        parts.push({ text: dissonantName, color: 'yellow' })
        parts.push({ text: ' offers you a gift.\n', color: 'gray' })
    }
    parts.push({ text: '[ Accept ]', color: 'green', bold: true, clickEvent: { action: 'run_command', value: '/dissonant accept' } })
    parts.push({ text: '  ' })
    parts.push({ text: '[ Deny ]', color: 'red', bold: true, clickEvent: { action: 'run_command', value: '/dissonant deny' } })
    dissonantTellraw(target, parts)
}


NeoOriginsEvents.originChosen(function(event) {
    if (String(event.getOriginId()) !== 'cat-astrophe:dissonant') return
    var player = event.getPlayer()
    player.persistentData.putInt('dissonant_is_owner', 1)
    player.tags.add('dissonant_owner')
    player.tags.remove('dissonant_lost_pending')
})

NeoOriginsEvents.originChanged(function(event) {
    var player = event.getPlayer()
    dissonantPurgeAllcontracts(player)
    if (String(event.getOldOriginId()) === 'cat-astrophe:dissonant') {
        player.tags.add('dissonant_lost_pending')
    }
})

PlayerEvents.loggedIn(function(event) {
    var player = event.player
    if (player.persistentData.contains('dissonant_contracts')) {
        dissonantRestoreAttrs(player)
        dissonantRestoreFx(player)
        var revenantDrain = player.persistentData.getInt('dissonant_revenant_drain')
        if (revenantDrain > 0) {
            player.level.getServer().runCommandSilent('attribute ' + player.username + ' minecraft:generic.max_health modifier add dissonant:revenant_drain -' + revenantDrain + ' add_value')
        }
    }
    if (player.persistentData.getInt('dissonant_is_owner') !== 1) return
    player.tags.add('dissonant_owner')
    player.tags.remove('dissonant_lost_pending')
})

PlayerEvents.loggedOut(function(event) {
    var player = event.player
    dissonantClearFlow(player)
    dissonantClearIncoming(player)
    player.tags.remove('dissonant_owner')
    var username = String(player.username)
    try {
        var allPlayers = player.level.getServer().getPlayerList().getPlayers()
        var iter = allPlayers.iterator()
        while (iter.hasNext()) {
            var p = iter.next()
            if (String(p.uuid) === String(player.uuid)) continue
            if (!p.persistentData.contains('dissonant_incoming_from')) continue
            if (String(p.persistentData.getString('dissonant_incoming_from')) !== username) continue
            dissonantClearIncoming(p)
            p.tell(Text.of('§c[♦ Soul Contractor] §7The dissonant has left. The offer is void.'))
        }
    } catch(e) {}
})

PlayerEvents.tick(function(event) {
    var player = event.player

    if (player.tags.contains('dissonant_lost_pending')) {
        player.persistentData.putInt('dissonant_is_owner', 0)
        player.tags.remove('dissonant_lost_pending')
        player.tags.remove('dissonant_owner')
        dissonantClearFlow(player)
        return
    }

    if (player.level.time % 1200 === 0) {
        if (player.persistentData.contains('dissonant_contracts')) dissonantRestoreFx(player)
    }
})

NeoOriginsEvents.powerActivated(function(event) {
    if (String(event.getPowerId()) !== 'cat-astrophe:dissonant_contract_broker') return
    var player = event.getPlayer()
    player.tags.remove('dissonant_broker_activated')
    var srv = player.level.getServer()
    srv.runCommandSilent('playsound minecraft:block.enchantment_table.use ambient ' + player.username + ' ' + player.x + ' ' + player.y + ' ' + player.z + ' 1 0.6')
    srv.runCommandSilent('particle minecraft:soul_fire_flame ' + player.x + ' ' + (player.y + 1) + ' ' + player.z + ' 0.4 0.7 0.4 0.02 25')
    dissonantClearFlow(player)
    dissonantSendSelectPlayer(player)
})

EntityEvents.afterHurt(function(event) {
    var entity = event.entity
    var player = event.source.player
    if (!player) return
    if (player.persistentData.getInt('automaton_is_owner') !== 1) return
    var contracts = dissonantGetPlayercontracts(player)
    var hasOverclock = false
    for (var i = 0; i < contracts.length; i++) {
        if (contracts[i] === 'overclock') { hasOverclock = true; break }
    }
    if (!hasOverclock) return
    var momentum = player.persistentData.getInt('automaton_momentum')
    if (momentum < 80) return
    entity.tags.add('overclock_target')
    player.level.getServer().runCommandSilent('effect give @e[tag=overclock_target] ars_elemental:static_charged 5 0 false')
    entity.tags.remove('overclock_target')
    player.persistentData.putInt('automaton_momentum', Math.max(0, momentum - 40))
})

EntityEvents.death(function(event) {
    var entity = event.entity
    if (!entity.player) return
    var player = entity
    var contracts = dissonantGetPlayercontracts(player)
    var hasRevenant = false
    for (var i = 0; i < contracts.length; i++) {
        if (contracts[i] === 'revenant') { hasRevenant = true; break }
    }
    if (!hasRevenant) return
    if (player.maxHealth <= 4) return
    player.persistentData.putDouble('dissonant_revenant_x', player.x)
    player.persistentData.putDouble('dissonant_revenant_y', player.y)
    player.persistentData.putDouble('dissonant_revenant_z', player.z)
    player.persistentData.putString('dissonant_revenant_dim', String(player.level.dimension))
    player.persistentData.putInt('dissonant_revenant_pending', 1)
    var newDrain = player.persistentData.getInt('dissonant_revenant_drain') + 2
    player.persistentData.putInt('dissonant_revenant_drain', newDrain)
    var srv = player.level.getServer()
    srv.runCommandSilent('attribute ' + player.username + ' minecraft:generic.max_health modifier remove dissonant:revenant_drain')
    srv.runCommandSilent('attribute ' + player.username + ' minecraft:generic.max_health modifier add dissonant:revenant_drain -' + newDrain + ' add_value')
})

PlayerEvents.respawned(function(event) {
    var player = event.player
    var srv = player.level.getServer()
    if (player.persistentData.contains('dissonant_contracts')) {
        dissonantRestoreAttrs(player)
        var revenantDrain = player.persistentData.getInt('dissonant_revenant_drain')
        if (revenantDrain > 0) {
            srv.runCommandSilent('attribute ' + player.username + ' minecraft:generic.max_health modifier add dissonant:revenant_drain -' + revenantDrain + ' add_value')
        }
        dissonantRestoreFx(player)
    }
    if (player.persistentData.getInt('dissonant_revenant_pending') !== 1) return
    player.persistentData.putInt('dissonant_revenant_pending', 0)
    var x = player.persistentData.getDouble('dissonant_revenant_x')
    var y = player.persistentData.getDouble('dissonant_revenant_y')
    var z = player.persistentData.getDouble('dissonant_revenant_z')
    var dim = player.persistentData.contains('dissonant_revenant_dim') ? String(player.persistentData.getString('dissonant_revenant_dim')) : ''
    if (dim) {
        srv.runCommandSilent('execute in ' + dim + ' run teleport ' + player.username + ' ' + x + ' ' + y + ' ' + z)
    } else {
        srv.runCommandSilent('teleport ' + player.username + ' ' + x + ' ' + y + ' ' + z)
    }
    srv.runCommandSilent('effect clear ' + player.username)
    dissonantRestoreFx(player)
    player.setHealth(2.0)
    player.displayClientMessage(Text.of('§8[§4† Revenant§8] §7The contract holds.'), true)
})

ServerEvents.commandRegistry(function(event) {
    var JACommands = Java.loadClass('net.minecraft.commands.Commands')
    var JAString = Java.loadClass('com.mojang.brigadier.arguments.StringArgumentType')

    event.register(
        JACommands.literal('dissonant')

        .then(JACommands.literal('select')
            .then(JACommands.argument('target', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player || !player.tags.contains('dissonant_owner')) return 0
                    var targetName = JAString.getString(ctx, 'target')
                    player.persistentData.putString('dissonant_flow_target', targetName)
                    player.persistentData.putString('dissonant_flow_step', 'action')
                    dissonantSendActionMenu(player, targetName)
                    return 1
                })
            )
        )

        .then(JACommands.literal('action')
            .then(JACommands.argument('type', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player || !player.tags.contains('dissonant_owner')) return 0
                    var targetName = dissonantGetFlowVal(player, 'dissonant_flow_target')
                    if (!targetName) return 0
                    var type = JAString.getString(ctx, 'type')
                    if (type === 'contract') {
                        player.persistentData.putString('dissonant_flow_step', 'contract')
                        dissonantSendcontractMenu(player)
                    } else if (type === 'item') {
                        player.persistentData.putString('dissonant_flow_step', 'confirm_item')
                        dissonantSendItemConfirm(player, targetName)
                    } else if (type === 'remove') {
                        var targetPlayer = targetName === '_self' ? player : dissonantFindPlayer(player.level.getServer(), targetName)
                        var targetcontracts = targetPlayer ? dissonantFilterRemovable(String(player.username), targetPlayer, dissonantGetPlayercontracts(targetPlayer)) : []
                        player.persistentData.putString('dissonant_flow_step', 'remove')
                        dissonantSendRemoveMenu(player, targetcontracts)
                    }
                    return 1
                })
            )
        )

        .then(JACommands.literal('contract')
            .then(JACommands.argument('contractid', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player || !player.tags.contains('dissonant_owner')) return 0
                    var targetName = dissonantGetFlowVal(player, 'dissonant_flow_target')
                    if (!targetName) return 0
                    var contractId = JAString.getString(ctx, 'contractid')
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) return 0
                    player.persistentData.putString('dissonant_flow_contract', contractId)
                    player.persistentData.putString('dissonant_flow_step', 'confirm_contract')
                    dissonantSendConfirm(player, targetName, contract, false)
                    return 1
                })
            )
        )

        .then(JACommands.literal('remove')
            .then(JACommands.argument('contractid', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player || !player.tags.contains('dissonant_owner')) return 0
                    var targetName = dissonantGetFlowVal(player, 'dissonant_flow_target')
                    if (!targetName) return 0
                    var contractId = JAString.getString(ctx, 'contractid')
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) return 0
                    var removeTarget = targetName === '_self' ? player : dissonantFindPlayer(player.level.getServer(), targetName)
                    if (!dissonantCanRemovecontract(String(player.username), removeTarget, contractId)) {
                        player.tell(Text.of('§c[♦ Soul Contractor] §7That Contract was sealed by another Dissonant.'))
                        return 0
                    }
                    player.persistentData.putString('dissonant_flow_contract', contractId)
                    player.persistentData.putString('dissonant_flow_step', 'confirm_remove')
                    dissonantSendConfirm(player, targetName, contract, true)
                    return 1
                })
            )
        )

        .then(JACommands.literal('confirm')
            .executes(function(ctx) {
                var player = null
                try { player = ctx.getSource().getPlayer() } catch(e) {}
                if (!player || !player.tags.contains('dissonant_owner')) return 0
                var step = dissonantGetFlowVal(player, 'dissonant_flow_step')
                var targetName = dissonantGetFlowVal(player, 'dissonant_flow_target')
                var contractId = dissonantGetFlowVal(player, 'dissonant_flow_contract')
                if (!targetName) return 0
                var srv = player.level.getServer()

                if (step === 'confirm_contract') {
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) { dissonantClearFlow(player); return 0 }
                    if (targetName === '_self') {
                        dissonantApplycontract(player, contractId, String(player.username))
                        dissonantApplyCost(player)
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Contract sealed.'))
                    } else {
                        var tp = dissonantFindPlayer(srv, targetName)
                        if (!tp) {
                            player.tell(Text.of('§c[♦ Soul Contractor] §7Target is no longer reachable.'))
                            dissonantClearFlow(player)
                            return 0
                        }
                        tp.persistentData.putString('dissonant_incoming_from', String(player.username))
                        tp.persistentData.putString('dissonant_incoming_contract', contractId)
                        tp.persistentData.putString('dissonant_incoming_type', 'contract')
                        dissonantSendInvite(tp, String(player.username), contract, 'contract')
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Awaiting §e' + targetName + '§7\'s response…'))
                    }
                    dissonantClearFlow(player)

                } else if (step === 'confirm_remove') {
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) { dissonantClearFlow(player); return 0 }
                    if (targetName === '_self') {
                        if (!dissonantCanRemovecontract(String(player.username), player, contractId)) {
                            player.tell(Text.of('§c[♦ Soul Contractor] §7That Contract was sealed by another dissonant.'))
                            dissonantClearFlow(player)
                            return 0
                        }
                        var ok = dissonantRemovecontract(player, contractId)
                        player.tell(Text.of(ok ? '§c[♦ Soul Contractor] §7Contract broken.' : '§c[♦ Soul Contractor] §7You don\'t have that Contract.'))
                    } else {
                        var tp = dissonantFindPlayer(srv, targetName)
                        if (!tp) {
                            player.tell(Text.of('§c[♦ Soul Contractor] §7Target is no longer reachable.'))
                            dissonantClearFlow(player)
                            return 0
                        }
                        tp.persistentData.putString('dissonant_incoming_from', String(player.username))
                        tp.persistentData.putString('dissonant_incoming_contract', contractId)
                        tp.persistentData.putString('dissonant_incoming_type', 'remove')
                        dissonantSendInvite(tp, String(player.username), contract, 'remove')
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Awaiting §e' + targetName + '§7\'s response…'))
                    }
                    dissonantClearFlow(player)

                } else if (step === 'confirm_item') {
                    if (targetName === '_self') {
                        dissonantGiveItem(player)
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Gift given.'))
                    } else {
                        var tp = dissonantFindPlayer(srv, targetName)
                        if (!tp) {
                            player.tell(Text.of('§c[♦ Soul Contractor] §7Target is no longer reachable.'))
                            dissonantClearFlow(player)
                            return 0
                        }
                        tp.persistentData.putString('dissonant_incoming_from', String(player.username))
                        tp.persistentData.putString('dissonant_incoming_type', 'item')
                        dissonantSendInvite(tp, String(player.username), null, 'item')
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Awaiting §e' + targetName + '§7\'s response…'))
                    }
                    dissonantClearFlow(player)
                }
                return 1
            })
        )

        .then(JACommands.literal('accept')
            .executes(function(ctx) {
                var player = null
                try { player = ctx.getSource().getPlayer() } catch(e) {}
                if (!player) return 0
                var fromName = dissonantGetFlowVal(player, 'dissonant_incoming_from')
                if (!fromName) return 0
                var type = dissonantGetFlowVal(player, 'dissonant_incoming_type')
                var srv = player.level.getServer()
                var dissonant = dissonantFindPlayer(srv, fromName)

                if (type === 'contract') {
                    var contractId = dissonantGetFlowVal(player, 'dissonant_incoming_contract')
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) { dissonantClearIncoming(player); return 0 }
                    dissonantApplycontract(player, contractId, fromName)
                    if (dissonant) dissonantApplyCost(dissonant)
                    player.tell(Text.of('§c[♦ Soul Contractor] §7You accepted the §d' + contract.name + '§7.'))
                    if (dissonant) dissonant.tell(Text.of('§c[♦ Soul Contractor] §e' + String(player.username) + ' §7accepted §d' + contract.name + '§7.'))

                } else if (type === 'remove') {
                    var contractId = dissonantGetFlowVal(player, 'dissonant_incoming_contract')
                    var contract = dissonantGetcontract(contractId)
                    if (!contract) { dissonantClearIncoming(player); return 0 }
                    if (!dissonantCanRemovecontract(fromName, player, contractId)) {
                        player.tell(Text.of('§c[♦ Soul Contractor] §7That Contract was sealed by a different dissonant.'))
                        if (dissonant) dissonant.tell(Text.of('§c[♦ Soul Contractor] §7You did not seal that Contract.'))
                        dissonantClearIncoming(player)
                        return 0
                    }
                    var ok = dissonantRemovecontract(player, contractId)
                    player.tell(Text.of(ok ? '§c[♦ Soul Contractor] §7contract broken.' : '§c[♦ Soul Contractor] §7Contract not found.'))
                    if (dissonant) dissonant.tell(Text.of('§c[♦ Soul Contractor] §e' + String(player.username) + '§7\'s §d' + contract.name + ' §7was broken.'))

                } else if (type === 'item') {
                    dissonantGiveItem(player)
                    player.tell(Text.of('§c[♦ Soul Contractor] §7You received a gift.'))
                    if (dissonant) dissonant.tell(Text.of('§c[♦ Soul Contractor] §e' + String(player.username) + ' §7accepted your gift.'))
                }

                dissonantClearIncoming(player)
                return 1
            })
        )

        .then(JACommands.literal('deny')
            .executes(function(ctx) {
                var player = null
                try { player = ctx.getSource().getPlayer() } catch(e) {}
                if (!player) return 0
                var fromName = dissonantGetFlowVal(player, 'dissonant_incoming_from')
                if (!fromName) return 0
                player.tell(Text.of('§c[♦ Soul Contractor] §7You refused.'))
                var dissonant = dissonantFindPlayer(player.level.getServer(), fromName)
                if (dissonant) dissonant.tell(Text.of('§c[♦ Soul Contractor] §e' + String(player.username) + ' §7refused.'))
                dissonantClearIncoming(player)
                return 1
            })
        )

        .then(JACommands.literal('purge')
            .then(JACommands.argument('target', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player || !player.tags.contains('dissonant_owner')) return 0
                    var targetName = JAString.getString(ctx, 'target')
                    var srv = player.level.getServer()
                    var tp = String(targetName) === String(player.username) ? player : dissonantFindPlayer(srv, targetName)
                    if (!tp) {
                        player.tell(Text.of('§c[♦ Soul Contractor] §7Target not found or offline.'))
                        return 0
                    }
                    dissonantPurgeAllcontracts(tp)
                    player.tell(Text.of('§c[♦ Soul Contractor] §7All contracts purged from §e' + targetName + '§7.'))
                    if (String(tp.username) !== String(player.username)) {
                        tp.tell(Text.of('§c[♦ Soul Contractor] §7All your Contracts have been dissolved by the dissonant.'))
                    }
                    return 1
                })
            )
        )

        .then(JACommands.literal('back')
            .executes(function(ctx) {
                var player = null
                try { player = ctx.getSource().getPlayer() } catch(e) {}
                if (!player || !player.tags.contains('dissonant_owner')) return 0
                var step = dissonantGetFlowVal(player, 'dissonant_flow_step')
                var targetName = dissonantGetFlowVal(player, 'dissonant_flow_target')
                var srv = player.level.getServer()
                if (step === 'action') {
                    player.persistentData.remove('dissonant_flow_step')
                    player.persistentData.remove('dissonant_flow_target')
                    dissonantSendSelectPlayer(player)
                } else if (step === 'contract') {
                    player.persistentData.putString('dissonant_flow_step', 'action')
                    dissonantSendActionMenu(player, targetName)
                } else if (step === 'remove') {
                    player.persistentData.putString('dissonant_flow_step', 'action')
                    dissonantSendActionMenu(player, targetName)
                } else if (step === 'confirm_contract') {
                    player.persistentData.putString('dissonant_flow_step', 'contract')
                    player.persistentData.remove('dissonant_flow_contract')
                    dissonantSendcontractMenu(player)
                } else if (step === 'confirm_remove') {
                    player.persistentData.putString('dissonant_flow_step', 'remove')
                    player.persistentData.remove('dissonant_flow_contract')
                    var backTarget = targetName === '_self' ? player : dissonantFindPlayer(srv, targetName)
                    var targetcontracts = backTarget ? dissonantFilterRemovable(String(player.username), backTarget, dissonantGetPlayercontracts(backTarget)) : []
                    dissonantSendRemoveMenu(player, targetcontracts)
                } else if (step === 'confirm_item') {
                    player.persistentData.putString('dissonant_flow_step', 'action')
                    dissonantSendActionMenu(player, targetName)
                } else {
                    dissonantClearFlow(player)
                    dissonantSendSelectPlayer(player)
                }
                return 1
            })
        )

        .then(JACommands.literal('give')
            .then(JACommands.argument('contractid', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player) return 0
                    if (!ctx.getSource().hasPermission(2)) {
                        player.tell(Text.of('§c[♦ Dev] §7Requires op.'))
                        return 0
                    }
                    var contractId = JAString.getString(ctx, 'contractid')
                    var ok = dissonantApplycontract(player, contractId, String(player.username))
                    player.tell(Text.of(ok ? '§c[♦ Dev] §7Contract applied: §d' + contractId : '§c[♦ Dev] §7Unknown or already active contract: §d' + contractId))
                    return ok ? 1 : 0
                })
            )
        )

        .then(JACommands.literal('ungive')
            .then(JACommands.argument('contractid', JAString.word())
                .executes(function(ctx) {
                    var player = null
                    try { player = ctx.getSource().getPlayer() } catch(e) {}
                    if (!player) return 0
                    if (!ctx.getSource().hasPermission(2)) {
                        player.tell(Text.of('§c[♦ Dev] §7Requires op.'))
                        return 0
                    }
                    var contractId = JAString.getString(ctx, 'contractid')
                    var ok = dissonantRemovecontract(player, contractId)
                    player.tell(Text.of(ok ? '§c[♦ Dev] §7Contract removed: §d' + contractId : '§c[♦ Dev] §7contract not found: §d' + contractId))
                    return ok ? 1 : 0
                })
            )
        )

        .then(JACommands.literal('cancel')
            .executes(function(ctx) {
                var player = null
                try { player = ctx.getSource().getPlayer() } catch(e) {}
                if (!player) return 0
                dissonantClearFlow(player)
                player.tell(Text.of('§c[♦ Soul Contractor] §7Cancelled.'))
                return 1
            })
        )
    )
})
