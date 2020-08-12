'use strict'

const Animations = {}

export function Animate(currentState, change, context) {
    return new Promise((resolve, reject) => {
        let duration = 0
        const newState = change.newState

        const anim = Animations[change.name]
        if (anim) {
            // play the animation
            anim.animate(currentState, change, context)

            // use the found animation duration
            duration = anim.duration
        }

        // Create a timer for promise resolve
        setTimeout(() => resolve(newState), duration)
    })
}
