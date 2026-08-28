(function () {
    var KEY_ID = 'stompeez_dash'
    var CHANNEL = 'stompeez_dash'
    KeyBindEvents.pressed(KEY_ID, event => {
        var player = event.player || Client.player
        if (!player) return
        var forward = player.input.forwardImpulse
        var strafe = player.input.leftImpulse
        var yaw = player.yRot * Math.PI / 180
        var x = 0
        var z = 0
        if (Math.abs(forward) > 0.001 || Math.abs(strafe) > 0.001) {
            x = -Math.sin(yaw) * forward + Math.cos(yaw) * strafe
            z = Math.cos(yaw) * forward + Math.sin(yaw) * strafe
            var horizontalLength = Math.sqrt(x * x + z * z)
            if (horizontalLength > 0.001) {
                x /= horizontalLength
                z /= horizontalLength
            }
        }
        player.sendData(CHANNEL, {
            moveX: x,
            moveZ: z
        })
    })
    ClientEvents.lang('en_us', event => {
        event.add('key.kubejs.stompeez_dash', 'STOMPEEZ Boost')
    })
})()
