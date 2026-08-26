var OriginChangedEventClass = Java.loadClass('com.cyberday1.neoorigins.api.event.OriginChangedEvent')
var NeoForgeCommon = Java.loadClass('net.neoforged.neoforge.common.NeoForge')
var EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')

NeoForgeCommon.EVENT_BUS.addListener(EventPriority.NORMAL, OriginChangedEventClass, function(event) {
    try {
        var player = event.getEntity()
        if (player === null) return
        var newOrigin = event.getNewOrigin()
        var newPath = newOrigin !== null ? String(newOrigin.getPath()) + '_owner' : ''
        var pending = []
        var iter = player.getTags().iterator()
        while (iter.hasNext()) {
            var tag = String(iter.next())
            if (tag.length > 6 && tag.substring(tag.length - 6) === '_owner' && tag !== newPath) {
                pending.push(tag.substring(0, tag.length - 6) + '_lost_pending')
            }
        }
        for (var i = 0; i < pending.length; i++) {
            player.addTag(pending[i])
        }
    } catch(e) {
        console.error('[Origins] listener error: ' + e)
    }
})
